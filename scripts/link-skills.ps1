# Links every promoted skill (engineering, productivity, workbench) into the user-level skill folders of
# Claude Code (~/.claude/skills), Codex and other Agent Skills harnesses (~/.agents/skills) and Antigravity
# (~/.gemini/antigravity/skills), one directory junction per skill (no admin rights needed). Prints the
# Hermes skills.external_dirs entries to paste. A `git pull` in this repo then updates every harness.
#
#   powershell -ExecutionPolicy Bypass -File scripts\link-skills.ps1 [-DryRun] [-IncludeInProgress] [-ExtraSkillDirs <dir>,<dir>]
#
# -ExtraSkillDirs links skills from other folders too (e.g. vendor skills kept in the agent library).
# Existing real folders with a skill's name are renamed <name>.bak-<date>, never deleted. Stale junctions that
# point into this repo (renamed or removed skills) are removed; entries owned by anything else are left alone.
# Works in Windows PowerShell 5.1 and PowerShell 7.
[CmdletBinding()]
param([switch]$DryRun, [switch]$IncludeInProgress, [string[]]$ExtraSkillDirs = @())
$ErrorActionPreference = 'Stop'
$Repo = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$Stamp = Get-Date -Format 'yyyy-MM-dd'
$Buckets = @('engineering', 'productivity', 'workbench')
if ($IncludeInProgress) { $Buckets += 'in-progress' }

function Act([string]$Message, [scriptblock]$Do) {
    if ($DryRun) { Write-Host "[dry-run] $Message" } else { & $Do; Write-Host "  $Message" }
}
function Is-Junction($Item) { $Item -and ($Item.Attributes -band [IO.FileAttributes]::ReparsePoint) }
function Link-Target($Item) { try { "$($Item.Target)".Trim() } catch { '' } }

# Collect skills: name -> source folder (first one wins; duplicates are an error)
$skills = [ordered]@{}
$sources = @()
foreach ($b in $Buckets) { $sources += Join-Path (Join-Path $Repo 'skills') $b }
$sources += $ExtraSkillDirs
foreach ($dir in $sources) {
    if (-not (Test-Path -LiteralPath $dir)) { continue }
    Get-ChildItem -LiteralPath $dir -Directory | Where-Object { Test-Path -LiteralPath (Join-Path $_.FullName 'SKILL.md') } | ForEach-Object {
        if ($skills.Contains($_.Name)) { throw "Duplicate skill name '$($_.Name)': $($skills[$_.Name]) and $($_.FullName)" }
        $skills[$_.Name] = $_.FullName
    }
}
Write-Host "Found $($skills.Count) skills to link." -ForegroundColor Cyan

$dests = @(
    (Join-Path $HOME '.claude\skills'),
    (Join-Path $HOME '.agents\skills'),
    (Join-Path $HOME '.gemini\antigravity\skills')
)

foreach ($dest in $dests) {
    Write-Host "`n$dest" -ForegroundColor Cyan
    $destItem = Get-Item -LiteralPath $dest -Force -ErrorAction SilentlyContinue
    if (Is-Junction $destItem) {
        # An older install linked the whole folder somewhere; replace it with a real folder of per-skill links.
        Act "replaced folder-level link ($(Link-Target $destItem)) with a real folder" { & cmd /c rmdir "$dest" | Out-Null }
        $destItem = $null
    }
    if (-not $destItem) { Act "created $dest" { New-Item -ItemType Directory -Path $dest -Force | Out-Null } }

    foreach ($name in $skills.Keys) {
        $src = $skills[$name]
        $target = Join-Path $dest $name
        $item = Get-Item -LiteralPath $target -Force -ErrorAction SilentlyContinue
        if (Is-Junction $item) {
            if ((Link-Target $item) -eq $src) { continue }
            Act "relinked $name" { & cmd /c rmdir "$target" | Out-Null; New-Item -ItemType Junction -Path $target -Target $src | Out-Null }
        } elseif ($item) {
            Act "backed up existing $name to $name.bak-$Stamp, then linked" {
                Rename-Item -LiteralPath $target -NewName "$name.bak-$Stamp"
                New-Item -ItemType Junction -Path $target -Target $src | Out-Null
            }
        } else {
            Act "linked $name" { New-Item -ItemType Junction -Path $target -Target $src | Out-Null }
        }
    }

    # Remove stale junctions into this repo (skill renamed or removed).
    if (Test-Path -LiteralPath $dest) {
        Get-ChildItem -LiteralPath $dest -Force | Where-Object { Is-Junction $_ } | ForEach-Object {
            $t = Link-Target $_
            if ($t.StartsWith($Repo, [StringComparison]::OrdinalIgnoreCase) -and -not $skills.Contains($_.Name)) {
                $path = $_.FullName
                Act "removed stale link $($_.Name) -> $t" { & cmd /c rmdir "$path" | Out-Null }
            }
        }
    }
}

Write-Host "`nHermes: put these under skills.external_dirs in every profile's config.yaml" -ForegroundColor Cyan
foreach ($dir in $sources) { if (Test-Path -LiteralPath $dir) { Write-Host ("  - " + ($dir -replace '\\', '/')) } }
