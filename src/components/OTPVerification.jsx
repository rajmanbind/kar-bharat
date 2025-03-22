
import React, { useEffect } from 'react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Mail } from "lucide-react";
import useOTP from '../hooks/useOTP';
import OTPVerificationSuccess from './OTPVerificationSuccess';
import OTPVerificationForm from './OTPVerificationForm';

const OTPVerification = ({ isOpen, onClose, email, onVerified }) => {
  const {
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
  } = useOTP(email, onVerified);

  useEffect(() => {
    // Auto-send OTP when dialog opens
    if (isOpen && email) {
      sendOTP();
    }
  }, [isOpen, email]);

  const handleClose = () => {
    if (isVerified) {
      onVerified(true);
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
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
          <OTPVerificationSuccess />
        ) : (
          <OTPVerificationForm 
            otp={otp}
            setOtp={setOtp}
            error={error}
            isLoading={isLoading}
            verifyOTP={verifyOTP}
            resendDisabled={resendDisabled}
            countdown={countdown}
            sendOTP={sendOTP}
            isSending={isSending}
            onClose={handleClose}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default OTPVerification;
