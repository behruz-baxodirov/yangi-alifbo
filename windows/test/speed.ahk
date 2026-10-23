; CI tezlik testi: YangiAlifbo.exe işlab turganda Notepad'ga turli tezlikda yozadi.
; Tez yozilganda keyingi harf almaştirişdan oldin ötib ketmasligi kerak ("shahar" → "sşhar" emas).
; 0 ms (pauzasiz oqim) bu yerda yöq: u odam yozişi emas va hozirgi InputHook usulida buziladi.
#Requires AutoHotkey v2.0
SendMode "Event"
SendLevel 1   ; InputHook (MinSendLevel 1) bu tugmalarni körişi uçun

text := "shahar choy o'g'il chiroyli kitob ma'no"
want := "şahar çoy öğil çiroyli kitob maʼno"

Run "notepad.exe"
WinWaitActive "ahk_exe notepad.exe", , 10
Sleep 1000

failed := 0
for delay in [80, 30, 10, 3] {
    SetKeyDelay delay, 0
    Send "^a{Delete}"
    Sleep 300
    SendEvent "{Text}" text
    Sleep 800
    A_Clipboard := ""
    Send "^a^c"
    ClipWait 2
    got := A_Clipboard
    status := (got == want) ? "ok  " : "FAIL"
    if (got != want)
        failed += 1
    FileAppend status " " delay "ms -> " got "`n", "*", "UTF-8"
}
WinClose "ahk_exe notepad.exe"
Sleep 300
if WinExist("ahk_exe notepad.exe")
    Send "!n"
ExitApp failed ? 1 : 0
