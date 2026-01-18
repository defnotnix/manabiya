/**
 * PageForgotPassword Component Props
 */
export interface PageForgotPasswordProps {
  /**
   * API endpoint to request password reset
   */
  resetApi?: string;

  /**
   * URL to redirect to after success (usually to login or check email page)
   */
  successRedirectUrl?: string;

  /**
   * Callback fired on success
   */
  onSuccess?: (response: any) => void;

  /**
   * Callback fired on error
   */
  onError?: (error: any) => void;

  /**
   * Callback to go back to sign in
   */
  onBack?: () => void;
}
