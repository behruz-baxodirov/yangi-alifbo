import Cocoa
import InputMethodKit
import AlifboCore
import os
import Carbon

let log = Logger(subsystem: "uz.yangialifbo", category: "ime")

@objc(YangiAlifboInputController)
final class InputController: IMKInputController {
    private var composer = Composer(options: Settings.options)
    private var showsMarked = false
    private var doubleShift = DoubleShiftDetector()
    private let shiftKeyCodes: Set<UInt16> = [56, 60]
    private let notFound = NSRange(location: NSNotFound, length: 0)

    override func recognizedEvents(_ sender: Any!) -> Int {
        let mask: NSEvent.EventTypeMask = [.keyDown, .flagsChanged, .leftMouseDown, .rightMouseDown, .otherMouseDown]
        return Int(mask.rawValue)
    }

    override init!(server: IMKServer!, delegate: Any!, client inputClient: Any!) {
        super.init(server: server, delegate: delegate, client: inputClient)
        log.notice("controller init client=\(String(describing: inputClient), privacy: .public)")
    }

    override func activateServer(_ sender: Any!) {
        super.activateServer(sender)
        log.debug("activateServer")
        composer.options = Settings.options
        _ = composer.flush()
        showsMarked = false
    }

    override func deactivateServer(_ sender: Any!) {
        commitComposition(sender)
        super.deactivateServer(sender)
    }

    override func handle(_ event: NSEvent!, client sender: Any!) -> Bool {
        log.debug("handle type=\(event?.type.rawValue ?? 0, privacy: .public) clientOK=\(sender is IMKTextInput, privacy: .public)")
        guard let event, let client = sender as? IMKTextInput else { return false }
        if event.type == .flagsChanged {
            if shiftKeyCodes.contains(event.keyCode) {
                let down = event.modifierFlags.contains(.shift)
                if doubleShift.shift(down: down, at: event.timestamp) { toggleEnabled(client) }
            } else {
                doubleShift.otherKey()
            }
            return false
        }
        doubleShift.otherKey()
        if event.type != .keyDown {
            // Sichqoncha bosildi: kutilayotgan harf joyida yozib qolinadi, kontekst unutiladi.
            commitComposition(sender)
            return false
        }
        composer.options = Settings.options
        let output = composer.handle(KeyMapper.input(for: event), before: { Self.characterBeforeCursor(client) })
        if !output.commit.isEmpty {
            client.insertText(output.commit, replacementRange: notFound)
            showsMarked = false
        }
        updateMarkedText(client)
        return output.consumed
    }

    override func commitComposition(_ sender: Any!) {
        let text = composer.flush()
        guard let client = sender as? IMKTextInput else { return }
        // Client marked text'ni özi tasdiqlab bölgan bo'lsa, harfni ikkinçi marta yozmaymiz.
        let marked = client.markedRange()
        let clientStillMarks = marked.location != NSNotFound && marked.length > 0
        if !text.isEmpty && (clientStillMarks || !showsMarked) {
            client.insertText(text, replacementRange: notFound)
            showsMarked = false
        }
        updateMarkedText(client)
    }

    /// Foydalanuvçi menyu-bardan ö yoki A holatini tanlaganda.
    override func setValue(_ value: Any!, forTag tag: Int, client sender: Any!) {
        guard tag == kTextServiceInputModePropertyTag, let mode = value as? String else {
            super.setValue(value, forTag: tag, client: sender)
            return
        }
        let enabled = mode != AppInfo.modeOff
        guard enabled != Settings.enabled else { return }
        setEnabled(enabled, client: sender as? IMKTextInput, selectMode: false)
    }

    private func toggleEnabled(_ client: IMKTextInput) {
        setEnabled(!Settings.enabled, client: client, selectMode: true)
    }

    private func setEnabled(_ enabled: Bool, client: IMKTextInput?, selectMode: Bool) {
        if let client { commitComposition(client) }
        Settings.enabled = enabled
        composer.options = Settings.options
        if selectMode { client?.selectMode(Settings.modeID) }
        log.notice("enabled=\(enabled, privacy: .public)")
    }

    override func menu() -> NSMenu! {
        let menu = NSMenu()
        let toggle = NSMenuItem(title: "Yangi alifbo yoqilgan  (⇧ Shift ikki marta)", action: #selector(toggleFromMenu(_:)), keyEquivalent: "")
        toggle.state = Settings.enabled ? .on : .off
        menu.addItem(toggle)
        let tutuq = NSMenuItem(title: "Tutuq belgisi ʼ (maʼno)", action: #selector(toggleTutuq(_:)), keyEquivalent: "")
        tutuq.state = Settings.tutuq ? .on : .off
        menu.addItem(tutuq)
        menu.addItem(.separator())
        menu.addItem(NSMenuItem(title: "Yordam va yangilanişlar…", action: #selector(openSite(_:)), keyEquivalent: ""))
        let version = NSMenuItem(title: "Yangi alifbo \(AppInfo.version)", action: nil, keyEquivalent: "")
        version.isEnabled = false
        menu.addItem(version)
        return menu
    }

    @objc private func toggleFromMenu(_ sender: Any?) {
        setEnabled(!Settings.enabled, client: client(), selectMode: true)
    }

    @objc private func toggleTutuq(_ sender: Any?) {
        Settings.tutuq.toggle()
        composer.options = Settings.options
    }

    @objc private func openSite(_ sender: Any?) {
        NSWorkspace.shared.open(AppInfo.siteURL)
    }

    private func updateMarkedText(_ client: IMKTextInput) {
        let marked = composer.marked
        if !marked.isEmpty {
            client.setMarkedText(marked, selectionRange: NSRange(location: marked.utf16.count, length: 0), replacementRange: notFound)
            showsMarked = true
        } else if showsMarked {
            client.setMarkedText("", selectionRange: NSRange(location: 0, length: 0), replacementRange: notFound)
            showsMarked = false
        }
    }

    private static func characterBeforeCursor(_ client: IMKTextInput) -> Character? {
        let selection = client.selectedRange()
        guard selection.location != NSNotFound, selection.location > 0 else { return nil }
        return client.attributedSubstring(from: NSRange(location: selection.location - 1, length: 1))?.string.last
    }
}
