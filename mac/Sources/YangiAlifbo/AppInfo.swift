import Foundation
import AlifboCore

enum AppInfo {
    static let siteURL = URL(string: "https://yozgich.uz/")!
    static let accessibilitySettings = URL(string: "x-apple.systempreferences:com.apple.preference.security?Privacy_Accessibility")!
    static let releasesLatestURL = URL(string: "https://github.com/behruz-baxodirov/yangi-alifbo/releases/latest")!
    static let installCommand = "curl -fsSL https://yozgich.uz/install.sh | bash"

    static var version: String {
        Bundle.main.infoDictionary?["CFBundleShortVersionString"] as? String ?? "dev"
    }
}

enum Settings {
    private static let tutuqKey = "tutuq"
    private static let enabledKey = "enabled"
    private static let shortcutKey = "shortcut"
    private static let welcomedKey = "welcomed"
    private static let autoUpdateCheckKey = "autoUpdateCheck"
    private static let lastUpdateCheckKey = "lastUpdateCheck"
    private static let availableVersionKey = "availableVersion"
    private static let announcedVersionKey = "announcedVersion"

    /// Kuniga bir marta yangi versiyani tekşiriş; öçiq bölsa internetga umuman çiqilmaydi.
    static var autoUpdateCheck: Bool {
        get { UserDefaults.standard.object(forKey: autoUpdateCheckKey) as? Bool ?? true }
        set { UserDefaults.standard.set(newValue, forKey: autoUpdateCheckKey) }
    }

    /// Server oxirgi marta javob bergan vaqt.
    static var lastUpdateCheck: Date? {
        get { UserDefaults.standard.object(forKey: lastUpdateCheckKey) as? Date }
        set { UserDefaults.standard.set(newValue, forKey: lastUpdateCheckKey) }
    }

    /// Topilgan yangi versiya (joriydan katta), yöq bölsa nil.
    static var availableVersion: String? {
        get { UserDefaults.standard.string(forKey: availableVersionKey) }
        set { UserDefaults.standard.set(newValue, forKey: availableVersionKey) }
    }

    /// Ekranda xabari körsatilgan versiya (har versiya uçun bir marta).
    static var announcedVersion: String? {
        get { UserDefaults.standard.string(forKey: announcedVersionKey) }
        set { UserDefaults.standard.set(newValue, forKey: announcedVersionKey) }
    }

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
