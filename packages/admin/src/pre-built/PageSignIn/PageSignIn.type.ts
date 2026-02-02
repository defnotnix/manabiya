/**
 * PageSignIn Component Props
 *
 * Configurable pre-built sign-in page component with support for:
 * - Traditional email/password authentication
 * - Social login (Google, Apple, Discord)
 * - Magic link authentication
 */

export interface PageSignInProps {
  /**
   * Heading displayed as two lines
   * @example ["Welcome Back!", "to your organize-it-better portal."]
   */
  heading?: [string, string];

  /**
   * Subheading text displayed below the heading
   * @example "Enter your credentials to access your account."
   */
  subheading?: string;

  /**
   * Icon component to display at the top
   * @example <BowlSteamIcon weight="fill" size={32} />
   */
  icon?: React.ReactNode;

  /**
   * API endpoint for email/password login
   * @example "/api/auth/login/"
   */
  loginApi: string;

  /**
   * Treat input as username instead of email
   * When true:
   * - Skips email format validation (accepts any non-empty string)
   * - Sends { username, password } instead of { email, password }
   * Useful for Django JWT APIs or systems with non-email usernames
   * @default false
   */
  skipEmailValidation?: boolean;

  /**
   * URL to redirect to after successful login
   * @example "/dashboard"
   */
  successRedirectUrl: string;

  /**
   * URL to redirect to when "Forgot Password" is clicked
   * @example "/forgot-password"
   */
  forgotRedirectUrl: string;

  /**
   * Optional callback fired on successful login (before redirect)
   * Can be used for custom logic like analytics, state updates, etc.
   */
  onSuccess?: (response: any) => void;

  /**
   * Optional callback fired on login error
   * Can be used for custom error handling, logging, etc.
   */
  onError?: (error: any) => void;

  /**
   * Optional callback fired when "Forgot Password" link is clicked
   * Can be used for custom logic before redirect
   */
  onForgotPassword?: () => void;

  // Social Login Configuration
  /**
   * Enable Google OAuth login
   * When true, shows "Sign in with Google" button
   */
  hasGoogleLogin?: boolean;

  /**
   * Enable Apple OAuth login
   * When true, shows "Sign in with Apple" button
   */
  hasAppleLogin?: boolean;

  /**
   * Enable Discord OAuth login
   * When true, shows "Sign in with Discord" button
   */
  hasDiscordLogin?: boolean;

  /**
   * Enable Magic Link authentication
   * When true, shows "Sign in with Magic Link" option
   */
  hasMagicLinkLogin?: boolean;

  /**
   * Callback for Google login
   * Should handle Google OAuth flow
   */
  onGoogleLogin?: () => void;

  /**
   * Callback for Apple login
   * Should handle Apple OAuth flow
   */
  onAppleLogin?: () => void;

  /**
   * Callback for Discord login
   * Should handle Discord OAuth flow
   */
  onDiscordLogin?: () => void;

  /**
   * Callback for Magic Link login
   * Should handle magic link flow
   */
  onMagicLinkLogin?: (email: string) => void;
}
