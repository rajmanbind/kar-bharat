
import React, { useState, useEffect } from 'react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Loader2, Mail, CheckCircle, AlertCircle } from "lucide-react";

const OTPVerification = ({ isOpen, onClose, email, onVerified }) => {
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
        onClose();
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

  useEffect(() => {
    // Auto-send OTP when dialog opens
    if (isOpen && email) {
      sendOTP();
    }
  }, [isOpen, email]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Verify Your Email
          </DialogTitle>
          <DialogDescription>
            We've sent a 6-digit verification code to {email}
          </DialogDescription>
        </DialogHeader>
        
        {isVerified ? (
          <div className="flex flex-col items-center justify-center py-6">
            <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
            <p className="text-center font-medium">Email Verified Successfully!</p>
          </div>
        ) : (
          <>
            <div className="flex flex-col items-center space-y-4 py-2">
              <div className="flex flex-col space-y-2 text-center">
                <Label htmlFor="otp" className="text-center">
                  Enter the 6-digit code
                </Label>
                <InputOTP 
                  maxLength={6} 
                  value={otp} 
                  onChange={setOtp}
                  disabled={isLoading}
                  id="otp"
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
              
              {error && (
                <div className="flex items-center text-destructive gap-2">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              <p className="text-sm text-muted-foreground mt-2">
                Didn't receive the code?{" "}
                <Button 
                  variant="link" 
                  className="p-0 h-auto" 
                  onClick={sendOTP} 
                  disabled={resendDisabled || isSending}
                >
                  {resendDisabled 
                    ? `Resend in ${countdown}s` 
                    : isSending 
                      ? "Sending..." 
                      : "Resend Code"}
                </Button>
              </p>
            </div>

            <DialogFooter className="flex justify-center sm:justify-between mt-4">
              <Button
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
                className="sm:mr-auto"
              >
                Cancel
              </Button>
              <Button 
                onClick={verifyOTP} 
                disabled={otp.length !== 6 || isLoading}
                className="ml-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : "Verify Email"}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default OTPVerification;
