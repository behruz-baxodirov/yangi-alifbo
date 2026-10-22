// Input menyusi uchun shablon ikonka: yumaloq ramka ichida "ö".
// Ishlatish: swift make-icon.swift <chiqish.tiff>
import AppKit

func rep(points: CGFloat, scale: CGFloat) -> NSBitmapImageRep {
    let px = Int(points * scale)
    let rep = NSBitmapImageRep(bitmapDataPlanes: nil, pixelsWide: px, pixelsHigh: px, bitsPerSample: 8,
                               samplesPerPixel: 4, hasAlpha: true, isPlanar: false,
                               colorSpaceName: .deviceRGB, bytesPerRow: 0, bitsPerPixel: 0)!
    rep.size = NSSize(width: points, height: points)
    NSGraphicsContext.saveGraphicsState()
    NSGraphicsContext.current = NSGraphicsContext(bitmapImageRep: rep)
    let box = NSRect(x: 0.75, y: 0.75, width: points - 1.5, height: points - 1.5)
    let frame = NSBezierPath(roundedRect: box, xRadius: 3.5, yRadius: 3.5)
    frame.lineWidth = 1.5
    NSColor.black.setStroke()
    frame.stroke()
    let font = NSFont.systemFont(ofSize: points * 0.72, weight: .bold)
    let text = NSAttributedString(string: "ö", attributes: [.font: font, .foregroundColor: NSColor.black])
    let size = text.size()
    text.draw(at: NSPoint(x: (points - size.width) / 2, y: (points - size.height) / 2 + points * 0.02))
    NSGraphicsContext.restoreGraphicsState()
    return rep
}

let output = CommandLine.arguments.dropFirst().first ?? "icon.tiff"
let image = NSImage(size: NSSize(width: 16, height: 16))
image.addRepresentation(rep(points: 16, scale: 1))
image.addRepresentation(rep(points: 16, scale: 2))
try! image.tiffRepresentation!.write(to: URL(fileURLWithPath: output))
print("icon: \(output)")
