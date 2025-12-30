
chcp 65001 | Out-Null
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$basePath = "D:\DGB_zip"
if (!(Test-Path $basePath)) {
    New-Item -ItemType Directory -Path $basePath | Out-Null
}


$date = Get-Date -Format "yyyyMMdd"

$commit = git rev-parse HEAD

$msg = git log -1 --pretty=%s
$msg = $msg -replace '[\\/:*?"<>| ]', '_'

$zip = Join-Path $basePath "${date}_${msg}.zip"

$files = git diff --name-only "$commit~1" "$commit"

if ($files.Count -eq 0) {
    Write-Host "변경된 파일이 없습니다."
    exit
}

git archive -o "$zip" "$commit" -- $files

Write-Host "ZIP 생성 완료: $zip"
