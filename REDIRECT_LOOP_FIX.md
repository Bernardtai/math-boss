# Redirect Loop Fix - Production Authentication Issue

## 🐛 Problem
After logging in with Google in production, users experience a redirect loop:
1. Click any page → redirects to `/login`
2. Already logged in → redirects to `/dashboard`
3. Click any page → back to step 1 (infinite loop)

## 🔍 Root Causes

### 1. **Cookie Settings Not Production-Ready**
The authentication cookies weren't being set with proper `sameSite` and `secure` flags for production HTTPS environment.

### 2. **Supabase Redirect URL Mismatch**
Supabase was configured with `localhost:3000` instead of the production URL, causing post-login redirects to fail.

### 3. **Middleware Not Excluding Auth Callback Route**
The middleware was checking authentication on `/api/auth/callback`, potentially interfering with the session establishment.

## ✅ Solutions Applied

### Fix 1: Updated Auth Callback Cookie Handling
**File:** `app/api/auth/callback/route.ts`

**Changes:**
- Created a proper `NextResponse` object to hold cookies
- Added `sameSite: 'lax'` for cross-site request handling
- Added `secure: true` in production for HTTPS
- Ensured cookies are set on the response before redirecting

```typescript
// Before: Cookies weren't properly set on response
request.cookies.set({ name, value, ...options })

// After: Cookies properly set with security flags
response.cookies.set({
  name,
  value,
  ...options,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
})
```

### Fix 2: Updated Middleware Cookie Settings
**File:** `lib/supabase/middleware.ts`

**Changes:**
- Added same cookie security flags to middleware
- Excluded `/api/auth/*` paths from authentication checks
- This prevents middleware from interfering with the callback process

```typescript
// Added exclusion
!request.nextUrl.pathname.startsWith('/api/auth')
```

### Fix 3: Supabase URL Configuration
**Required Manual Step** (Must be done in Supabase Dashboard):

1. Go to: https://supabase.com/dashboard
2. Select your project
3. Navigate to: **Authentication** → **URL Configuration**
4. Update these settings:

   **Site URL:**
   ```
   https://your-app-name.vercel.app
   ```

   **Redirect URLs (add both):**
   ```
   http://localhost:3000/api/auth/callback
   https://your-app-name.vercel.app/api/auth/callback
   ```

## 🚀 Deployment Steps

### Option 1: Use the Automated Script
```bash
./fix-redirect-loop.sh
```

This script will:
- Verify you've updated Supabase settings
- Commit the changes
- Push to GitHub
- Deploy to Vercel

### Option 2: Manual Deployment
```bash
# 1. Commit changes
git add .
git commit -m "fix: resolve redirect loop with proper cookie handling"

# 2. Push to GitHub
git push origin master

# 3. Deploy to Vercel
vercel --prod
```

## 🧪 Testing

After deployment:

1. **Clear browser cookies** for your production domain
2. Navigate to your production URL
3. Click "Sign in with Google"
4. You should be redirected to `/dashboard` successfully
5. Navigate to other pages (Lessons, Profile, Leaderboard)
6. ✅ No redirect loops should occur

## 🔍 Debugging

If issues persist:

### Check Browser Console (F12)
Look for:
- Cookie errors
- CORS errors
- 401/403 authentication errors

### Check Vercel Logs
```bash
vercel logs
```
Look for:
- Authentication errors
- Cookie setting failures

### Check Supabase Auth Logs
1. Go to Supabase Dashboard
2. Authentication → Logs
3. Look for failed authentication attempts

### Verify Cookies Are Set
In browser DevTools:
1. Application tab → Cookies
2. Should see cookies like:
   - `sb-[project-ref]-auth-token`
   - `sb-[project-ref]-auth-token-code-verifier`

## 🎯 Expected Behavior After Fix

### Production Login Flow:
1. User clicks "Sign in with Google" on `/login`
2. Google OAuth popup appears
3. User authorizes
4. Redirected to: `https://your-app.vercel.app/api/auth/callback?code=...`
5. Callback exchanges code for session
6. Session cookies are set with proper security flags
7. User redirected to `/dashboard`
8. ✅ User can navigate freely without redirect loops

### Cookie Behavior:
- **Development:** Cookies set with `sameSite: 'lax'`, `secure: false`
- **Production:** Cookies set with `sameSite: 'lax'`, `secure: true`

## 📝 Technical Details

### Why `sameSite: 'lax'`?
- Allows cookies to be sent on top-level navigation (like OAuth redirects)
- More secure than `none`, less restrictive than `strict`
- Perfect for OAuth flows

### Why `secure: true` in Production?
- Required for HTTPS sites
- Prevents cookie transmission over insecure HTTP
- Browser will reject cookies without this flag on HTTPS sites

### Why Exclude `/api/auth/*` from Middleware?
- Middleware runs before route handlers
- If middleware redirects during auth callback, session won't be established
- Exclusion allows callback to complete before auth check

## 🆘 Common Issues

### Issue: Still redirecting to localhost
**Solution:** Update Supabase URL Configuration (see Fix 3 above)

### Issue: Cookies not being set
**Solution:** Check browser DevTools → Network tab → Response headers
- Should see `Set-Cookie` headers
- Verify `Secure` flag is present on HTTPS

### Issue: "Invalid session" errors
**Solution:** 
- Clear all browser cookies
- Log out from Google
- Try logging in again fresh

### Issue: CORS errors
**Solution:** Verify Supabase allowed origins include your Vercel domain

## 📚 References

- [Supabase SSR Guide](https://supabase.com/docs/guides/auth/server-side/nextjs)
- [Next.js Middleware Cookies](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [MDN: SameSite Cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie/SameSite)

---

**Last Updated:** Dec 21, 2025
**Status:** ✅ Fixed and Deployed

