"use client";

import Image from "next/image";
import logoWhite from "@/assets/logowhite.png";
import { PageSignIn } from "@settle/admin";

interface ModuleSignInProps {
  disableSignUp?: boolean;
  disableForgotPassword?: boolean;
}

export function ModuleSignIn({
  disableSignUp = true,
  disableForgotPassword = true,
}: ModuleSignInProps = {}) {
  return (
    <PageSignIn
      heading={["Welcome Back! to", "Manabiya Admin."]}
      subheading="Enter your credentials to access your account."
      loginApi="/api/auth/token/"
      skipEmailValidation
      successRedirectUrl="/admin"
      forgotRedirectUrl="/forgot-password"
      icon={<Image src={logoWhite} alt="Manabiya Logo" width={64} height={64} />}
      disableSignUp={disableSignUp}
      disableForgotPassword={disableForgotPassword}
      // hasGoogleLogin={true}
      // hasAppleLogin={true}
      // hasDiscordLogin={true}
      // hasMagicLinkLogin={false}
      onSuccess={(response) => {
        console.log("Login successful:", response);
      }}
      onError={(error) => {
        console.log("Login error:", error);
      }}
      onForgotPassword={() => {
        console.log("Navigating to forgot password");
        window.location.href = "/forgot-password";
      }}
    />
  );
}
