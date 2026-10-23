import Cocoa

let arguments = CommandLine.arguments

if arguments.contains("--version") {
    print(AppInfo.version)
    exit(0)
}

if arguments.contains("--check-update") {
    Updater.printLatest()
    exit(0)
}

let app = NSApplication.shared
let delegate = AppDelegate()
app.delegate = delegate
app.setActivationPolicy(.accessory)
app.run()
