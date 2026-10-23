; CI smoke test: YangiAlifbo.exe ishlab turganda Notepad'ga yozadi va natijani tekshiradi.
#Requires AutoHotkey v2.0
SendMode "Event"
SetKeyDelay 30, 10
SendLevel 1   ; InputHook (MinSendLevel 1) bu tugmalarni ko'rishi uçun

cases := [
    ["o'zbek", "özbek"],
    ["Shahar", "Şahar"],
    ["choy", "çoy"],
    ["g'oya", "ğoya"],
    ["Is'hoq", "Isʼhoq"],
    ["ma'no", "maʼno"],
    ["ishchi", "işçi"],
    ["O'ZBEKISTON", "ÖZBEKISTON"],
]
; Tugmalar ketma-ketligi ({Text} emas): adaşgan harf Backspace bilan öçirilgandan keyin ham birikadi.
keyCases := [
    ["cb{BS}h", "ç"],
    ["ox{BS}'", "ö"],
    ["sa{BS}h", "ş"],
    ["ab{BS}{BS}{BS}h", "h"],
    ["c{Left}{Right}h", "ch"],
]

Run "notepad.exe"
WinWaitActive "ahk_exe notepad.exe", , 10
Sleep 1000

failed := 0
for c in cases
    Check("{Text}" c[1], c[1], c[2])
for c in keyCases
    Check(c[1], c[1], c[2])

Check(keys, label, want) {
    global failed
    Send "^a{Delete}"
    Sleep 200
    SendEvent keys
    Sleep 400
    A_Clipboard := ""
    Send "^a^c"
    ClipWait 2
    got := A_Clipboard
    status := (got == want) ? "ok  " : "FAIL"
    if (got != want)
        failed += 1
    FileAppend status " " label " -> " got " (kutilgan " want ")`n", "*", "UTF-8"
}
WinClose "ahk_exe notepad.exe"
Sleep 300
if WinExist("ahk_exe notepad.exe")
    Send "!n"
ExitApp failed ? 1 : 0
