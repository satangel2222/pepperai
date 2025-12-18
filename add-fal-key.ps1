# PowerShell script to add FAL_KEY to Vercel using API
# Run this script to automatically add the environment variable

$projectId = "pepperai"
$falKey = "c03c9a8c-1885-4438-9559-dcb8af729625:91a5b95ec717fe0a0cbaeaea463a7de3"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Adding FAL_KEY to Vercel" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if vercel CLI is installed
$vercelInstalled = Get-Command vercel -ErrorAction SilentlyContinue

if (-not $vercelInstalled) {
    Write-Host "❌ Vercel CLI not found. Installing..." -ForegroundColor Yellow
    npm install -g vercel
}

Write-Host "✅ Vercel CLI is ready" -ForegroundColor Green
Write-Host ""

# Login to Vercel (this will open browser)
Write-Host "🔐 Logging in to Vercel..." -ForegroundColor Yellow
Write-Host "   (A browser window will open for authentication)" -ForegroundColor Gray
vercel login

Write-Host ""
Write-Host "📝 Adding FAL_KEY environment variable..." -ForegroundColor Yellow

# Add environment variable for production
Write-Host "   Adding to Production..." -ForegroundColor Gray
echo $falKey | vercel env add FAL_KEY production

# Add environment variable for preview
Write-Host "   Adding to Preview..." -ForegroundColor Gray
echo $falKey | vercel env add FAL_KEY preview

# Add environment variable for development
Write-Host "   Adding to Development..." -ForegroundColor Gray
echo $falKey | vercel env add FAL_KEY development

Write-Host ""
Write-Host "✅ FAL_KEY added to all environments!" -ForegroundColor Green
Write-Host ""
Write-Host "🚀 Triggering redeploy..." -ForegroundColor Yellow
vercel --prod

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  ✅ DEPLOYMENT COMPLETE!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Your app is now live with FAL AI integration!" -ForegroundColor Green
Write-Host "Visit: https://pepperai.vercel.app" -ForegroundColor Cyan
Write-Host ""
