
import React from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Loader2, AlertCircle } from "lucide-react";

const OTPVerificationForm = ({ 
  otp, 
  setOtp, 
  error, 
  isLoading, 
  verifyOTP, 
  resendDisabled,
  countdown,
  sendOTP,
  isSending,
  onClose 
}) => {
  return (
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

      <div className="flex justify-center sm:justify-between mt-4">
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
      </div>
    </>
  );
};

export default OTPVerificationForm;
