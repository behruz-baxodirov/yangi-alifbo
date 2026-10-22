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

Run "notepad.exe"
WinWaitActive "ahk_exe notepad.exe", , 10
Sleep 1000

failed := 0
for c in cases {
    Send "^a{Delete}"
    Sleep 200
    SendEvent "{Text}" c[1]
    Sleep 400
    A_Clipboard := ""
    Send "^a^c"
    ClipWait 2
    got := A_Clipboard
    status := (got == c[2]) ? "ok  " : "FAIL"
    if (got != c[2])
        failed += 1
    FileAppend status " " c[1] " -> " got " (kutilgan " c[2] ")`n", "*", "UTF-8"
}
WinClose "ahk_exe notepad.exe"
Sleep 300
if WinExist("ahk_exe notepad.exe")
    Send "!n"
ExitApp failed ? 1 : 0
