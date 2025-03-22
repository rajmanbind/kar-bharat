
import React from 'react';
import { CheckCircle } from "lucide-react";

const OTPVerificationSuccess = () => {
  return (
    <div className="flex flex-col items-center justify-center py-6">
      <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
      <p className="text-center font-medium">Email Verified Successfully!</p>
    </div>
  );
};

export default OTPVerificationSuccess;
