import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Zap, Check } from "lucide-react";

export const metadata: Metadata = { title: "Create Account — SignFlow" };

const FEATURES = [
  "Up to 5 signers per document",
  "Unlimited templates",
  "Audit trails & compliance",
  "API integrations",
];

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left — Brand Panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 gradient-brand relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-12">
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-bold text-lg text-white tracking-tight">SignFlow</span>
          </div>
          <h2 className="text-4xl font-bold text-white leading-tight mb-4">
            Start signing in<br />minutes for free.
          </h2>
          <p className="text-white/80 text-lg mb-8">
            No credit card required. Cancel anytime.
          </p>
          <div className="space-y-3">
            {FEATURES.map((f) => (
              <div key={f} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-white/90 text-sm">{f}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="relative z-10">
          <div className="glass-dark rounded-2xl p-5">
            <p className="text-white/90 text-sm italic leading-relaxed">
              &ldquo;SignFlow reduced our contract turnaround time by 80%. The UI is incredibly intuitive.&rdquo;
            </p>
            <div className="flex items-center gap-3 mt-4">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold text-white">MR</div>
              <div>
                <p className="text-white text-xs font-semibold">Michael Rodriguez</p>
                <p className="text-white/60 text-[10px]">VP Operations, TechCorp</p>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full bg-white/5" />
        <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-white/5" />
      </div>

      {/* Right — Register Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-[400px] animate-fade-in">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-8 lg:hidden">
              <div className="w-7 h-7 rounded-lg gradient-brand flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" strokeWidth={2.5} />
              </div>
              <span className="font-bold text-sm">SignFlow</span>
            </div>
            <h1 className="text-2xl font-bold">Create your account</h1>
            <p className="text-sm text-muted-foreground mt-1">14-day free trial. No credit card required.</p>
          </div>

          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="reg-first">First Name</Label>
                <Input id="reg-first" placeholder="John" autoComplete="given-name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reg-last">Last Name</Label>
                <Input id="reg-last" placeholder="Smith" autoComplete="family-name" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="reg-email">Work Email</Label>
              <Input id="reg-email" type="email" placeholder="you@company.com" autoComplete="email" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reg-company">Company</Label>
              <Input id="reg-company" placeholder="Acme Corp" autoComplete="organization" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reg-password">Password</Label>
              <Input id="reg-password" type="password" placeholder="Min. 8 characters" autoComplete="new-password" />
            </div>

            <Link href="/">
              <Button className="w-full" size="lg" id="register-submit-btn">
                Create Free Account
              </Button>
            </Link>

            <p className="text-[10px] text-muted-foreground text-center">
              By registering, you agree to our{" "}
              <Link href="#" className="underline">Terms of Service</Link>{" "}
              and{" "}
              <Link href="#" className="underline">Privacy Policy</Link>.
            </p>
          </form>

          <Separator className="my-6" />

          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" size="default" id="google-reg-btn">
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </Button>
            <Button variant="outline" size="default" id="ms-reg-btn">
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                <path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zM24 11.4H12.6V0H24v11.4z"/>
              </svg>
              Microsoft
            </Button>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline font-medium">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
