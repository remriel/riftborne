param([string]$OutputPath)

$repoRoot = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$stage = [System.IO.Path]::GetFullPath((Join-Path $repoRoot 'output/release-stage'))
$workspacePrefix = $repoRoot.TrimEnd('\', '/') + [System.IO.Path]::DirectorySeparatorChar
if (-not $stage.StartsWith($workspacePrefix, [System.StringComparison]::OrdinalIgnoreCase)) {
  throw 'Release staging directory escaped the repository.'
}
$version = (Get-Content -LiteralPath (Join-Path $repoRoot 'package.json') -Raw | ConvertFrom-Json).version
if (-not $OutputPath) { $OutputPath = Join-Path $repoRoot "output/Riftborne-v$version-Windows.zip" }
$target = [System.IO.Path]::GetFullPath($OutputPath)

Push-Location $repoRoot
try {
  npm run build
  if ($LASTEXITCODE -ne 0) { throw 'Production build failed.' }
  if (Test-Path -LiteralPath $stage) { Remove-Item -LiteralPath $stage -Recurse -Force }
  New-Item -ItemType Directory -Force -Path $stage | Out-Null
  Copy-Item -LiteralPath (Join-Path $repoRoot 'dist') -Destination (Join-Path $stage 'game') -Recurse
  Copy-Item -LiteralPath (Join-Path $repoRoot 'release/Launch Riftborne.cmd') -Destination $stage
  Copy-Item -LiteralPath (Join-Path $repoRoot 'release/serve-release.mjs') -Destination $stage
  Copy-Item -LiteralPath (Join-Path $repoRoot 'README.md') -Destination $stage
  Copy-Item -LiteralPath (Join-Path $repoRoot 'ASSETS.md') -Destination $stage
  New-Item -ItemType Directory -Force -Path ([System.IO.Path]::GetDirectoryName($target)) | Out-Null
  Compress-Archive -Path (Join-Path $stage '*') -DestinationPath $target -Force
  Write-Output $target
} finally {
  if (Test-Path -LiteralPath $stage) { Remove-Item -LiteralPath $stage -Recurse -Force }
  Pop-Location
}
