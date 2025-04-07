"use client";

import { useState} from "react";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";
import { LoginForm } from "@/components/login-form";
export default function Page() {

  
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  
  const loginHandler = async (e: React.FormEvent) => {
      e.preventDefault(); // Prevent form default submission behavior
      try {
        toast.success("Logged In Sucessfully")
        await signIn("credentials", {
          redirect: true,
          email,
          password,
          callbackUrl: "/", 
        });
  
      } catch (err) {
        console.log(err);
      }
    };
  return (
    <div className="flex h-[84vh]  sm:h-[90vh] w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm
        setEmail={setEmail}
        loginHandler={loginHandler}
        setPassword={setPassword}
        />
      </div>
    </div>
  )
}
