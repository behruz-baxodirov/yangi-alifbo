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
    private static let forwardDeleteKeyCode: CGKeyCode = 117

    private var tap: CFMachPort?
    private var rewriter = Rewriter(options: Settings.options)
    private var matcher = ShortcutMatcher(Settings.shortcut)
    /// Tanlangan yoqiş/öçiriş tugmasi bosilganda çaqiriladi.
    var onToggle: (() -> Void)?
    private let source = CGEventSource(stateID: .privateState)

    var isRunning: Bool { tap.map { CGEvent.tapIsEnabled(tap: $0) } ?? false }

    func updateOptions() {
        rewriter.options = Settings.options
        rewriter.reset()
        matcher = ShortcutMatcher(Settings.shortcut)
    }

    func start() -> Bool {
        guard tap == nil else { return true }
        let types: [CGEventType] = [.keyDown, .flagsChanged, .leftMouseDown, .rightMouseDown, .otherMouseDown]
        let mask = types.reduce(CGEventMask(0)) { $0 | (1 << $1.rawValue) }
        let callback: CGEventTapCallBack = { proxy, type, event, info in
            let me = Unmanaged<KeyTap>.fromOpaque(info!).takeUnretainedValue()
            return me.handle(proxy: proxy, type: type, event: event)
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
        // Har ilovaga birinçi Accessibility sörovi 30–90 ms oladi: uni yozişdan oldin, fonda qilib qöyamiz.
        NSWorkspace.shared.notificationCenter.addObserver(forName: NSWorkspace.didActivateApplicationNotification,
                                                          object: nil, queue: nil) { note in
            guard let app = note.userInfo?[NSWorkspace.applicationUserInfoKey] as? NSRunningApplication else { return }
            let pid = app.processIdentifier
            DispatchQueue.global(qos: .userInitiated).async {
                Self.requestAccessibilityTree(pid: pid)
                _ = Self.focusedSelectionLength(pid: pid)
            }
        }
        if let pid = NSWorkspace.shared.frontmostApplication?.processIdentifier {
            DispatchQueue.global(qos: .userInitiated).async { Self.requestAccessibilityTree(pid: pid) }
        }
        log.notice("tap started")
        return true
    }

    private func handle(proxy: CGEventTapProxy, type: CGEventType, event: CGEvent) -> Unmanaged<CGEvent>? {
        switch type {
        case .tapDisabledByTimeout, .tapDisabledByUserInput:
            if let tap { CGEvent.tapEnable(tap: tap, enable: true) }
            rewriter.reset()
            return Unmanaged.passUnretained(event)
        case .keyDown:
            break
        case .flagsChanged:
            if matcher.flagsChanged(Self.modifiers(event.flags), at: Self.seconds(event)) {
                rewriter.reset()
                onToggle?()
            }
            return Unmanaged.passUnretained(event)
        default:
            // Sichqoncha: kursor köçgan bölişi mumkin.
            rewriter.reset()
            return Unmanaged.passUnretained(event)
        }
        if event.getIntegerValueField(.eventSourceUserData) == Self.marker {
            return Unmanaged.passUnretained(event)
        }
        let code = UInt16(event.getIntegerValueField(.keyboardEventKeycode))
        if matcher.keyDown(code: code, modifiers: Self.modifiers(event.flags), at: Self.seconds(event)) {
            rewriter.reset()
            onToggle?()
            return nil
        }
        guard let nsEvent = NSEvent(cgEvent: event) else { return Unmanaged.passUnretained(event) }
        let input = KeyMapper.input(for: nsEvent)
        if input == .backspace, rewriter.options.enabled, let around = frontmostCursorContext() {
            if around.selectionLength > 0 {
                rewriter.deletedSelection()
                return Unmanaged.passUnretained(event)
            }
            // "cbh" da b öçirilsa (kursor b dan keyin): c va h birikib ç böladi.
            if let units = around.units, let letter = Alphabet.joinedLetter(aroundCursor: units) {
                log.debug("join \(String(letter), privacy: .public)")
                rewriter.reset()
                post(deleting: 2, forwardDeleting: 1, inserting: String(letter), via: proxy)
                return nil
            }
        }
        switch rewriter.handle(input) {
        case .pass:
            return Unmanaged.passUnretained(event)
        case .replace(let count, let text):
            let selection = frontmostSelectionLength()
            let backspaces = RewriteAction.backspaceCount(deleteBefore: count, selectionLength: selection)
            log.debug("replace delete=\(count, privacy: .public) selection=\(selection ?? -1, privacy: .public) backspaces=\(backspaces, privacy: .public)")
            post(deleting: backspaces, inserting: text, via: proxy)
            return nil
        }
    }

    /// Accessibility'ga javob bermagan ilova (pid → qaçongaça sörammaymiz).
    /// Aks holda bunday ilovada har almaştiriş 2 × timeout kutib qoladi.
    private var unresponsive: [pid_t: Date] = [:]

    private func frontmostSelectionLength() -> Int? {
        frontmost { element in Self.selectedRange(element)?.length }
    }

    /// Backspace oldidan kursor atrofi: [öçadiganning çapidagi, öçadigan, kursordan keyingi] UTF-16 birliklari.
    private struct CursorContext {
        var selectionLength: Int
        var units: [UInt16]?
    }

    private func frontmostCursorContext() -> CursorContext? {
        frontmost { element in
            guard let range = Self.selectedRange(element) else { return nil }
            var context = CursorContext(selectionLength: range.length)
            guard range.length == 0, range.location >= 2 else { return context }
            context.units = Self.text(element, CFRange(location: range.location - 2, length: 3))
            return context
        }
    }

    /// Oldingi ilovaning fokusdagi elementi bilan işlaydi; javob bermagan ilovani 30 s sörammaymiz.
    private func frontmost<T>(_ body: (AXUIElement) -> T?) -> T? {
        guard let pid = NSWorkspace.shared.frontmostApplication?.processIdentifier else { return nil }
        if let until = unresponsive[pid], until > Date() { return nil }
        var timedOut = false
        let element = Self.focusedElement(pid: pid, timedOut: &timedOut)
        unresponsive[pid] = timedOut ? Date().addingTimeInterval(30) : nil
        return element.flatMap(body)
    }

    /// Fokusdagi maydonda belgilangan matn uzunligi (Accessibility orqali; bilinmasa nil).
    /// Manzil qatori kabi joylar yozilayotgan sözning davomini belgilab taklif qiladi.
    /// Tizim bo'yiça (system-wide) so'rov Chrome'da işlamaydi, şuning uçun oldingi ilovadan so'raymiz.
    private static func focusedSelectionLength(pid: pid_t) -> Int? {
        var timedOut = false
        return focusedElement(pid: pid, timedOut: &timedOut).flatMap { selectedRange($0)?.length }
    }

    /// Electron ilovalari (Claude, Slack, VS Code…) Accessibility daraxtini faqat söralganda quradi;
    /// usiz kursor atrofi öqilmaydi va "cbh ← ⌫" birikmaydi. Boşqa ilovalar bu atributni e'tiborsiz qoldiradi.
    private static func requestAccessibilityTree(pid: pid_t) {
        let app = AXUIElementCreateApplication(pid)
        AXUIElementSetMessagingTimeout(app, 0.05)
        AXUIElementSetAttributeValue(app, "AXManualAccessibility" as CFString, kCFBooleanTrue)
    }

    private static func focusedElement(pid: pid_t, timedOut: inout Bool) -> AXUIElement? {
        let appElement = AXUIElementCreateApplication(pid)
        AXUIElementSetMessagingTimeout(appElement, 0.05)
        var focused: CFTypeRef?
        let focusedResult = AXUIElementCopyAttributeValue(appElement, kAXFocusedUIElementAttribute as CFString, &focused)
        timedOut = focusedResult == .cannotComplete
        guard focusedResult == .success,
              let focused, CFGetTypeID(focused) == AXUIElementGetTypeID() else { return nil }
        let element = focused as! AXUIElement
        AXUIElementSetMessagingTimeout(element, 0.05)
        return element
    }

    private static func selectedRange(_ element: AXUIElement) -> CFRange? {
        var value: CFTypeRef?
        guard AXUIElementCopyAttributeValue(element, kAXSelectedTextRangeAttribute as CFString, &value) == .success,
              let value, CFGetTypeID(value) == AXValueGetTypeID() else { return nil }
        var range = CFRange()
        guard AXValueGetValue(value as! AXValue, .cfRange, &range) else { return nil }
        return range
    }

    /// Maydondagi matn bölägi UTF-16 birliklarida (bilinmasa nil).
    private static func text(_ element: AXUIElement, _ range: CFRange) -> [UInt16]? {
        var range = range
        guard let parameter = AXValueCreate(.cfRange, &range) else { return nil }
        var value: CFTypeRef?
        guard AXUIElementCopyParameterizedAttributeValue(element, kAXStringForRangeParameterizedAttribute as CFString,
                                                         parameter, &value) == .success,
              let string = value as? String else { return nil }
        return Array(string.utf16)
    }

    private static func modifiers(_ flags: CGEventFlags) -> Modifiers {
        var m: Modifiers = []
        if flags.contains(.maskShift) { m.insert(.shift) }
        if flags.contains(.maskAlternate) { m.insert(.option) }
        if flags.contains(.maskControl) { m.insert(.control) }
        if flags.contains(.maskCommand) { m.insert(.command) }
        return m
    }

    private static func seconds(_ event: CGEvent) -> Double { Double(event.timestamp) / 1_000_000_000 }

    /// Proxy orqali: tugmalar joriy tugma örniga tuşadi, navbatda turgan keyingi tugmalardan oldin.
    /// Umumiy navbatga (`post(tap:)`) yuborilsa, tez yozilgan keyingi harf oldin ötib ketadi
    /// va Backspace uni öçiradi ("shahar" → "sşhar").
    private func post(deleting count: Int, forwardDeleting forward: Int = 0, inserting text: String,
                      via proxy: CGEventTapProxy) {
        for _ in 0..<count {
            sendKey(code: Self.deleteKeyCode, text: nil, via: proxy)
        }
        for _ in 0..<forward {
            sendKey(code: Self.forwardDeleteKeyCode, text: nil, via: proxy)
        }
        sendKey(code: 0, text: text, via: proxy)
    }

    private func sendKey(code: CGKeyCode, text: String?, via proxy: CGEventTapProxy) {
        for down in [true, false] {
            guard let e = CGEvent(keyboardEventSource: source, virtualKey: code, keyDown: down) else { continue }
            e.flags = []
            e.setIntegerValueField(.eventSourceUserData, value: Self.marker)
            if let text {
                var units = Array(text.utf16)
                e.keyboardSetUnicodeString(stringLength: units.count, unicodeString: &units)
            }
            e.tapPostEvent(proxy)
        }
    }
}
