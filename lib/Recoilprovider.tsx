"use client";
import React from "react";
import { RecoilRoot } from "recoil";
function RecoilContextProvider ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="">
    <RecoilRoot>{children}</RecoilRoot>
  </div>;
};
export default RecoilContextProvider;