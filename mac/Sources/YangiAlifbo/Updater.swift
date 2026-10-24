import Cocoa
import AlifboCore
import os

private let updateLog = Logger(subsystem: "uz.yangialifbo", category: "update")

/// Kuniga bir marta GitHub'dagi oxirgi relizni tekşiradi va yangisi bölsa yangilaşni taklif qiladi.
/// Faqat versiya raqami söraladi (HEAD sörov, yönaltiriş manzilidan teg): matn ham, sozlamalar ham yuborilmaydi.
/// Hech narsa jimgina örnatilmaydi: yangilaş — Terminal'da körinib turgan örnatiş buyruği.
final class Updater: NSObject, URLSessionTaskDelegate {
    enum FetchResult {
        /// Server javob bermadi (internet yöq): soatdan keyin yana urinamiz.
        case noResponse
        /// Javob bor; teg öqilmagan bölsa nil.
        case latest(AppVersion?)
    }

    /// Yangi versiya topilganda yoki yöqolganda (main thread'da).
    var onChange: (() -> Void)?
    private var timer: Timer?
    private var checking = false
    private let defaults: UserDefaults
    private let currentVersion: String

    init(defaults: UserDefaults = .standard, version: String = AppInfo.version) {
        self.defaults = defaults
        self.currentVersion = version
        super.init()
    }

    private lazy var session: URLSession = {
        let config = URLSessionConfiguration.ephemeral
        config.httpAdditionalHeaders = ["User-Agent": "YangiAlifbo/\(currentVersion)"]
        config.timeoutIntervalForRequest = 15
        return URLSession(configuration: config, delegate: self, delegateQueue: nil)
    }()

    var available: String? { defaults.string(forKey: Settings.availableVersionKey) }

    func start() {
        // Yangilangandan keyin eski xabar qolib ketmasin.
        if let saved = available, UpdateCheck.newer(latest: saved, than: currentVersion) == nil {
            defaults.removeObject(forKey: Settings.availableVersionKey)
        }
        // Oldin topilgan, lekin hali körsatilmagan versiya tarmoq javobini kutmasin.
        if available != nil { onChange?() }
        // Login paytida Wi-Fi hali ulanmagan bölişi mumkin.
        DispatchQueue.main.asyncAfter(deadline: .now() + 60) { [weak self] in self?.checkIfDue() }
        timer = Timer.scheduledTimer(withTimeInterval: 3600, repeats: true) { [weak self] _ in self?.checkIfDue() }
    }

    deinit { timer?.invalidate() }

    func checkIfDue() {
        guard defaults.object(forKey: Settings.autoUpdateCheckKey) as? Bool ?? true else {
            updateLog.notice("update check skipped")
            return
        }
        guard !checking, UpdateCheck.isDue(last: defaults.object(forKey: Settings.lastUpdateCheckKey) as? Date, now: Date()) else { return }
        checking = true
        fetchLatest { [weak self] result in
            DispatchQueue.main.async { self?.finish(result) }
        }
    }

    private func finish(_ result: FetchResult) {
        checking = false
        guard case .latest(let latest) = result else { return }
        defaults.set(Date(), forKey: Settings.lastUpdateCheckKey)
        updateLog.notice("update check: latest=\(latest?.description ?? "?", privacy: .public)")
        let found = UpdateCheck.available(latest: latest, current: currentVersion, saved: available)
        guard found != available else { return }
        defaults.set(found, forKey: Settings.availableVersionKey)
        onChange?()
    }

    /// Bitta HEAD sörov; natija session navbatida qaytadi.
    func fetchLatest(_ done: @escaping (FetchResult) -> Void) {
        var request = URLRequest(url: AppInfo.releasesLatestURL)
        request.httpMethod = "HEAD"
        session.dataTask(with: request) { _, response, _ in
            guard let http = response as? HTTPURLResponse else { return done(.noResponse) }
            let location = http.value(forHTTPHeaderField: "Location")
            done(.latest(location.flatMap(UpdateCheck.version(fromLocation:))))
        }.resume()
    }

