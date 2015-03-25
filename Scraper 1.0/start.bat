@echo off
cls
:start
screenshot-cmd.exe -rc 0 25 1280 200
imagemagick\convert screenshot.png -crop 182x17+22+1 +repage -compress none -depth 8 namechar.png
imagemagick\convert screenshot.png -crop 182x17+1078+1 +repage -compress none -depth 8 oppchar.png
imagemagick\convert screenshot.png -crop 81x28+430+44 +repage -compress none -depth 8 wins.png
imagemagick\convert screenshot.png -crop 225x30+115+115 +repage -compress none -depth 8 name.png
imagemagick\convert screenshot.png -crop 225x30+940+115 +repage -compress none -depth 8 opponent.png
imagemagick\convert name.png ( -clone 0 -fuzz 10000 -transparent rgb(254,255,255) -alpha extract -fill red -opaque white -transparent black ) -compose over -composite name.png
imagemagick\convert name.png ( -clone 0 -transparent red -alpha extract -fill green -opaque white -transparent black ) -compose over -composite name.png
imagemagick\convert name.png ( -clone 0 -transparent green -alpha extract -negate ) -compose copy_opacity -composite name.png
imagemagick\convert name.png  -fill black -opaque green name.png
imagemagick\convert wins.png ( -clone 0 -fuzz 25000 -transparent rgb(254,255,255) -alpha extract -fill red -opaque white -transparent black ) -compose over -composite wins.png
imagemagick\convert wins.png ( -clone 0 -transparent red -alpha extract -fill green -opaque white -transparent black ) -compose over -composite wins.png
imagemagick\convert wins.png ( -clone 0 -transparent green -alpha extract -negate ) -compose copy_opacity -composite wins.png
imagemagick\convert wins.png  -fill black -opaque green wins.png
imagemagick\convert opponent.png ( -clone 0 -fuzz 10000 -transparent rgb(254,255,255) -alpha extract -fill red -opaque white -transparent black ) -compose over -composite opponent.png
imagemagick\convert opponent.png ( -clone 0 -transparent red -alpha extract -fill green -opaque white -transparent black ) -compose over -composite opponent.png
imagemagick\convert opponent.png ( -clone 0 -transparent green -alpha extract -negate ) -compose copy_opacity -composite opponent.png
imagemagick\convert opponent.png  -fill black -opaque green opponent.png
tesseract wins.png wins nobatch digits > nul
tesseract namechar.png namechar nobatch sf > nul
tesseract oppchar.png oppchar nobatch sf > nul
tesseract name.png name nobatch sf > nul
tesseract opponent.png opponent nobatch sf > nul
node process.js
ping 127.0.0.1 -n 5 > nul
goto start
