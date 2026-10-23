// Kiçik ZIP öqiş/yoziş (docx uçun): brauzerning özidagi deflate-raw oqimlari bilan, kutubxonasiz.
// Faqat oddiy arxivlar: şifrlangan va ZIP64 arxivlar rad etiladi.

const fail = () => { throw new Error("zip"); };

async function through(data, stream) {
  const out = new Blob([data]).stream().pipeThrough(stream);
  return new Uint8Array(await new Response(out).arrayBuffer());
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
export async function readZip(bytes) {
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
  const names = new TextDecoder();
  const entries = [];
  for (let k = 0; k < count; k++) {
    if (u32(p) !== 0x02014b50) fail();
    const flags = u16(p + 8), method = u16(p + 10), size = u32(p + 20);
    const nameLen = u16(p + 28), extraLen = u16(p + 30), commentLen = u16(p + 32), local = u32(p + 42);
    if (flags & 1 || size === 0xffffffff || local === 0xffffffff) fail();
    const name = names.decode(bytes.subarray(p + 46, p + 46 + nameLen));
    if (u32(local) !== 0x04034b50) fail();
    const start = local + 30 + u16(local + 26) + u16(local + 28);
    const raw = bytes.subarray(start, start + size);
    let data;
    if (method === 0) data = raw.slice();
    else if (method === 8) data = await through(raw, new DecompressionStream("deflate-raw"));
    else fail();
    entries.push({ name, data });
    p += 46 + nameLen + extraLen + commentLen;
  }
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
