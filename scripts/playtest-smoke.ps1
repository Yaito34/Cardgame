# Smoke checks for cards.json + key playtest rules (no browser).
# Run: powershell -NoProfile -File scripts/playtest-smoke.ps1
$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $PSScriptRoot
Set-Location $Root
if (-not (Test-Path "cards.json")) { throw "cards.json not found in $Root" }

$script:failed = 0

function Parse-OutcomeValue([string]$text, [string]$key) {
  if ([string]::IsNullOrEmpty($text)) { return 0 }
  $m = [regex]::Match($text, "$key\s+(\d+)", [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
  if ($m.Success) { return [int]$m.Groups[1].Value }
  return 0
}

function Test-WolfAwarenessAvailable($revealedNames, $currentName) {
  if ($currentName -ne "Wolf") { return $true }
  $wolves = @($revealedNames | Where-Object { $_ -eq "Wolf" }).Count
  return ($wolves -eq 1)
}

$raw = Get-Content -Path "cards.json" -Raw -Encoding UTF8
$j = $raw | ConvertFrom-Json
$zone = $j.decks | Where-Object { $_.id -eq "zone-deck-1" } | Select-Object -First 1
if (-not $zone) { throw "zone-deck-1 not found" }

$challenges = @($zone.cards)
$issues = New-Object System.Collections.Generic.List[string]

function Fail([string]$msg) {
  $script:failed++
  [void]$issues.Add("FAIL: $msg")
  Write-Host "FAIL: $msg" -ForegroundColor Red
}

function Pass([string]$msg) {
  Write-Host "PASS: $msg" -ForegroundColor Green
}

# --- JSON structure ---
Pass "Loaded zone deck with $($challenges.Count) challenge cards"
foreach ($c in $challenges) {
  if (-not $c.approaches -or $c.approaches.Count -lt 1) { Fail "$($c.id): no approaches" }
}

# --- Outcome parsing (mirrors playtest parseValue) ---
$p = Parse-OutcomeValue "Progress 1 · Scout 1" "Progress"
$s = Parse-OutcomeValue "Progress 1 · Scout 1" "Scout"
if ($p -eq 1 -and $s -eq 1) { Pass "Combined outcome Progress 1 · Scout 1 parses both values" }
else { Fail "Combined outcome parse got Progress=$p Scout=$s" }

# --- Wolf sole-wolf gate ---
$wolfOnly = @("Wolf")
if (Test-WolfAwarenessAvailable $wolfOnly "Wolf") { Pass "Wolf Awareness allowed when sole Wolf in set" }
else { Fail "Wolf sole should allow Awareness" }

$threeWolves = @("Wolf", "Wolf", "Wolf")
if (-not (Test-WolfAwarenessAvailable $threeWolves "Wolf")) { Pass "Wolf Awareness blocked when 3 Wolves revealed" }
else { Fail "Wolf pack should block sole-Wolf Awareness" }

$mixed = @("Wolf", "Crow Flock", "Wolf")
if (-not (Test-WolfAwarenessAvailable $mixed "Wolf")) { Pass "Wolf Awareness blocked when 2 Wolves in set" }
else { Fail "Two wolves should block Awareness" }

# --- Card-specific expectations (post-rebalance) ---
$byId = @{}
foreach ($c in $challenges) { $byId[$c.id] = $c }

function Card-HasApproachType($card, [string]$type) {
  return @($card.approaches | Where-Object { $_.type -eq $type }).Count -gt 0
}

$boar = $byId["ZD1_WILD_BOAR_1"]
if ($boar.approaches.Count -ge 3 -and (Card-HasApproachType $boar "Craft")) {
  Pass "Wild Boar has Craft line (tool diversity)"
} else { Fail "Wild Boar should have Craft approach" }

$crow = $byId["ZD1_CROW_FLOCK"]
if (Card-HasApproachType $crow "Craft") { Pass "Crow Flock has Craft line" }
else { Fail "Crow Flock should have Craft" }

$wolf = $byId["ZD1_WOLF_1"]
$aw = $wolf.approaches | Where-Object { $_.type -eq "Awareness" } | Select-Object -First 1
if ($aw.condition -match "sole Wolf|alone") { Pass "Wolf Awareness has sole-wolf condition text" }
else { Fail "Wolf Awareness condition missing" }

$fight = $wolf.approaches | Where-Object { $_.type -eq "Fight" } | Select-Object -First 1
if ($fight.subEffect -match "\[3\+\]") { Pass "Wolf Fight has [3+] Exhaust subEffect" }
else { Fail "Wolf Fight subEffect missing" }

# --- SubEffect pattern sanity ---
$subOk = $true
foreach ($c in $challenges) {
  foreach ($a in $c.approaches) {
    if ($a.subEffect) {
      if ($a.subEffect -notmatch '\[\d+\+\]\s*Exhaust\s+\d+') {
        $issues.Add("WARN: $($c.id) $($a.type) subEffect not in [N+] Exhaust M form: $($a.subEffect)")
        $subOk = $false
      }
    }
  }
}
if ($subOk) { Pass "All subEffects match [N+] Exhaust M pattern" }
else { Write-Host "WARN: some subEffects did not match expected pattern (see above)" -ForegroundColor Yellow }

# --- Summary narrative ---
Write-Host ""
Write-Host "=== What this checks ===" -ForegroundColor Cyan
Write-Host "- cards.json parses; every card has approaches"
Write-Host "- Outcome strings like 'Progress 1 · Scout 1' parse (playtest applyOutcomes)"
Write-Host "- Sole-Wolf rule matches playtest: exactly 1 Wolf in revealed batch"
Write-Host "- Sample rebalance: Boar Craft, Crow Craft, Wolf subEffect/condition"
Write-Host ""
Write-Host "=== Better / worse (design, not measured here) ===" -ForegroundColor Cyan
Write-Host "Better: More Craft/Fight lines -> Hand Axe / Blades matter; Boar Traverse is no longer pure Scout."
Write-Host "Better: Wolf pack -> Awareness Scout line locked until one Wolf left -> order matters."
Write-Host "Watch: SubEffects on cheap lines -> more Exhaust if you barely win -> track Power vs difficulty."
Write-Host "Watch: More approaches per card -> slightly more reading; tool lock per batch still constrains you."
Write-Host ""

if ($script:failed -gt 0) {
  Write-Host "Completed with $($script:failed) failure(s)." -ForegroundColor Red
  exit 1
}
Write-Host "All automated checks passed." -ForegroundColor Green
exit 0
