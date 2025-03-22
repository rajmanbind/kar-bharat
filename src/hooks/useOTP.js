
import { useState, useEffect } from 'react';
import { toast } from "sonner";

const useOTP = (email, onVerified) => {
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState("");
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else {
      setResendDisabled(false);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const sendOTP = async () => {
    if (!email) {
      toast.error("Please enter your email first");
      return;
    }

    setIsSending(true);
    setError("");
    
    try {
      // In a real app, this would be an actual API call
      // const response = await fetch('/api/users/send-otp', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email })
      // });
      
      // For demo purposes:
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("OTP sent to your email", {
        description: "Please check your inbox and enter the 6-digit code"
      });
      
      // Start countdown for resend button
      setResendDisabled(true);
      setCountdown(30);
    } catch (error) {
      toast.error("Failed to send OTP", {
        description: error.message || "Please try again later"
      });
    } finally {
      setIsSending(false);
    }
  };

  const verifyOTP = async () => {
    if (otp.length !== 6) {
      setError("Please enter all 6 digits");
      return;
    }

    setIsLoading(true);
    setError("");
    
    try {
      // In a real app, this would be an actual API call
      // const response = await fetch('/api/users/verify-otp', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, otp })
      // });
      
      // For demo purposes:
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsVerified(true);
      toast.success("Email verified successfully");
      
      // Wait a moment to show the success state before closing
      setTimeout(() => {
        onVerified(true);
      }, 1500);
    } catch (error) {
      setError("Invalid OTP. Please try again.");
      toast.error("Verification failed", {
        description: error.message || "Invalid code or it has expired"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    otp,
    setOtp,
    isLoading,
    isSending,
    isVerified,
    error,
    resendDisabled,
    countdown,
    sendOTP,
    verifyOTP
  };
};

export default useOTP;
