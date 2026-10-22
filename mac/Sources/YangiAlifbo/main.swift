import Cocoa
import InputMethodKit

let arguments = CommandLine.arguments

if arguments.contains("--version") {
    print(AppInfo.version)
    exit(0)
}
if arguments.contains("--install") {
    exit(Registration.install() ? 0 : 1)
}
if arguments.contains("--uninstall") {
    exit(Registration.uninstall() ? 0 : 1)
}

import os
Logger(subsystem: "uz.yangialifbo", category: "ime").notice("server start \(AppInfo.connectionName, privacy: .public) \(Bundle.main.bundleIdentifier ?? "nil", privacy: .public)")
let server = IMKServer(name: AppInfo.connectionName, bundleIdentifier: Bundle.main.bundleIdentifier)
withExtendedLifetime(server) {
    NSApplication.shared.run()
}
