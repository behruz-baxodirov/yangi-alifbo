#!/usr/bin/env bash
# Yangi alifbo — macOS klaviaturasini öçiriş.
#   curl -fsSL https://behruz-baxodirov.github.io/yangi-alifbo/uninstall.sh | bash
set -euo pipefail

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

main() {
    local app="$HOME/Library/Input Methods/YangiAlifbo.app"
    if [ ! -d "$app" ]; then
        echo "Yangi alifbo örnatilmagan."
        exit 0
    fi
    if [ "${YA_SKIP_REGISTER:-0}" != "1" ]; then
        "$app/Contents/MacOS/YangiAlifbo" --uninstall || true
    fi
    local pid
    for pid in $(running_pids "$app"); do
        kill "$pid" 2>/dev/null || true
    done
    rm -rf "$app"
    echo "✓ Yangi alifbo öçirildi. Menyu-barda qolgan bölsa, tizimdan çiqib qayta kiring."
}

[ -n "${YA_TEST_SOURCE:-}" ] || main "$@"
