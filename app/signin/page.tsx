"use client";
import { useState } from "react";
import { SigninForm } from "@/components/signup-form";
import axios from "axios";

const Page = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [userName, setUsername] = useState<string>("");

  const signinHandler = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent form default submission behavior
      try{
        await axios.post("/api/users/signup",{email,password,userName})
      }
      catch(err){
        console.log(err)
      }
  };

  return (
    <div className="flex h-[84vh] sm:h-[90vh] w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <SigninForm setEmail={setEmail} signinHandler={signinHandler} setPassword={setPassword} setUsername={setUsername}/>
      </div>
    </div>
  );
};

export default Page;
