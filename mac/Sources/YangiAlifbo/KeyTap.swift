import Cocoa
import AlifboCore
import os

let log = Logger(subsystem: "uz.yangialifbo", category: "tap")

/// Tizim darajasidagi tugma kuzatuvçisi (Accessibility ruxsati kerak).
/// Tugma ilovaga ötadi; Rewriter "öçir + yoz" desa, joriy tugma yutiladi va
/// Backspace + yangi harf yuboriladi.
final class KeyTap {
    /// Özimiz yuborgan tugmalarni taniş uçun belgi.
    private static let marker: Int64 = 0x59_41_4C_46
    private static let deleteKeyCode: CGKeyCode = 51

    private var tap: CFMachPort?
    private var rewriter = Rewriter(options: Settings.options)
    private let source = CGEventSource(stateID: .privateState)

    var isRunning: Bool { tap.map { CGEvent.tapIsEnabled(tap: $0) } ?? false }

    func updateOptions() {
        rewriter.options = Settings.options
        rewriter.reset()
    }

    func start() -> Bool {
        guard tap == nil else { return true }
        let types: [CGEventType] = [.keyDown, .leftMouseDown, .rightMouseDown, .otherMouseDown]
        let mask = types.reduce(CGEventMask(0)) { $0 | (1 << $1.rawValue) }
        let callback: CGEventTapCallBack = { _, type, event, info in
            let me = Unmanaged<KeyTap>.fromOpaque(info!).takeUnretainedValue()
            return me.handle(type: type, event: event)
        }
        guard let port = CGEvent.tapCreate(tap: .cgSessionEventTap, place: .headInsertEventTap,
                                           options: .defaultTap, eventsOfInterest: mask,
                                           callback: callback,
                                           userInfo: Unmanaged.passUnretained(self).toOpaque()) else {
            log.error("tapCreate failed (Accessibility ruxsati yöq?)")
            return false
        }
        tap = port
        let runLoopSource = CFMachPortCreateRunLoopSource(nil, port, 0)
        CFRunLoopAddSource(CFRunLoopGetMain(), runLoopSource, .commonModes)
        CGEvent.tapEnable(tap: port, enable: true)
        log.notice("tap started")
        return true
    }

    private func handle(type: CGEventType, event: CGEvent) -> Unmanaged<CGEvent>? {
        switch type {
        case .tapDisabledByTimeout, .tapDisabledByUserInput:
            if let tap { CGEvent.tapEnable(tap: tap, enable: true) }
            rewriter.reset()
            return Unmanaged.passUnretained(event)
        case .keyDown:
            break
        default:
            // Sichqoncha: kursor köçgan bölişi mumkin.
            rewriter.reset()
            return Unmanaged.passUnretained(event)
        }
        if event.getIntegerValueField(.eventSourceUserData) == Self.marker {
            return Unmanaged.passUnretained(event)
        }
        guard let nsEvent = NSEvent(cgEvent: event) else { return Unmanaged.passUnretained(event) }
        switch rewriter.handle(KeyMapper.input(for: nsEvent)) {
        case .pass:
            return Unmanaged.passUnretained(event)
        case .replace(let count, let text):
            log.debug("replace delete=\(count, privacy: .public) insertLength=\(text.count, privacy: .public)")
            post(deleting: count, inserting: text)
            return nil
        }
    }

    private func post(deleting count: Int, inserting text: String) {
        for _ in 0..<count {
            sendKey(code: Self.deleteKeyCode, text: nil)
        }
        sendKey(code: 0, text: text)
    }

    private func sendKey(code: CGKeyCode, text: String?) {
        for down in [true, false] {
            guard let e = CGEvent(keyboardEventSource: source, virtualKey: code, keyDown: down) else { continue }
            e.flags = []
            e.setIntegerValueField(.eventSourceUserData, value: Self.marker)
            if let text {
                var units = Array(text.utf16)
                e.keyboardSetUnicodeString(stringLength: units.count, unicodeString: &units)
            }
            e.post(tap: .cgSessionEventTap)
        }
    }
}
