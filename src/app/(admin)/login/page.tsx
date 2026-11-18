import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, Mail, Lock } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Admin Login | Portfolio Dashboard',
  description: 'Secure login for portfolio admin dashboard',
}

export default function LoginPage() {
  async function handleLogin(formData: FormData) {
    'use server'
    
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    
    // In a real app, this would validate against your auth system
    // For now, we'll use a simple demo authentication
    const isValidLogin = email === 'admin@example.com' && password === 'password123'
    
    if (isValidLogin) {
      const cookieStore = await cookies()
      // Set a demo session cookie (in production, use secure httpOnly tokens)
      cookieStore.set('admin_session', 'demo-session-token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24, // 24 hours
        path: '/',
      })
      redirect('/admin/dashboard')
    }
    
    // Return error state to be handled by the form
    return { error: 'Invalid email or password' }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md shadow-lg border-border/50">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Lock className="h-6 w-6 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center font-semibold tracking-tight">
            Admin Dashboard
          </CardTitle>
          <CardDescription className="text-center text-muted-foreground">
            Enter your credentials to access the admin panel
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="admin@example.com"
                  className="pl-10"
                  required
                  defaultValue="admin@example.com"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-10"
                  required
                  defaultValue="password123"
                />
              </div>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <Link
                href="/"
                className="text-primary hover:text-primary/80 underline-offset-4 hover:underline"
              >
                ← Back to portfolio
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground underline-offset-4 hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            
            <Button type="submit" className="w-full">
              Sign In
            </Button>
            
            <Alert variant="default" className="bg-muted/50 border-border">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-sm">
                <p className="font-medium mb-1">Demo Credentials:</p>
                <p>Email: admin@example.com</p>
                <p>Password: password123</p>
              </AlertDescription>
            </Alert>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}