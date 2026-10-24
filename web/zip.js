// Kiçik ZIP öqiş/yoziş (docx uçun): brauzerning özidagi deflate-raw oqimlari bilan, kutubxonasiz.
// Faqat oddiy arxivlar: şifrlangan va ZIP64 arxivlar rad etiladi.

const fail = () => { throw new Error("zip"); };

async function through(data, stream, limit = Infinity) {
  const reader = new Blob([data]).stream().pipeThrough(stream).getReader();
  const chunks = [];
  let length = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      length += value.length;
      if (length > limit) {
        await reader.cancel();
        throw new Error("zip-hajm");
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  const out = new Uint8Array(length);
  let offset = 0;
  for (const chunk of chunks) { out.set(chunk, offset); offset += chunk.length; }
  return out;
}

const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c >>> 0;
  }
  return table;
})();

function crc32(data) {
  let c = 0xffffffff;
  for (let i = 0; i < data.length; i++) c = CRC_TABLE[(c ^ data[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

/** Arxivdagi fayllar: markaziy katalog tartibida { name, data }. */
export async function readZip(bytes, { maxUncompressedBytes = 100 * 1024 * 1024 } = {}) {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const u32 = (o) => (o + 4 <= bytes.length ? view.getUint32(o, true) : fail());
  const u16 = (o) => (o + 2 <= bytes.length ? view.getUint16(o, true) : fail());
  let eocd = -1;
  for (let i = bytes.length - 22; i >= Math.max(0, bytes.length - 65557); i--) {
    if (view.getUint32(i, true) === 0x06054b50) { eocd = i; break; }
  }
  if (eocd < 0) fail();
  const count = u16(eocd + 10);
  let p = u32(eocd + 16);
  if (count === 0xffff || p === 0xffffffff) fail(); // ZIP64
  const directory = p, end = p + u32(eocd + 12);
  if (u16(eocd + 4) || u16(eocd + 6) || u16(eocd + 8) !== count || end > eocd) fail();
  const names = new TextDecoder();
  const entries = [];
  let expanded = 0;
  for (let k = 0; k < count; k++) {
    if (p + 46 > end || u32(p) !== 0x02014b50) fail();
    const flags = u16(p + 8), method = u16(p + 10), size = u32(p + 20);
    const unpacked = u32(p + 24), crc = u32(p + 16);
    const nameLen = u16(p + 28), extraLen = u16(p + 30), commentLen = u16(p + 32), local = u32(p + 42);
    if (flags & 1 || size === 0xffffffff || unpacked === 0xffffffff || local === 0xffffffff || p + 46 + nameLen + extraLen + commentLen > end) fail();
    if (unpacked > maxUncompressedBytes - expanded) throw new Error("zip-hajm");
    const name = names.decode(bytes.subarray(p + 46, p + 46 + nameLen));
    if (local + 30 > directory || u32(local) !== 0x04034b50 || u16(local + 8) !== method || u16(local + 6) & 1) fail();
    const start = local + 30 + u16(local + 26) + u16(local + 28);
    if (start + size > directory) fail();
    const raw = bytes.subarray(start, start + size);
    let data;
    if (method === 0) data = raw.slice();
    else if (method === 8) data = await through(raw, new DecompressionStream("deflate-raw"), maxUncompressedBytes - expanded);
    else fail();
    if (data.length > maxUncompressedBytes - expanded) throw new Error("zip-hajm");
    if (data.length !== unpacked || crc32(data) !== crc) fail();
    expanded += data.length;
    entries.push({ name, data });
    p += 46 + nameLen + extraLen + commentLen;
  }
  if (p !== end) fail();
  return entries;
}

/** { name, data } röyxatidan deflate bilan ZIP; sana doim 1980-01-01 (natija takrorlanadi). */
export async function writeZip(entries) {
  const enc = new TextEncoder();
  const parts = [], central = [];
  let offset = 0;
  for (const { name, data } of entries) {
    const nameBytes = enc.encode(name);
    const packed = await through(data, new CompressionStream("deflate-raw"));
    const crc = crc32(data);
    const head = new DataView(new ArrayBuffer(30));
    head.setUint32(0, 0x04034b50, true);
    head.setUint16(4, 20, true);
    head.setUint16(6, 0x0800, true); // UTF-8 nomlar
    head.setUint16(8, 8, true);
    head.setUint16(10, 0, true);
    head.setUint16(12, 0x21, true);
    head.setUint32(14, crc, true);
    head.setUint32(18, packed.length, true);
    head.setUint32(22, data.length, true);
    head.setUint16(26, nameBytes.length, true);
    parts.push(new Uint8Array(head.buffer), nameBytes, packed);
    const dir = new DataView(new ArrayBuffer(46));
    dir.setUint32(0, 0x02014b50, true);
    dir.setUint16(4, 20, true);
    dir.setUint16(6, 20, true);
    dir.setUint16(8, 0x0800, true);
    dir.setUint16(10, 8, true);
    dir.setUint16(14, 0x21, true);
    dir.setUint32(16, crc, true);
    dir.setUint32(20, packed.length, true);
    dir.setUint32(24, data.length, true);
    dir.setUint16(28, nameBytes.length, true);
    dir.setUint32(42, offset, true);
    central.push(new Uint8Array(dir.buffer), nameBytes);
    offset += 30 + nameBytes.length + packed.length;
  }
  const dirSize = central.reduce((n, b) => n + b.length, 0);
  const end = new DataView(new ArrayBuffer(22));
  end.setUint32(0, 0x06054b50, true);
  end.setUint16(8, entries.length, true);
  end.setUint16(10, entries.length, true);
  end.setUint32(12, dirSize, true);
  end.setUint32(16, offset, true);
  return new Uint8Array(await new Blob([...parts, ...central, new Uint8Array(end.buffer)]).arrayBuffer());
}
