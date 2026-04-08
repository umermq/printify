

# Set Up Real Email/Password Authentication

## What changes

### 1. Create AuthContext (`src/contexts/AuthContext.tsx`)
- Manages auth state using `supabase.auth.onAuthStateChange` (set up before `getSession`)
- Exposes `user`, `session`, `loading`, `signUp`, `signIn`, `signOut`
- No profiles table needed -- just uses built-in auth

### 2. Update Login page (`src/pages/Login.tsx`)
- Wire `handleSubmit` to call `supabase.auth.signUp` (register) or `supabase.auth.signInWithPassword` (login)
- Show loading state during auth calls
- On successful login, redirect to `/` (or `/admin` based on role later)
- On successful signup, show "Check your email to verify your account" message
- Keep existing Zod validation and UI styling

### 3. Wrap app in AuthProvider (`src/App.tsx`)
- Add `<AuthProvider>` inside `BrowserRouter`

### 4. Protect admin routes (`src/pages/admin/AdminLayout.tsx`)
- Check `useAuth()` -- if not authenticated, redirect to `/login`
- Show loading spinner while auth state resolves

### 5. Update Header (`src/components/Layout.tsx`)
- If logged in: show user email/avatar and "Sign Out" button instead of "Login" link
- If logged out: show "Login" link as before

### 6. Add password reset flow
- Add "Forgot Password?" link on login form
- Create `/reset-password` page that handles the recovery token and lets users set a new password

## Files to create/modify

| File | Change |
|---|---|
| `src/contexts/AuthContext.tsx` | New -- auth context with Supabase auth |
| `src/pages/Login.tsx` | Wire to real Supabase auth |
| `src/pages/ResetPassword.tsx` | New -- password reset page |
| `src/App.tsx` | Add AuthProvider, add `/reset-password` route |
| `src/pages/admin/AdminLayout.tsx` | Protect with auth check |
| `src/components/Layout.tsx` | Show signed-in state in header |

No database migrations needed -- using built-in auth only.