    // Yönaltirişga ergaşmaymiz: kerakli narsa Location sarlavhasidagi teg.
    func urlSession(_ session: URLSession, task: URLSessionTask, willPerformHTTPRedirection response: HTTPURLResponse,
                    newRequest request: URLRequest, completionHandler: @escaping (URLRequest?) -> Void) {
        completionHandler(nil)
    }

    func offerUpdate() {
        guard let version = available else { return }
        NSApp.activate(ignoringOtherApps: true)
        let alert = NSAlert()
        alert.messageText = "Yangi versiya \(version)"
        alert.informativeText = "Terminal oçiladi va örnatiş buyruği işga tuşadi. Keyin macOS Accessibility ruxsatini qayta söraydi: Privacy & Security → Accessibility → \"Yangi alifbo\"ni yoqing."
        alert.addButton(withTitle: "Yangilaş")
        alert.addButton(withTitle: "Nimalar yangi?")
        alert.addButton(withTitle: "Keyinroq")
        switch alert.runModal() {
        case .alertFirstButtonReturn:
            runInstaller()
        case .alertSecondButtonReturn:
            NSWorkspace.shared.open(AppInfo.releasesLatestURL)
        default:
            break
        }
    }

    /// .command fayl Terminal'da oçiladi va buyruq körinib işlaydi (Automation ruxsati kerak emas).
    private func runInstaller() {
        guard let script = try? writeInstallScript(),
              let terminal = NSWorkspace.shared.urlForApplication(withBundleIdentifier: "com.apple.Terminal") else {
            showInstallerFailure()
            return
        }
        // .command faylning tasodifan almaştirilgan default ilovasiga boğlanmaymiz.
        NSWorkspace.shared.open([script], withApplicationAt: terminal, configuration: NSWorkspace.OpenConfiguration()) { [weak self] _, error in
            if error != nil { DispatchQueue.main.async { self?.showInstallerFailure() } }
        }
    }

    private func showInstallerFailure() {
        NSPasteboard.general.clearContents()
        NSPasteboard.general.setString(AppInfo.installCommand, forType: .string)
        let alert = NSAlert()
        alert.messageText = "Terminal oçilmadi. Buyruqni özingiz Terminalʼga yozing:"
        alert.informativeText = "\(AppInfo.installCommand)\n\nBuyruq nusxalandi: ⌘V"
        alert.runModal()
    }

    func writeInstallScript(in directory: URL? = nil) throws -> URL {
        let caches = try FileManager.default.url(for: .cachesDirectory, in: .userDomainMask, appropriateFor: nil, create: true)
        let dir = directory ?? caches.appendingPathComponent("uz.yangialifbo.YangiAlifbo", isDirectory: true)
        try FileManager.default.createDirectory(at: dir, withIntermediateDirectories: true)
        let script = dir.appendingPathComponent("yangilash.command")
        try "#!/bin/bash\n\(AppInfo.installCommand)\n".write(to: script, atomically: true, encoding: .utf8)
        try FileManager.default.setAttributes([.posixPermissions: 0o755], ofItemAtPath: script.path)
        return script
    }

    /// `--check-update`: tarmoq yölini UI'siz bir marta tekşiradi.
    static func printLatest() {
        let done = DispatchSemaphore(value: 0)
        let updater = Updater()
        updater.fetchLatest { result in
            switch result {
            case .noResponse:
                print("javob yöq")
            case .latest(let latest):
                let newer = latest.flatMap { UpdateCheck.newer(latest: $0.description, than: AppInfo.version) }
                print("joriy: \(AppInfo.version), oxirgi: \(latest?.description ?? "?"), yangilaş: \(newer?.description ?? "kerak emas")")
            }
            done.signal()
        }
        done.wait()
    }
}
