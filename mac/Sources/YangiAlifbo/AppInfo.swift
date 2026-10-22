import Foundation
import AlifboCore

enum AppInfo {
    static let siteURL = URL(string: "https://behruz-baxodirov.github.io/yangi-alifbo/")!
    static let accessibilitySettings = URL(string: "x-apple.systempreferences:com.apple.preference.security?Privacy_Accessibility")!

    static var version: String {
        Bundle.main.infoDictionary?["CFBundleShortVersionString"] as? String ?? "dev"
    }
}

enum Settings {
    private static let tutuqKey = "tutuq"
    private static let enabledKey = "enabled"

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
