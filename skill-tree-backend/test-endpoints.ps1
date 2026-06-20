Write-Host "=== SkillTree Backend Tests ===" -ForegroundColor Cyan

Write-Host "`n1. Health Check" -ForegroundColor Yellow
try {
  Invoke-RestMethod -Uri "http://localhost:3000/health" | ConvertTo-Json
} catch {
  Write-Host "Failed: $_" -ForegroundColor Red
}

Write-Host "`n2. GitHub Analysis (torvalds)" -ForegroundColor Yellow
$body = '{"username":"torvalds"}'
try {
  Invoke-RestMethod -Uri "http://localhost:3000/api/github/analyze" -Method POST -ContentType "application/json" -Body $body | ConvertTo-Json -Depth 5
} catch {
  Write-Host "Failed: $_" -ForegroundColor Red
}

Write-Host "`n3. Deployment Verify" -ForegroundColor Yellow
$body2 = '{"url":"https://google.com","developerId":"test"}'
try {
  Invoke-RestMethod -Uri "http://localhost:3000/api/deployment/verify" -Method POST -ContentType "application/json" -Body $body2 | ConvertTo-Json -Depth 5
} catch {
  Write-Host "Failed: $_" -ForegroundColor Red
}

Write-Host "`n4. Leaderboard" -ForegroundColor Yellow
try {
  Invoke-RestMethod -Uri "http://localhost:3000/api/ledger/leaderboard" | ConvertTo-Json -Depth 3
} catch {
  Write-Host "Failed: $_" -ForegroundColor Red
}

Write-Host "`n=== Tests Complete ===" -ForegroundColor Cyan
