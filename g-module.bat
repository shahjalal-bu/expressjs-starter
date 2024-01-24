@echo off

rem Store the current directory
set "original_directory=%CD%"

if "%1"=="" (
    echo Please provide a directory name.
    exit /b 1
)

set "directory=%1"
set "closing_parenthesis=^)";
set "opening_parenthesis=^(";

rem Capitalize the first letter of the directory variable using PowerShell
for /f %%i in ('powershell -command "[CultureInfo]::CurrentCulture.TextInfo.ToTitleCase('%directory%')"') do set "capitalized_directory=%%i"

rem Create the specified directory
mkdir src\app\modules\%directory%
cd src\app\modules\%directory%

rem Create the necessary files with content

rem Service

echo const getHello = ^(^) =^> { return "Hello World"; }; >> %directory%.service.ts
echo export const %capitalized_directory%Services = { >> %directory%.service.ts
echo   getHello, >> %directory%.service.ts
echo }; >> %directory%.service.ts

rem Controller
echo import { Request, Response } from "express"; > %directory%.controller.ts
echo import { %capitalized_directory%Services } from "./%directory%.service"; >> %directory%.controller.ts
echo. >> %directory%.controller.ts
echo const getHello = (req: Request, res: Response) =^> { >> %directory%.controller.ts
echo   const message = %capitalized_directory%Services.getHello(); >> %directory%.controller.ts
echo   res.send(message); >> %directory%.controller.ts
echo }; >> %directory%.controller.ts
echo. >> %directory%.controller.ts
echo export const %capitalized_directory%Controllers = { >> %directory%.controller.ts
echo   getHello, >> %directory%.controller.ts
echo }; >> %directory%.controller.ts

echo. > %directory%.interface.ts
echo. > %directory%.model.ts

(
    echo import express from 'express';
    echo import { %capitalized_directory%Controllers } from './%directory%.controller';
    echo const router = express.Router%opening_parenthesis%%closing_parenthesis%;
    echo router.get^("/", %capitalized_directory%Controllers.getHello^);
    echo export const %capitalized_directory%Routes = router;
) > %directory%.route.ts



rem Validation 

echo export const %capitalized_directory%Validations = { > %directory%.validation.ts
echo } >> %directory%.validation.ts


rem Return to the original directory
cd /d "%original_directory%"