
import { useState, useEffect } from 'react';
import { toast } from "sonner";
import { emailSchema, verifyOTPSchema } from '../../validations/register.validation';
import { sendOtp,verifyOtp } from '../calls/auth';

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
    // if (!email) {
    //   toast.error("Please enter your email first");
    //   return;
    // }
    setIsSending(true);
    setError("");
    
    try {
      if(!email){
        toast.error("Email must provide")
      }
    
          const data = await sendOtp({ email });
          console.log("Send OTP",data)
    toast.success(data.message)
          // setShowOtpDialog(true);
          // setError((prev) => ({ ...prev, email: "" }));
          console.log("Email", email);
      
      // toast.success("OTP sent to your email", {
      //   description: "Please check your inbox and enter the 6-digit code"
      // });
      
      // Start countdown for resend button
      setResendDisabled(true);
      setCountdown(30);
    } catch (error) {
      toast.error(error.message);
      console.log(error.message);
    } finally {
      setIsSending(false);
    }


    // try {
    //       verifyOTPSchema.parse({ email: email,otp:"" });
    
    //       const data = await sendOTP({ email: email });
    //       console.log("Send OTP",data)
    // toast.success(data.message)
    //       setShowOtpDialog(true);
    //       setError((prev) => ({ ...prev, email: "" }));
    //       console.log("Email", email);
    //     } catch (error) {
    //       if (error instanceof z.ZodError) {
    //         setError((prev) => ({
    //           ...prev,
    //           email: error.errors[0].message,
    //         }));
    //       }
        
    //   } finally {
    //     setIsSending(false);
    //   }
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
      // await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsVerified(true);
      toast.success("Email verified successfully");
      
      // Wait a moment to show the success state before closing
      setTimeout(() => {
        onVerified(true);
      }, 1500);
    // } catch (error) {
    //   setError("Invalid OTP. Please try again.");
    //   toast.error("Verification failed", {
    //     description: error.message || "Invalid code or it has expired"
    //   });
    // } finally {
    //   setIsLoading(false);
    // }

          // const data = await verifyOtp({ email,otp});
          const data = await verifyOTP({ email,otp});
          console.log("Send OTP",data)
    toast.success(data.message)
          setShowOtpDialog(false);
          // setError((prev) => ({ ...prev, email: "" }));
          // console.log("Email", email);
        } catch (error) {
          if (error instanceof z.ZodError) {
            setError((prev) => ({
              ...prev,
              email: error.errors[0].message,
            }));}
  };
  }
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
