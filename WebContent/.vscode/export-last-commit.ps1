# =========================
# UTF-8 강제
# =========================
chcp 65001 | Out-Null
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

# =========================
# Git 루트
# =========================
$gitRoot = git rev-parse --show-toplevel
Set-Location $gitRoot

# =========================
# ZIP 저장 폴더 (영문 추천)
# =========================
$basePath = "D:\DGB_zip"
if (!(Test-Path $basePath)) {
    New-Item -ItemType Directory -Path $basePath | Out-Null
}

# =========================
# 날짜 + 커밋 메시지
# =========================
$date = Get-Date -Format "yyyyMMdd"
$msg = git log -1 --pretty=%s
$msg = $msg -replace '[\\/:*?"<>| ]', '_'

$zipPath = Join-Path $basePath "${date}_${msg}.zip"

# =========================
# 변경 파일 목록
# =========================
$files = git diff --name-only HEAD~1 HEAD |
         Where-Object { $_ -like "WebContent/*" }

if ($files.Count -eq 0) {
    Write-Host "변경된 파일이 없습니다."
    exit
}

# =========================
# 임시 작업 폴더
# =========================
$tempDir = Join-Path $env:TEMP "git_export_temp"
if (Test-Path $tempDir) {
    Remove-Item $tempDir -Recurse -Force
}
New-Item -ItemType Directory -Path $tempDir | Out-Null

# =========================
# 파일 복사
# =========================
foreach ($file in $files) {
    $src = Join-Path $gitRoot $file
    $dest = Join-Path $tempDir $file
    $destDir = Split-Path $dest

    if (!(Test-Path $destDir)) {
        New-Item -ItemType Directory -Path $destDir -Force | Out-Null
    }

    Copy-Item $src $dest -Force
}

# =========================
# ZIP 생성
# =========================
Compress-Archive -Path "$tempDir\*" -DestinationPath $zipPath -Force

Remove-Item $tempDir -Recurse -Force

Write-Host "ZIP 생성 완료:"
Write-Host $zipPath
