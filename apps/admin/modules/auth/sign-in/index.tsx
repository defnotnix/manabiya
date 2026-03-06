"use client";

import { CircleIcon } from "@phosphor-icons/react";
import { PageSignIn } from "@settle/admin";

export function ModuleSignIn() {
  return (
    <PageSignIn
      heading={["Welcome Back! to", "Manabiya Admin."]}
      subheading="Enter your credentials to access your account."
      loginApi="/api/auth/token/"
      skipEmailValidation
      successRedirectUrl="/admin"
      forgotRedirectUrl="/forgot-password"
      icon={<CircleIcon weight="duotone" color="var(--mantine-color-brand-6)" size={32} />}
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
