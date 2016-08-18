@echo off
::dos delayed environment variable expansion
::http://ss64.com/nt/delayedexpansion.html
Setlocal EnableDelayedExpansion
::batch compare date time
::http://stackoverflow.com/questions/17649235/compare-2-dates-in-a-windows-batch-file

::set lastUpdateDate=22.01.2016
::echo 22.01.2016>lastUpdateDate.txt

for /F "delims= " %%a in (lastUpdateDate.txt) do (
     set lastUpdateDate=%%a
)

::echo %lastUpdateDate%
call :date_to_number %lastUpdateDate% date1
::set /a date1=datei1-1

echo user ZimGuggRoot@zimmerei-guggisberg.ch> ftpcmd.dat
echo TxHBgeoAGM6x>> ftpcmd.dat
echo bin>> ftpcmd.dat
echo cd test>> ftpcmd.dat
echo cd webGL>> ftpcmd.dat
for /f "skip=5 tokens=1-5" %%a in ('dir /tw /a-d') do (
    call :date_to_number %%a date2
    if !date2! GEQ !date1! echo put %%d>>ftpcmd.dat
)
FOR /f "tokens=*" %%i in ('DIR /a:d /b') DO (
    cd %cd%\%%i
    echo cd %%i>> ..\ftpcmd.dat
    for /f "skip=5 tokens=1-5" %%a in ('dir /tw /a-d') do (
        call :date_to_number %%a date2
        if !date2! GEQ !date1! echo put %%i/%%d>>..\ftpcmd.dat
    )
    cd ..
    echo cd ..>> ftpcmd.dat
)
echo quit>> ftpcmd.dat


ftp -n -s:ftpcmd.dat ftp.zimmerei-guggisberg.ch
del ftpcmd.dat

echo %date%>lastUpdateDate.txt

goto :eof



:date_to_number
setlocal
if "%~1" EQU "" goto :eof
for /f "tokens=1,2,3 delims=." %%D in ("%~1") do (
  set "the_date=%%F%%E%%D"
)
endlocal & if "%~2" neq "" (set %~2=%the_date%) else echo %the_date%
goto :eof