# Vercel Deployment Guide for Math Boss

## Current Status
- ✅ Git repository: `https://github.com/Bernardtai/math-boss`
- ✅ Vercel CLI installed
- ✅ Working tree clean
- ⚠️ SSL certificate issue with Vercel CLI login
- 📝 Need to connect GitHub repo to Vercel

## Method 1: Deploy via Vercel Dashboard (Recommended - Easiest)

This is the **easiest and most reliable** method. It will automatically deploy on every git push.

### Step-by-Step Instructions:

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/login
   - Login with your Vercel account (or create one if you don't have it)

2. **Import Your GitHub Repository**
   - Click "Add New..." → "Project"
   - Click "Import Git Repository"
   - Select or search for: `Bernardtai/math-boss`
   - Click "Import"

3. **Configure the Project**
   - **Framework Preset**: Next.js (should be auto-detected)
   - **Root Directory**: ./
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)
   - **Install Command**: `npm install` (default)

4. **Add Environment Variables**
   Click "Environment Variables" and add these:
   
   ```
   NEXT_PUBLIC_SUPABASE_URL=<your-supabase-project-url>
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-supabase-anon-key>
   SUPABASE_SERVICE_ROLE_KEY=<your-supabase-service-role-key>
   ```

   **Where to find these values:**
   - Go to your Supabase Dashboard
   - Select your project
   - Go to Settings → API
   - Copy the URL and keys

5. **Deploy**
   - Click "Deploy"
   - Wait for the deployment to complete (usually 2-3 minutes)

6. **Done! 🎉**
   - After the first deployment, **every git push to master** will automatically trigger a new deployment
   - You'll get a URL like: `https://math-boss-xyz.vercel.app`

### Updating Your Deployment

From now on, to deploy updates:

```bash
# Make your changes
git add .
git commit -m "Your commit message"
git push origin master

# Vercel will automatically deploy! Check the Vercel dashboard for progress.
```

---

## Method 2: Deploy via Vercel CLI (Alternative)

If you prefer using the command line:

### Fix SSL Certificate Issue First

```bash
# Set environment variable to bypass SSL (temporary workaround)
export NODE_TLS_REJECT_UNAUTHORIZED=0

# Or use the web login
vercel login
```

### Initial Setup

```bash
cd /Users/bernard/Desktop/neal/math-boss

# Login to Vercel (opens browser)
vercel login

# Link your project to Vercel
vercel link

# Follow the prompts:
# - Link to existing project? → N (first time)
# - What's your project's name? → math-boss
# - In which directory is your code located? → ./
```

### Deploy

```bash
# Deploy to production
vercel --prod

# This will:
# 1. Build your project
# 2. Upload to Vercel
# 3. Give you a production URL
```

### Set Environment Variables via CLI

```bash
# Add environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL production
# Paste your value when prompted

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
# Paste your value when prompted

vercel env add SUPABASE_SERVICE_ROLE_KEY production
# Paste your value when prompted
```

### Deploy on Git Push

After linking your project, you can enable Git integration:

```bash
# This enables automatic deployments on git push
vercel git connect
```

---

## Method 3: GitHub Actions (Advanced - CI/CD Pipeline)

For automatic deployments with testing and validation:

Create `.github/workflows/deploy.yml` (see the file created for you)

---

## Verifying Deployment

After deployment, check:

1. **Visit your Vercel URL** (e.g., `https://math-boss-xyz.vercel.app`)
2. **Check Build Logs** in Vercel Dashboard
3. **Test Authentication** - Make sure Supabase auth works
4. **Check Environment Variables** - Go to Project Settings → Environment Variables

---

## Common Issues & Solutions

### 1. Build Fails

**Error**: `Module not found` or `Type error`

**Solution**:
```bash
# Clean and rebuild locally first
rm -rf .next node_modules
npm install
npm run build

# If build succeeds locally, push to git
git push origin master
```

### 2. Environment Variables Not Working

**Solution**:
- Make sure you added them in Vercel Dashboard
- Check they're set for "Production" environment
- Redeploy after adding variables

### 3. Supabase Connection Issues

**Solution**:
- Verify environment variables are correct
- Check Supabase API keys are active
- Add Vercel domain to Supabase allowed domains:
  - Supabase Dashboard → Authentication → URL Configuration
  - Add: `https://your-project.vercel.app`

### 4. SSL Certificate Error with Vercel CLI

**Solution**:
```bash
# Temporary fix
export NODE_TLS_REJECT_UNAUTHORIZED=0
vercel whoami

# Or use the dashboard method instead (recommended)
```

---

## Monitoring & Analytics

After deployment, you can:

1. **View Analytics**: Vercel Dashboard → Your Project → Analytics
2. **Monitor Logs**: Vercel Dashboard → Your Project → Deployments → [Click deployment] → Logs
3. **Check Performance**: Vercel Dashboard → Your Project → Speed Insights

---

## Quick Reference Commands

```bash
# Check Vercel login status
vercel whoami

# Deploy to production
vercel --prod

# View deployment logs
vercel logs

# List all deployments
vercel ls

# Rollback to previous deployment
vercel rollback

# Open project in browser
vercel open
```

---

## Next Steps After Deployment

1. ✅ Test your deployed app
2. ✅ Set up custom domain (optional)
3. ✅ Enable automatic deployments on git push
4. ✅ Add collaborators (if needed)
5. ✅ Set up monitoring and alerts

---

## Support

- Vercel Docs: https://vercel.com/docs
- Vercel Support: https://vercel.com/support
- GitHub Repo: https://github.com/Bernardtai/math-boss

---

**Recommendation**: Use Method 1 (Vercel Dashboard) for the easiest setup. After the initial setup, every git push will automatically deploy! 🚀

