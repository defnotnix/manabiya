/**
 * PageOTP Component Props
 */
export interface PageOTPProps {
  /**
   * API endpoint for OTP verification
   */
  verifyApi?: string;

  /**
   * API endpoint for resending OTP
   */
  resendApi?: string;

  /**
   * Callback fired on successful verification
   */
  onSuccess?: (response: any) => void;

  /**
   * Callback fired on error
   */
  onError?: (error: any) => void;

  /**
   * Length of the OTP code (default: 6)
   */
  otpLength?: number;

  /**
   * Email or phone number to show where OTP was sent
   */
  sentTo?: string;

  /**
   * URL to redirect to after success
   */
  successRedirectUrl?: string;

  /**
   * Callback to go back (e.g. to sign in)
   */
  onBack?: () => void;
}
