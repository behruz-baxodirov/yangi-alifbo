import Foundation
import AlifboCore

enum AppInfo {
    static let siteURL = URL(string: "https://yozgich.uz/")!
    static let accessibilitySettings = URL(string: "x-apple.systempreferences:com.apple.preference.security?Privacy_Accessibility")!

    static var version: String {
        Bundle.main.infoDictionary?["CFBundleShortVersionString"] as? String ?? "dev"
    }
}

enum Settings {
    private static let tutuqKey = "tutuq"
    private static let enabledKey = "enabled"
    private static let shortcutKey = "shortcut"
    private static let welcomedKey = "welcomed"

    static var shortcut: ToggleShortcut {
        get { UserDefaults.standard.string(forKey: shortcutKey).flatMap(ToggleShortcut.init(rawValue:)) ?? .doubleShift }
        set { UserDefaults.standard.set(newValue.rawValue, forKey: shortcutKey) }
    }

    /// Birinçi marta işga tuşganda körsatma körsatildimi.
    static var welcomed: Bool {
        get { UserDefaults.standard.bool(forKey: welcomedKey) }
        set { UserDefaults.standard.set(newValue, forKey: welcomedKey) }
    }

    static var tutuq: Bool {
        get { UserDefaults.standard.object(forKey: tutuqKey) as? Bool ?? true }
        set { UserDefaults.standard.set(newValue, forKey: tutuqKey) }
    }

    static var enabled: Bool {
        get { UserDefaults.standard.object(forKey: enabledKey) as? Bool ?? true }
        set { UserDefaults.standard.set(newValue, forKey: enabledKey) }
    }

    static var options: ComposerOptions { ComposerOptions(tutuq: tutuq, enabled: enabled) }
}
