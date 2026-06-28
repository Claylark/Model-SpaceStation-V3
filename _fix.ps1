$f=" "\c:\Users\clayl\Desktop\claylark-model-spacestation-v3\src\components\AIChatModule.tsx\' 
$c=[System.IO.File]::ReadAllText($f)  
$c=$c.Replace(" "\w-[96px]\',\w-[150px]\')  
[System.IO.File]::WriteAllText($f,$c)  
Write-Host \Done\'  
