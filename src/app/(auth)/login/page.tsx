import type { Metadata } from "next";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Zap } from "lucide-react";

export const metadata: Metadata = { title: "Sign In — SignFlow" };

export default function LoginPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left — Brand Panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 gradient-brand relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-12">
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-bold text-lg text-white tracking-tight">
              SignFlow
            </span>
          </div>
          <h2 className="text-4xl font-bold text-white leading-tight mb-4">
            Sign documents
            <br />
            faster than ever.
          </h2>
          <p className="text-white/80 text-lg">
            Enterprise-grade e-signatures with powerful workflow automation.
          </p>
        </div>

        <div className="relative z-10 space-y-4">
          {[
            { stat: "10M+", label: "Documents signed" },
            { stat: "50K+", label: "Businesses trust us" },
            { stat: "99.9%", label: "Uptime SLA" },
          ].map((item) => (
            <div key={item.stat} className="flex items-center gap-3">
              <span className="text-2xl font-bold text-white">{item.stat}</span>
              <span className="text-white/70">{item.label}</span>
            </div>
          ))}
        </div>

        <div className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full bg-white/5" />
        <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-white/5" />
      </div>

      {/* Right — Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-[400px] animate-fade-in">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-8 lg:hidden">
              <div className="w-7 h-7 rounded-lg gradient-brand flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" strokeWidth={2.5} />
              </div>
              <span className="font-bold text-sm">SignFlow</span>
            </div>
            <h1 className="text-2xl font-bold">Welcome back</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Sign in to your SignFlow account
            </p>
          </div>

          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="login-email">Email</Label>
              <Input
                id="login-email"
                type="email"
                placeholder="you@company.com"
                autoComplete="email"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="login-password">Password</Label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="login-password"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>

            <Link
              href="/"
              className={buttonVariants({
                variant: "default",
                size: "lg",
                className: "w-full",
              })}
              id="login-submit-btn"
            >
              Sign In
            </Link>
          </form>

          <div className="relative my-6">
            <Separator />
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-3 text-xs text-muted-foreground">
              or continue with
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" id="google-login-btn">
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Google
            </Button>
            <Button variant="outline" id="microsoft-login-btn">
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                <path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zM24 11.4H12.6V0H24v11.4z" />
              </svg>
              Microsoft
            </Button>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="text-primary hover:underline font-medium"
            >
              Sign up free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
