param(
  [Parameter(Mandatory = $true)]
  [string]$SourceDir,

  [Parameter(Mandatory = $true)]
  [string]$OutputDir,

  [Parameter(Mandatory = $true)]
  [string]$RepositoryName
)

$ErrorActionPreference = "Stop"

if (Test-Path -LiteralPath $OutputDir) {
  Remove-Item -LiteralPath $OutputDir -Recurse -Force
}

New-Item -ItemType Directory -Path $OutputDir | Out-Null
Get-ChildItem -LiteralPath $SourceDir -Force | ForEach-Object {
  if ($_.FullName -eq (Resolve-Path -LiteralPath $OutputDir).Path) { return }
  if ($_.Name -eq ".git") { return }
  Copy-Item -LiteralPath $_.FullName -Destination $OutputDir -Recurse -Force
}

# User/Org pages repo works from root; project repo needs /<repo> prefix.
$isRootPagesRepo = $RepositoryName -match "\.github\.io$"
$prefix = if ($isRootPagesRepo) { "" } else { "/$RepositoryName" }

if ($prefix -ne "") {
  Get-ChildItem -Path $OutputDir -Recurse -File -Filter "*.html" | ForEach-Object {
    $content = Get-Content -LiteralPath $_.FullName -Raw
    if ($null -eq $content) { return }

    # Prefix internal absolute paths in common attributes and JSON-encoded strings.
    $content = [regex]::Replace(
      $content,
      '((?:href|src|action)=["''])/(?!/)',
      ('$1' + $prefix + '/')
    )
    $content = [regex]::Replace(
      $content,
      '([\\"''])/(?!/)',
      ('$1' + $prefix + '/')
    )

    # Guard against accidental double-prefixing.
    $content = $content -replace [regex]::Escape("$prefix$prefix"), $prefix

    Set-Content -LiteralPath $_.FullName -Value $content -NoNewline -Encoding UTF8
  }
}

# GitHub Pages serves /404.html for unknown routes.
$rootIndex = Join-Path $OutputDir "index.html"
$notFound = Join-Path $OutputDir "404.html"
if (Test-Path -LiteralPath $rootIndex) {
  Copy-Item -LiteralPath $rootIndex -Destination $notFound -Force
}

Write-Output "Prepared GitHub Pages artifact at: $OutputDir"
