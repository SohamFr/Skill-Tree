#!/bin/bash
echo "=== SkillTree Backend Tests ==="
echo ""
echo "1. Health Check"
curl -s http://localhost:3000/health | python3 -m json.tool
echo ""
echo "2. GitHub Analysis (testing with 'torvalds')"
curl -s -X POST http://localhost:3000/api/github/analyze \
  -H "Content-Type: application/json" \
  -d '{"username":"torvalds"}' | python3 -m json.tool
echo ""
echo "3. Deployment Verify (testing with google.com)"
curl -s -X POST http://localhost:3000/api/deployment/verify \
  -H "Content-Type: application/json" \
  -d '{"url":"https://google.com","developerId":"test"}' | python3 -m json.tool
echo ""
echo "4. WakaTime Stats"
curl -s http://localhost:3000/api/wakatime/stats | python3 -m json.tool
echo ""
echo "5. Leaderboard"
curl -s http://localhost:3000/api/ledger/leaderboard | python3 -m json.tool
echo ""
echo "=== Tests Complete ==="
