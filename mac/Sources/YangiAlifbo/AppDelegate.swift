import Cocoa
import ApplicationServices
import AlifboCore

final class AppDelegate: NSObject, NSApplicationDelegate {
    private let keyTap = KeyTap()
    private let hud = ToggleHUD()
    private var statusItem: NSStatusItem!
    private var permissionTimer: Timer?

    func applicationDidFinishLaunching(_ notification: Notification) {
        statusItem = NSStatusBar.system.statusItem(withLength: NSStatusItem.variableLength)
        if let button = statusItem.button {
            button.target = self
            button.action = #selector(statusClicked(_:))
            button.sendAction(on: [.leftMouseUp, .rightMouseUp])
        }
        keyTap.onToggle = { [weak self] in self?.toggleEnabled(nil) }
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
            welcomeIfNeeded()
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
        button.toolTip = hasPermission
            ? "Yangi alifbo — \(Settings.enabled ? "yoqilgan" : "öçiq"). Yoqiş/öçiriş: \(Settings.shortcut.label) yoki belgini bosing."
            : "Yangi alifbo — Accessibility ruxsati kerak"
    }

    private func welcomeIfNeeded() {
        guard !Settings.welcomed else { return }
        Settings.welcomed = true
        hud.show(symbol: "ö", title: "Yangi alifbo işlayapti",
                 subtitle: "Öçiriş: \(Settings.shortcut.label) yoki menyu-bardagi ö", seconds: 4)
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
        let enabled = item("Yoqilgan", #selector(toggleEnabled(_:)))
        enabled.state = Settings.enabled ? .on : .off
        menu.addItem(enabled)
        let shortcutItem = NSMenuItem(title: "Yoqiş/öçiriş tugmasi", action: nil, keyEquivalent: "")
        let shortcuts = NSMenu()
        for shortcut in ToggleShortcut.allCases {
            let choice = item(shortcut.label, #selector(chooseShortcut(_:)))
            choice.representedObject = shortcut.rawValue
            choice.state = Settings.shortcut == shortcut ? .on : .off
            shortcuts.addItem(choice)
        }
        shortcutItem.submenu = shortcuts
        menu.addItem(shortcutItem)
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
        if Settings.enabled {
            hud.show(symbol: "ö", title: "Yangi alifbo yoqildi")
        } else {
            hud.show(symbol: "A", title: "Yangi alifbo öçirildi")
        }
    }

    @objc private func chooseShortcut(_ sender: NSMenuItem) {
        guard let raw = sender.representedObject as? String, let shortcut = ToggleShortcut(rawValue: raw) else { return }
        Settings.shortcut = shortcut
        keyTap.updateOptions()
        refresh()
        hud.show(symbol: "⌨︎", title: "Yoqiş/öçiriş tugmasi", subtitle: shortcut.label, seconds: 2)
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
