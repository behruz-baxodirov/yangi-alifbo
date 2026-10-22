import Cocoa
import ApplicationServices

final class AppDelegate: NSObject, NSApplicationDelegate {
    private let keyTap = KeyTap()
    private var statusItem: NSStatusItem!
    private var permissionTimer: Timer?

    func applicationDidFinishLaunching(_ notification: Notification) {
        statusItem = NSStatusBar.system.statusItem(withLength: NSStatusItem.variableLength)
        if let button = statusItem.button {
            button.target = self
            button.action = #selector(statusClicked(_:))
            button.sendAction(on: [.leftMouseUp, .rightMouseUp])
            button.toolTip = "Yangi alifbo — bosing: yoqiş/öçiriş, öng tugma: menyu"
        }
        startWhenTrusted(prompt: true)
        refresh()
    }

    /// Accessibility ruxsati berilguncha kutadi, keyin tugma kuzatuvçisini yoqadi.
    private func startWhenTrusted(prompt: Bool) {
        let options = [kAXTrustedCheckOptionPrompt.takeUnretainedValue() as String: prompt] as CFDictionary
        if AXIsProcessTrustedWithOptions(options), keyTap.start() {
            permissionTimer?.invalidate()
            permissionTimer = nil
            refresh()
            return
        }
        guard permissionTimer == nil else { return }
        permissionTimer = Timer.scheduledTimer(withTimeInterval: 1.5, repeats: true) { [weak self] _ in
            self?.startWhenTrusted(prompt: false)
        }
    }

    private var hasPermission: Bool { keyTap.isRunning }

    private func refresh() {
        guard let button = statusItem.button else { return }
        let title: String
        if !hasPermission {
            title = "ö⚠︎"
        } else {
            title = Settings.enabled ? "ö" : "A"
        }
        button.attributedTitle = NSAttributedString(string: title, attributes: [
            .font: NSFont.systemFont(ofSize: 15, weight: .bold),
        ])
        button.appearsDisabled = hasPermission && !Settings.enabled
    }

    @objc private func statusClicked(_ sender: Any?) {
        let isRight = NSApp.currentEvent?.type == .rightMouseUp
            || NSApp.currentEvent?.modifierFlags.contains(.control) == true
        if isRight || !hasPermission {
            showMenu()
        } else {
            toggleEnabled(nil)
        }
    }

    private func showMenu() {
        let menu = NSMenu()
        if !hasPermission {
            menu.addItem(item("⚠︎ Ruxsat kerak: Accessibility'da \"Yangi alifbo\"ni yoqing…", #selector(openAccessibility(_:))))
            menu.addItem(.separator())
        }
        let enabled = item("Yoqilgan (belgini bosing)", #selector(toggleEnabled(_:)))
        enabled.state = Settings.enabled ? .on : .off
        menu.addItem(enabled)
        let tutuq = item("Tutuq belgisi ʼ (maʼno)", #selector(toggleTutuq(_:)))
        tutuq.state = Settings.tutuq ? .on : .off
        menu.addItem(tutuq)
        menu.addItem(.separator())
        menu.addItem(item("Yordam va yangilanişlar…", #selector(openSite(_:))))
        let version = NSMenuItem(title: "Yangi alifbo \(AppInfo.version)", action: nil, keyEquivalent: "")
        version.isEnabled = false
        menu.addItem(version)
        menu.addItem(item("Çiqiş", #selector(quit(_:))))
        statusItem.menu = menu
        statusItem.button?.performClick(nil)
        statusItem.menu = nil
    }

    private func item(_ title: String, _ action: Selector) -> NSMenuItem {
        let item = NSMenuItem(title: title, action: action, keyEquivalent: "")
        item.target = self
        return item
    }

    @objc private func toggleEnabled(_ sender: Any?) {
        Settings.enabled.toggle()
        keyTap.updateOptions()
        refresh()
    }

    @objc private func toggleTutuq(_ sender: Any?) {
        Settings.tutuq.toggle()
        keyTap.updateOptions()
    }

    @objc private func openAccessibility(_ sender: Any?) {
        NSWorkspace.shared.open(AppInfo.accessibilitySettings)
    }

    @objc private func openSite(_ sender: Any?) {
        NSWorkspace.shared.open(AppInfo.siteURL)
    }

    @objc private func quit(_ sender: Any?) {
        NSApp.terminate(nil)
    }
}
