"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Dispatch, SetStateAction } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, ArrowRight, UserPlus } from "lucide-react";
import { signIn } from "next-auth/react";
import toast, { Toaster } from "react-hot-toast";

interface SigninProps {
  setEmail: Dispatch<SetStateAction<string>>;
  setPassword: Dispatch<SetStateAction<string>>;
  signinHandler: (e: React.FormEvent) => Promise<void>;
}

export function SigninForm({
  setEmail,
  setPassword,
  signinHandler,
}: SigninProps) {

  const handleGoogleSignIn = async () => {
    try {
      // toast.loading("Redirecting to Google...", { id: "google-auth" });
      await signIn("google", { callbackUrl: "/" }); // REDIRECT URL
    } catch (error) {
      toast.error("Google sign-in failed. Please try again.", { id: "google-auth" });
      console.error("Google Auth Error:", error);
    }
  };

  return (
    <div className={cn("flex flex-col gap-4 w-full max-w-sm mx-auto")}>
      <Toaster position="top-center" />
      <Card className="shadow-lg border-gray-200 overflow-hidden py-0">
        
        {/* Compact Header */}
        <CardHeader className="text-center space-y-1 bg-gray-50/50 pt-6 pb-4 border-b border-gray-100">
          <div className="mx-auto w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center mb-1">
            <UserPlus className="w-5 h-5 text-[#6aa4e0]" />
          </div>
          <CardTitle className="text-xl font-bold text-gray-900">Create Account</CardTitle>
          <CardDescription className="text-sm">
            Join us to manage your bookings
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6">
          
          {/* Google Sign Up Button */}
          <Button
            type="button"
            variant="outline"
            onClick={handleGoogleSignIn}
            className="w-full h-10 bg-white border-gray-300 hover:bg-gray-50 text-gray-700 flex items-center justify-center gap-2 mb-4"
          >
            <GoogleIcon className="w-4 h-4" />
            <span className="text-sm font-medium">Continue with Google</span>
          </Button>

          {/* Divider */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="h-px bg-gray-200 w-full"></div>
            <span className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">Or</span>
            <div className="h-px bg-gray-200 w-full"></div>
          </div>

          <form onSubmit={signinHandler} className="space-y-4">
            
            {/* Email Field */}
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-semibold text-gray-600">
                Email
              </Label>
              <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#6aa4e0] transition-colors pointer-events-none">
                  <Mail className="h-4 w-4" />
                </div>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  required
                  className="pl-9 h-10 text-sm border-gray-200 focus:border-[#6aa4e0] focus:ring-[#6aa4e0]/20 transition-all"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs font-semibold text-gray-600">
                Password
              </Label>
              <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#6aa4e0] transition-colors pointer-events-none">
                  <Lock className="h-4 w-4" />
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a password"
                  required
                  className="pl-9 h-10 text-sm border-gray-200 focus:border-[#6aa4e0] focus:ring-[#6aa4e0]/20 transition-all"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full h-10 bg-[#6aa4e0] hover:bg-[#5a94d0] text-white font-medium shadow-sm transition-all"
            >
              Sign Up <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-5 text-center text-xs text-gray-500">
            Already have an account?{" "}
            <a 
              href="/login" 
              className="font-semibold text-[#6aa4e0] hover:text-[#5a94d0] hover:underline transition-colors"
            >
              Login
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Reusable Google Icon Component
function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M23.766 12.2764C23.766 11.4607 23.6999 10.6406 23.5588 9.83807H12.24V14.4591H18.7217C18.4528 15.9494 17.5885 17.2678 16.323 18.1056V21.1039H20.19C22.4608 19.0139 23.766 15.9274 23.766 12.2764Z" fill="#4285F4"/>
      <path d="M12.2401 24.0008C15.4766 24.0008 18.2059 22.9382 20.1945 21.1039L16.3276 18.1055C15.2517 18.8375 13.8627 19.252 12.2445 19.252C9.11388 19.252 6.45946 17.1399 5.50705 14.3003H1.5166V17.3912C3.55371 21.4434 7.7029 24.0008 12.2401 24.0008Z" fill="#34A853"/>
      <path d="M5.50253 14.3003C5.00236 12.8099 5.00236 11.1961 5.50253 9.70575V6.61481H1.51649C-0.18551 10.0056 -0.18551 14.0004 1.51649 17.3912L5.50253 14.3003Z" fill="#FBBC05"/>
      <path d="M12.2401 4.74966C13.9509 4.7232 15.6044 5.36697 16.8434 6.54867L20.2695 3.12262C18.1001 1.0855 15.2208 -0.034466 12.2401 0.000808666C7.7029 0.000808666 3.55371 2.55822 1.5166 6.61481L5.50264 9.70575C6.45064 6.86173 9.10947 4.74966 12.2401 4.74966Z" fill="#EA4335"/>
    </svg>
  );
}