import Foundation
import AlifboCore

enum AppInfo {
    static let bundleID = "uz.yangialifbo.inputmethod.YangiAlifbo"
    static let modeOn = "uz.yangialifbo.inputmethod.YangiAlifbo.on"
    static let modeOff = "uz.yangialifbo.inputmethod.YangiAlifbo.off"
    static let siteURL = URL(string: "https://yozgich.uz/")!

    static var version: String {
        Bundle.main.infoDictionary?["CFBundleShortVersionString"] as? String ?? "dev"
    }

    static var connectionName: String {
        Bundle.main.infoDictionary?["InputMethodConnectionName"] as? String ?? "YangiAlifbo_Connection"
    }
}

enum Settings {
    private static let tutuqKey = "tutuq"
    private static let enabledKey = "enabled"

    /// false — "A" holati: hamma tugma özgarişsiz ötadi.
    static var enabled: Bool {
        get { UserDefaults.standard.object(forKey: enabledKey) as? Bool ?? true }
        set { UserDefaults.standard.set(newValue, forKey: enabledKey) }
    }

    static var modeID: String { enabled ? AppInfo.modeOn : AppInfo.modeOff }

    static var tutuq: Bool {
        get { UserDefaults.standard.object(forKey: tutuqKey) as? Bool ?? true }
        set { UserDefaults.standard.set(newValue, forKey: tutuqKey) }
    }

    static var options: ComposerOptions { ComposerOptions(tutuq: tutuq, enabled: enabled) }
}
