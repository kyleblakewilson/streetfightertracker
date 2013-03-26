@echo off
echo ========================
echo Slicing Screenshot
echo ========================
convert screenshot.jpg -crop 250x24+121+138 +repage PlayerOne-Name.png
convert screenshot.jpg -crop 250x24+944+138 +repage PlayerTwo-Name.png
echo Done!
echo ========================
echo Preparing Images for OCR
echo ========================
convert PlayerOne-Name.png -set colorspace Gray -separate -average PlayerOne-Name.png
convert PlayerOne-Name.png -fuzz 2100 -fill black +opaque white PlayerOne-Name.png
convert PlayerTwo-Name.png -set colorspace Gray -separate -average PlayerTwo-Name.png
convert PlayerTwo-Name.png -fuzz 2100 -fill black +opaque white PlayerTwo-Name.png
echo Done!
echo ========================
echo Tesseract OCR
echo ========================
tesseract PlayerOne-Name.png PlayerOne-Name.png nobatch sf
tesseract PlayerTwo-Name.png PlayerTwo-Name.png -l eng -psm 57 nobatch sf
echo Done!