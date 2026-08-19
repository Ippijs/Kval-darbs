$ErrorActionPreference = 'Stop'

# Starts the frontend in LAN-share mode and prints local/Wi-Fi URLs.
$scriptPath = if ($PSCommandPath) {
  $PSCommandPath
} elseif ($MyInvocation.MyCommand.Path) {
  $MyInvocation.MyCommand.Path
} else {
  $null
}

if ($scriptPath) {
  $projectRoot = Split-Path -Parent $scriptPath
} else {
  # Fallback for interactive execution where no script path is available.
  $projectRoot = (Get-Location).Path
}

$frontendPath = Join-Path $projectRoot 'Frontend'
$port = 5173

# Ensures node/npm are available even if PATH was not refreshed after install.
$nodeExe = Get-Command node.exe -ErrorAction SilentlyContinue
if (-not $nodeExe) {
  $nodeDirCandidates = @(
    'C:\Program Files\nodejs',
    'C:\Program Files (x86)\nodejs',
    (Join-Path $env:LOCALAPPDATA 'Programs\nodejs')
  )

  foreach ($candidate in $nodeDirCandidates) {
    if (Test-Path (Join-Path $candidate 'node.exe')) {
      $env:PATH = "$candidate;$env:PATH"
      break
    }
  }
}

if (-not (Test-Path $frontendPath)) {
  Write-Host "Frontend folder not found at: $frontendPath" -ForegroundColor Red
  exit 1
}

if (-not (Get-Command node.exe -ErrorAction SilentlyContinue)) {
  Write-Host 'Node.js is not installed or not in PATH.' -ForegroundColor Red
  Write-Host 'Install Node.js from https://nodejs.org/ and run again.' -ForegroundColor Yellow
  exit 1
}

if (-not (Get-Command npm.cmd -ErrorAction SilentlyContinue)) {
  Write-Host 'npm is not installed or not in PATH.' -ForegroundColor Red
  exit 1
}

Set-Location $frontendPath

$npmCmd = (Get-Command npm.cmd -ErrorAction Stop).Source

if (-not (Test-Path '.\node_modules')) {
  Write-Host 'Installing frontend dependencies...' -ForegroundColor Cyan
  & $npmCmd install
}

$lanIp = (
  Get-NetIPConfiguration |
  Where-Object { $_.IPv4DefaultGateway -ne $null -and $_.IPv4Address -ne $null } |
  Select-Object -First 1
).IPv4Address.IPAddress

if (-not $lanIp) {
  $lanIp = 'YOUR_WIFI_IP'
}

Write-Host ''
Write-Host 'App starting in LAN mode...' -ForegroundColor Green
Write-Host "Local:   http://localhost:$port" -ForegroundColor Yellow
Write-Host "Wi-Fi:   http://${lanIp}:$port" -ForegroundColor Yellow
Write-Host 'Anyone on the same Wi-Fi can open the Wi-Fi URL.' -ForegroundColor Cyan
Write-Host 'Keep this terminal open while using the app.' -ForegroundColor DarkGray
Write-Host ''

& $npmCmd run dev -- --host 0.0.0.0 --port $port
