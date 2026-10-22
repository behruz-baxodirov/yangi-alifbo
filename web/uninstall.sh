#!/usr/bin/env bash
# Yangi alifbo — macOS'dan öçiriş.
#   curl -fsSL https://behruz-baxodirov.github.io/yangi-alifbo/uninstall.sh | bash
set -euo pipefail

LABEL="uz.yangialifbo.YangiAlifbo"

# Faqat şu yerdagi nusxaning jarayonlari (nom böyiça emas: boşqa nusxalarga tegmaymiz).
running_pids() {
    local exe="$1/Contents/MacOS/YangiAlifbo"
    ps -axo pid=,command= | while read -r pid command; do
        case "$command" in
            "$exe" | "$exe "*) echo "$pid" ;;
        esac
    done
    return 0
}

stop_running() {
    local pid
    for pid in $(running_pids "$1"); do
        kill "$pid" 2>/dev/null || true
    done
}

main() {
    local app="$HOME/Applications/YangiAlifbo.app"
    local old="$HOME/Library/Input Methods/YangiAlifbo.app"
    local found=0

    if [ "${YA_SKIP_REGISTER:-0}" != "1" ]; then
        launchctl bootout "gui/$(id -u)/$LABEL" 2>/dev/null || true
        rm -f "$HOME/Library/LaunchAgents/$LABEL.plist"
    fi
    if [ -d "$app" ]; then
        found=1
        stop_running "$app"
        rm -rf "$app"
    fi
    if [ -d "$old" ]; then
        found=1
        [ "${YA_SKIP_REGISTER:-0}" = "1" ] || "$old/Contents/MacOS/YangiAlifbo" --uninstall 2>/dev/null || true
        stop_running "$old"
        rm -rf "$old"
    fi
    if [ "$found" = 0 ]; then
        echo "Yangi alifbo örnatilmagan."
        exit 0
    fi
    echo "✓ Yangi alifbo öçirildi. Accessibility röyxatidan ham olib taşlaşingiz mumkin."
}

[ -n "${YA_TEST_SOURCE:-}" ] || main "$@"
