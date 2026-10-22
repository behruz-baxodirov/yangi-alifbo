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

let server = IMKServer(name: AppInfo.connectionName, bundleIdentifier: Bundle.main.bundleIdentifier)
withExtendedLifetime(server) {
    NSApplication.shared.run()
}
