#!/usr/bin/env bash
# install.sh faqat almaştirilayotgan nusxani töxtatişini tekşiradi (boşqa YangiAlifbo jarayonlariga tegmaydi).
set -u
here="$(cd "$(dirname "$0")" && pwd)"
tmp="$(mktemp -d)"
trap 'kill "${pid_a:-}" "${pid_b:-}" 2>/dev/null; rm -rf "$tmp"' EXIT

for name in "A dir" "B dir"; do
    mkdir -p "$tmp/$name/YangiAlifbo.app/Contents/MacOS"
    cp /bin/sleep "$tmp/$name/YangiAlifbo.app/Contents/MacOS/YangiAlifbo"
    # Nusxa olingan tizim fayli imzosiz yo'lda öldiriladi: ad-hoc qayta imzolaymiz.
    codesign --force --sign - "$tmp/$name/YangiAlifbo.app/Contents/MacOS/YangiAlifbo" 2>/dev/null
done
"$tmp/A dir/YangiAlifbo.app/Contents/MacOS/YangiAlifbo" 300 & pid_a=$!
"$tmp/B dir/YangiAlifbo.app/Contents/MacOS/YangiAlifbo" 300 & pid_b=$!
sleep 0.3
kill -0 "$pid_a" && kill -0 "$pid_b" || { echo "FAIL: soxta jarayonlar işga tuşmadi"; exit 1; }

fail=0
for script in install.sh uninstall.sh; do
    # shellcheck disable=SC1090
    got="$(YA_TEST_SOURCE=1 bash -c ". \"$here/../$script\"; running_pids \"$tmp/A dir/YangiAlifbo.app\"" 2>&1)"
    if [ "$got" = "$pid_a" ]; then
        echo "ok   $script: faqat A ($pid_a)"
    else
        echo "FAIL $script: kutilgan '$pid_a', olindi '$got'"
        fail=1
    fi
done
exit $fail
