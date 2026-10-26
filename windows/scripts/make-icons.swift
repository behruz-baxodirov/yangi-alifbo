// Windows ikonkalari: yoqilgan — non qobiği rangida "ö" (Mac ikonkasi bilan bir xil), öçiq — kulrangda "A".
// Har ölçam alohida çiziladi (16 px ham tiniq), PNG qatlamli .ico bölib yoziladi.
// Işlatiş: swift windows/scripts/make-icons.swift windows/icons
import AppKit

let sizes = [16, 20, 24, 32, 40, 48, 64, 256]

func png(_ size: Int, letter: String, bg: NSColor, fg: NSColor) -> Data {
    let s = CGFloat(size)
    let rep = NSBitmapImageRep(bitmapDataPlanes: nil, pixelsWide: size, pixelsHigh: size, bitsPerSample: 8,
                               samplesPerPixel: 4, hasAlpha: true, isPlanar: false, colorSpaceName: .deviceRGB,
                               bytesPerRow: 0, bitsPerPixel: 0)!
    NSGraphicsContext.saveGraphicsState()
    NSGraphicsContext.current = NSGraphicsContext(bitmapImageRep: rep)
    let inset = size <= 24 ? 0 : s * 0.04
    let box = NSRect(x: inset, y: inset, width: s - 2 * inset, height: s - 2 * inset)
    bg.setFill()
    NSBezierPath(roundedRect: box, xRadius: s * 0.2, yRadius: s * 0.2).fill()
    let font = NSFont.systemFont(ofSize: s * 0.78, weight: .heavy)
    let text = NSAttributedString(string: letter, attributes: [.font: font, .foregroundColor: fg])
    let t = text.size()
    text.draw(at: NSPoint(x: (s - t.width) / 2, y: (s - t.height) / 2 + s * 0.02))
    NSGraphicsContext.restoreGraphicsState()
    return rep.representation(using: .png, properties: [:])!
}

func ico(_ images: [(Int, Data)]) -> Data {
    var out = Data()
    func u16(_ v: Int) { out.append(contentsOf: [UInt8(v & 0xff), UInt8(v >> 8 & 0xff)]) }
    func u32(_ v: Int) { u16(v & 0xffff); u16(v >> 16) }
    u16(0); u16(1); u16(images.count)
    var offset = 6 + 16 * images.count
    for (size, data) in images {
        out.append(UInt8(size >= 256 ? 0 : size)); out.append(UInt8(size >= 256 ? 0 : size))
        out.append(0); out.append(0); u16(1); u16(32); u32(data.count); u32(offset)
        offset += data.count
    }
    for (_, data) in images { out.append(data) }
    return out
}

let dir = CommandLine.arguments[1]
let crust = NSColor(srgbRed: 0.81, green: 0.54, blue: 0.20, alpha: 1)
let char = NSColor(srgbRed: 0.09, green: 0.07, blue: 0.05, alpha: 1)
let grey = NSColor(srgbRed: 0.48, green: 0.44, blue: 0.41, alpha: 1)
let flour = NSColor(srgbRed: 0.98, green: 0.96, blue: 0.93, alpha: 1)
for (name, letter, bg, fg) in [("yoqilgan", "ö", crust, char), ("ochiq", "A", grey, flour)] {
    let data = ico(sizes.map { ($0, png($0, letter: letter, bg: bg, fg: fg)) })
    try! data.write(to: URL(fileURLWithPath: "\(dir)/\(name).ico"))
}
