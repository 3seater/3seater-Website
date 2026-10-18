param([switch]$NoOpen, [switch]$Main)
$projectRoot = Split-Path $PSScriptRoot -Parent
$previewUrl = if ($Main) { 'http://127.0.0.1:4173/' } else { 'http://127.0.0.1:4173/batch-ten/' }
$expected = if ($Main) { 'Selected Work</title>' } else { 'Four kept.' }
$ready = $false
try {
  $response = Invoke-WebRequest $previewUrl -UseBasicParsing -TimeoutSec 2
  $ready = $response.Content.Contains($expected)
} catch {}
if (-not $ready) {
  $nodePath = (Get-Command node -ErrorAction Stop).Source
  Start-Process -FilePath $nodePath -ArgumentList 'scripts/serve.mjs --collections' -WorkingDirectory $projectRoot -WindowStyle Hidden -RedirectStandardOutput "$projectRoot/preview-local.log" -RedirectStandardError "$projectRoot/preview-local-error.log"
  for ($attempt = 0; $attempt -lt 20; $attempt++) {
    Start-Sleep -Milliseconds 250
    try {
      $response = Invoke-WebRequest $previewUrl -UseBasicParsing -TimeoutSec 2
      if ($response.Content.Contains($expected)) { $ready = $true; break }
    } catch {}
  }
}
if (-not $ready) { throw 'Local preview could not start. Check preview-local-error.log.' }
if (-not $NoOpen) { Start-Process $previewUrl }
Write-Output $previewUrl
