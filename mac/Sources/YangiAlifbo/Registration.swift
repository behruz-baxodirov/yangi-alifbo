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
        guard !sources().isEmpty else {
            fputs("Input source topilmadi: \(AppInfo.bundleID)\n", stderr)
            return false
        }
        // Holatlar (ö / A) ro'yxatga bir oz kech tuşadi, eski jarayon öçganda tizim ABC'ga qaytişi mumkin:
        // bir necha marta yoqib, "ö" holatini tanlaymiz.
        for attempt in 0..<5 {
            if attempt > 0 { usleep(400_000) }
            for source in sources() where !isEnabled(source) {
                let result = TISEnableInputSource(source)
                if result != noErr { fputs("TISEnableInputSource xatosi: \(result)\n", stderr) }
            }
            if let on = sources().first(where: { property($0, kTISPropertyInputSourceID) == AppInfo.modeOn }) {
                TISSelectInputSource(on)
            }
        }
        if currentID() != AppInfo.modeOn {
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

    private static func isEnabled(_ source: TISInputSource) -> Bool {
        guard let raw = TISGetInputSourceProperty(source, kTISPropertyInputSourceIsEnabled) else { return false }
        return CFBooleanGetValue(Unmanaged<CFBoolean>.fromOpaque(raw).takeUnretainedValue())
    }

    private static func currentID() -> String? {
        property(TISCopyCurrentKeyboardInputSource().takeRetainedValue(), kTISPropertyInputSourceID)
    }

    private static func property(_ source: TISInputSource, _ key: CFString) -> String? {
        guard let raw = TISGetInputSourceProperty(source, key) else { return nil }
        return Unmanaged<CFString>.fromOpaque(raw).takeUnretainedValue() as String
    }

    private static func sources() -> [TISInputSource] {
        let filter = [kTISPropertyBundleID as String: AppInfo.bundleID] as CFDictionary
        guard let list = TISCreateInputSourceList(filter, true)?.takeRetainedValue() as? [TISInputSource] else {
            return []
        }
        return list
    }
}
