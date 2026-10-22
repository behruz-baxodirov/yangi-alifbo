import Cocoa
import InputMethodKit
import AlifboCore

@objc(YangiAlifboInputController)
final class InputController: IMKInputController {
    private var composer = Composer(options: Settings.options)
    private var showsMarked = false
    private let notFound = NSRange(location: NSNotFound, length: 0)

    override func recognizedEvents(_ sender: Any!) -> Int {
        let mask: NSEvent.EventTypeMask = [.keyDown, .leftMouseDown, .rightMouseDown, .otherMouseDown]
        return Int(mask.rawValue)
    }

    override func activateServer(_ sender: Any!) {
        super.activateServer(sender)
        composer.options = Settings.options
        _ = composer.flush()
        showsMarked = false
    }

    override func deactivateServer(_ sender: Any!) {
        commitComposition(sender)
        super.deactivateServer(sender)
    }

    override func handle(_ event: NSEvent!, client sender: Any!) -> Bool {
        guard let event, let client = sender as? IMKTextInput else { return false }
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

    override func menu() -> NSMenu! {
        let menu = NSMenu()
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
