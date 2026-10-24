import XCTest
import Cocoa
@testable import YangiAlifbo

final class UpdaterTests: XCTestCase {
    private func preferences() -> UserDefaults {
        let name = "uz.yangialifbo.tests.\(UUID().uuidString)"
        let defaults = UserDefaults(suiteName: name)!
        addTeardownBlock { defaults.removePersistentDomain(forName: name) }
        return defaults
    }

    func testSavedUpdateIsPresentedOnStartupEvenWithoutANewNetworkAnswer() {
        let defaults = preferences()
        defaults.set("2.0.4", forKey: Settings.availableVersionKey)
        defaults.set(false, forKey: Settings.autoUpdateCheckKey)
        let updater = Updater(defaults: defaults, version: "2.0.3")
        var changes = 0
        updater.onChange = { changes += 1 }
        updater.start()
        XCTAssertEqual(updater.available, "2.0.4")
        XCTAssertEqual(changes, 1)
        XCTAssertEqual(StatusMenu.announcement(available: updater.available, announced: nil), "2.0.4")
        XCTAssertNil(StatusMenu.announcement(available: updater.available, announced: "2.0.4"))
        XCTAssertNil(StatusMenu.announcement(available: nil, announced: "2.0.4"))
    }

    func testInstalledUpdateClearsTheSavedBadge() {
        let defaults = preferences()
        defaults.set("2.0.3", forKey: Settings.availableVersionKey)
        let updater = Updater(defaults: defaults, version: "2.0.4")
        updater.start()
        XCTAssertNil(updater.available)
    }

    func testInstallerCommandIsExecutableAndContainsOnlyTheExpectedInstaller() throws {
        let folder = FileManager.default.temporaryDirectory.appendingPathComponent("yozgich-test-\(UUID().uuidString)")
        let script = try Updater(defaults: preferences()).writeInstallScript(in: folder)
        XCTAssertEqual(try String(contentsOf: script, encoding: .utf8), "#!/bin/bash\ncurl -fsSL https://yozgich.uz/install.sh | bash\n")
        let attrs = try FileManager.default.attributesOfItem(atPath: script.path)
        XCTAssertEqual((attrs[.posixPermissions] as? NSNumber)?.intValue, 0o755)
        XCTAssertNotNil(NSWorkspace.shared.urlForApplication(withBundleIdentifier: "com.apple.Terminal"))
    }
}
