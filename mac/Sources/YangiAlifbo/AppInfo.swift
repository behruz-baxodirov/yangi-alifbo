import Foundation
import AlifboCore

enum AppInfo {
    static let bundleID = "uz.yangialifbo.inputmethod.YangiAlifbo"
    static let siteURL = URL(string: "https://behruz-baxodirov.github.io/yangi-alifbo/")!

    static var version: String {
        Bundle.main.infoDictionary?["CFBundleShortVersionString"] as? String ?? "dev"
    }

    static var connectionName: String {
        Bundle.main.infoDictionary?["InputMethodConnectionName"] as? String ?? "YangiAlifbo_Connection"
    }
}

enum Settings {
    private static let tutuqKey = "tutuq"

    static var tutuq: Bool {
        get { UserDefaults.standard.object(forKey: tutuqKey) as? Bool ?? true }
        set { UserDefaults.standard.set(newValue, forKey: tutuqKey) }
    }

    static var options: ComposerOptions { ComposerOptions(tutuq: tutuq) }
}
