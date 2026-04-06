import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Mail, Sparkles } from "lucide-react";
import { Link, Navigate } from "react-router-dom";
import { AuthPageLayout } from "./auth-layout";
import { useAuth } from "../hooks/useAuth";



function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const { handleLogin, handleClearError } = useAuth();
  const { loading: isLoading, error } = useSelector((state) => state.auth);

  
  const user = useSelector(state => state.auth.user)
  const loading = useSelector(state => state.auth.loading)

  

  useEffect(() => {
    handleClearError();
  }, []);

  if(!loading &&  user) {
    return <Navigate to="/" replace />
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleLogin({ identifier, password });
  };

  return (
    <AuthPageLayout password={password} showPassword={showPassword} isTyping={isTyping}>
      {/* Mobile Logo */}
      <div className="lg:hidden flex items-center justify-center gap-2 text-lg font-semibold mb-12">
        <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <Sparkles className="size-4 text-primary" />
        </div>
        <span>F.R.I.D.A.Y</span>
      </div>

      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Welcome back!</h1>
        <p className="text-muted-foreground text-sm">Please enter your details</p>
      </div>

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="identifier" className="text-sm font-medium">Email or Username</Label>
          <Input
            id="identifier"
            type="text"
            placeholder="email or username"
            value={identifier}
            autoComplete="off"
            onChange={(e) => setIdentifier(e.target.value)}
            onFocus={() => setIsTyping(true)}
            onBlur={() => setIsTyping(false)}
            required
            className="h-12 bg-background border-border/60 focus:border-primary"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="h-12 pr-10 bg-background border-border/60 focus:border-primary"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? <Eye className="size-5" /> : <EyeOff className="size-5" />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Checkbox id="remember" />
            <Label htmlFor="remember" className="text-sm font-normal cursor-pointer">
              Remember for 30 days
            </Label>
          </div>
          <a href="#" className="text-sm text-primary hover:underline font-medium">
            Forgot password?
          </a>
        </div>

        {error && (
          <div className="p-3 text-sm text-red-400 bg-red-950/20 border border-red-900/30 rounded-lg">
            {error}
          </div>
        )}

        <Button type="submit" className="w-full h-12 text-base font-medium" size="lg" disabled={isLoading}>
          {isLoading ? "Signing in..." : "Log in"}
        </Button>
      </form>

      {/* Social Login */}
      <div className="mt-6">
        <Button variant="outline" className="w-full h-12 bg-background border-border/60 hover:bg-accent" type="button">
          <Mail className="mr-2 size-5" />
          Log in with Google
        </Button>
      </div>

      {/* Sign Up Link */}
      <div className="text-center text-sm text-muted-foreground mt-8">
        Don't have an account?{" "}
        <Link to="/register" className="text-foreground font-medium hover:underline">
          Sign Up
        </Link>
      </div>
    </AuthPageLayout>
  );
}

export const AnimatedLoginPage = LoginPage;
