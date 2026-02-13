"use client";

import { PageSignIn } from "@settle/admin";

export function ModuleSignIn() {
  return (
    <PageSignIn
      heading={["Welcome Back!", "to your zetsel portal."]}
      subheading="Enter your credentials to access your account."
      loginApi="/api/auth/token/"
      skipEmailValidation
      successRedirectUrl="/admin"
      forgotRedirectUrl="/forgot-password"
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
