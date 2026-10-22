// Dastur ikonkasi: non qobiği rangidagi yumaloq kvadrat ustida "ö". Ishlatish: swift make-app-icon.swift <chiqish.png>
import AppKit
let size: CGFloat = 1024
let rep = NSBitmapImageRep(bitmapDataPlanes: nil, pixelsWide: Int(size), pixelsHigh: Int(size), bitsPerSample: 8,
                           samplesPerPixel: 4, hasAlpha: true, isPlanar: false, colorSpaceName: .deviceRGB,
                           bytesPerRow: 0, bitsPerPixel: 0)!
NSGraphicsContext.saveGraphicsState()
NSGraphicsContext.current = NSGraphicsContext(bitmapImageRep: rep)
let inset: CGFloat = 100
let box = NSRect(x: inset, y: inset, width: size - 2 * inset, height: size - 2 * inset)
NSColor(srgbRed: 0.81, green: 0.54, blue: 0.20, alpha: 1).setFill()
NSBezierPath(roundedRect: box, xRadius: 185, yRadius: 185).fill()
let font = NSFont.systemFont(ofSize: 600, weight: .heavy)
let text = NSAttributedString(string: "ö", attributes: [.font: font,
    .foregroundColor: NSColor(srgbRed: 0.09, green: 0.07, blue: 0.05, alpha: 1)])
let t = text.size()
text.draw(at: NSPoint(x: (size - t.width) / 2, y: (size - t.height) / 2 + 20))
NSGraphicsContext.restoreGraphicsState()
try! rep.representation(using: .png, properties: [:])!.write(to: URL(fileURLWithPath: CommandLine.arguments[1]))
