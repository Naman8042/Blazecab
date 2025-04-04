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

interface LoginProps {
  setEmail: Dispatch<SetStateAction<string>>;
  setPassword: Dispatch<SetStateAction<string>>;
  setUsername: Dispatch<SetStateAction<string>>;
  signinHandler: (e: React.FormEvent) => Promise<void>;
}

export function SigninForm({
  setEmail,
  setPassword,
  signinHandler,
  setUsername,
}: LoginProps) {
  return (
    <div className={cn("flex flex-col gap-6")}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Signin</CardTitle>
          <CardDescription>Enter your email below to sign in</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={signinHandler}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="username"
                  placeholder="Username"
                  required
                  onChange={(e) => setUsername(e.target.value)}
                />
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
                
              <Button type="submit" className="w-full">
                Login
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <a href="#" className="underline underline-offset-4">
                Sign up
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
