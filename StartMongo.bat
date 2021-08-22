@echo off
cd "C:\mongodb\bin"
start mond.exe
timeout 4
start mongo.exe
exit