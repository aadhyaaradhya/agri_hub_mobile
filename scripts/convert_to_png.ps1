Add-Type -AssemblyName System.Drawing

$files = @("icon.png", "adaptive-icon.png", "splash.png", "favicon.png")
foreach ($f in $files) {
    $fullPath = Resolve-Path "assets/$f"
    $bytes = [System.IO.File]::ReadAllBytes($fullPath)
    $inStream = New-Object System.IO.MemoryStream(,$bytes)
    $img = [System.Drawing.Image]::FromStream($inStream)
    
    $outStream = New-Object System.IO.MemoryStream
    $img.Save($outStream, [System.Drawing.Imaging.ImageFormat]::Png)
    $img.Dispose()
    $inStream.Dispose()
    
    [System.IO.File]::WriteAllBytes($fullPath, $outStream.ToArray())
    $outStream.Dispose()
    Write-Host "Converted $f to valid PNG"
}
