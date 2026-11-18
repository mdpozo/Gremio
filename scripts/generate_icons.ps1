Add-Type -AssemblyName System.Drawing

$sourcePath = "public/app-icon.jpg"
$baseDir = "android/app/src/main/res"

if (-not (Test-Path $sourcePath)) {
    Write-Error "Source image not found: $sourcePath"
    exit 1
}

$sourceImg = [System.Drawing.Image]::FromFile((Resolve-Path $sourcePath))

$densities = @(
    @{ folder = "mipmap-mdpi"; size = 48; fgSize = 108 },
    @{ folder = "mipmap-hdpi"; size = 72; fgSize = 162 },
    @{ folder = "mipmap-xhdpi"; size = 96; fgSize = 216 },
    @{ folder = "mipmap-xxhdpi"; size = 144; fgSize = 324 },
    @{ folder = "mipmap-xxxhdpi"; size = 192; fgSize = 432 }
)

function Resize-Image($img, $width, $height, $padPercent = 0) {
    $bmp = New-Object System.Drawing.Bitmap $width, $height
    $graphics = [System.Drawing.Graphics]::FromImage($bmp)
    
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $graphics.Clear([System.Drawing.Color]::Transparent)
    
    if ($padPercent -gt 0) {
        $destW = [int]($width * (1.0 - $padPercent))
        $destH = [int]($height * (1.0 - $padPercent))
        $destX = [int](($width - $destW) / 2)
        $destY = [int](($height - $destH) / 2)
        $destRect = New-Object System.Drawing.Rectangle $destX, $destY, $destW, $destH
    } else {
        $destRect = New-Object System.Drawing.Rectangle 0, 0, $width, $height
    }
    
    $graphics.DrawImage($img, $destRect)
    $graphics.Dispose()
    return $bmp
}

foreach ($d in $densities) {
    $destFolder = Join-Path $baseDir $d.folder
    if (-not (Test-Path $destFolder)) {
        New-Item -ItemType Directory -Path $destFolder -Force | Out-Null
    }
    
    # 1. Standard icon (ic_launcher.png)
    $iconBmp = Resize-Image $sourceImg $d.size $d.size 0
    $iconPath = Join-Path $destFolder "ic_launcher.png"
    $iconBmp.Save($iconPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $iconBmp.Dispose()
    
    # 2. Round icon (ic_launcher_round.png)
    $roundBmp = Resize-Image $sourceImg $d.size $d.size 0
    $roundPath = Join-Path $destFolder "ic_launcher_round.png"
    $roundBmp.Save($roundPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $roundBmp.Dispose()
    
    # 3. Adaptive foreground (ic_launcher_foreground.png with 20% padding for Android adaptive mask)
    $fgBmp = Resize-Image $sourceImg $d.fgSize $d.fgSize 0.18
    $fgPath = Join-Path $destFolder "ic_launcher_foreground.png"
    $fgBmp.Save($fgPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $fgBmp.Dispose()
    
    Write-Host "Generated icons for $($d.folder) [size: $($d.size)x$($d.size), fg: $($d.fgSize)x$($d.fgSize)]"
}

$sourceImg.Dispose()
Write-Host "All Android icons generated successfully!"
