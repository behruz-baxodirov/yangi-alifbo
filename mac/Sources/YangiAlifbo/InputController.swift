import Cocoa
import InputMethodKit
import AlifboCore

@objc(YangiAlifboInputController)
final class InputController: IMKInputController {
    private var composer = Composer(options: Settings.options)
    private var showsMarked = false
    private let notFound = NSRange(location: NSNotFound, length: 0)

    override func recognizedEvents(_ sender: Any!) -> Int {
        Int(NSEvent.EventTypeMask.keyDown.rawValue)
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
        guard let event, event.type == .keyDown, let client = sender as? IMKTextInput else { return false }
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
        if !text.isEmpty {
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
