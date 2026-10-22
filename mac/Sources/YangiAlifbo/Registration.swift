import Carbon
import Foundation

/// macOS'ga input source'ni ro'yxatdan o'tkazish va yoqish/o'chirish.
enum Registration {
    static func install() -> Bool {
        let status = TISRegisterInputSource(Bundle.main.bundleURL as CFURL)
        guard status == noErr else {
            fputs("TISRegisterInputSource xatosi: \(status)\n", stderr)
            return false
        }
        let list = sources()
        guard !list.isEmpty else {
            fputs("Input source topilmadi: \(AppInfo.bundleID)\n", stderr)
            return false
        }
        for source in list {
            let result = TISEnableInputSource(source)
            if result != noErr { fputs("TISEnableInputSource xatosi: \(result)\n", stderr) }
        }
        // Örnatilgan zahoti yoqilgan bölsin: menyu-barda "ö" körinadi.
        if let source = list.first, TISSelectInputSource(source) != noErr {
            fputs("Yangi alifbo'ni menyu-bardan tanlang.\n", stderr)
        }
        return true
    }

    static func uninstall() -> Bool {
        for source in sources() {
            TISDisableInputSource(source)
        }
        return true
    }

    private static func sources() -> [TISInputSource] {
        let filter = [kTISPropertyBundleID as String: AppInfo.bundleID] as CFDictionary
        guard let list = TISCreateInputSourceList(filter, true)?.takeRetainedValue() as? [TISInputSource] else {
            return []
        }
        return list
    }
}
