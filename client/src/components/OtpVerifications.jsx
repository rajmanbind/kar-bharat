// import { useState } from 'react';
// import { verifyOTPSchema } from '../../validations/register.validation';
// import { verifyOtp } from '../calls/auth';
// import { toast } from "sonner";
// const OTPVerifications = ({ email, onVerify, onClose }) => {
//   const [otp, setOtp] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (otp.length !== 6) {
//       setError('Enter 6-digit code');
//       return;
//     }

//     setLoading(true);
//     try {
//     verifyOTPSchema.parse({ email,otp });

//     const data = await verifyOtp({ email,otp });
//     console.log("verify OTP", data);
//     toast.success(data.message);
//       onVerify();
//       onClose();
//     } catch (err) {
//         console.log(err)
//       setError('Invalid code');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
//       <div className="bg-white rounded-lg p-6 w-full max-w-sm">
//         <h3 className="text-lg font-bold mb-2">Verify Email</h3>
//         <p className="mb-4">Code sent to {email}</p>

//         <form onSubmit={handleSubmit}>
//           <input
//             type="text"
//             value={otp}
//             onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
//             maxLength={6}
//             placeholder="Enter 6-digit code"
//             className="w-full p-2 border rounded mb-2 text-center text-xl"
//           />
//           {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

//           <div className="flex gap-2">
//             <button
//               type="button"
//               onClick={onClose}
//               className="flex-1 py-2 bg-gray-200 rounded"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               disabled={loading || otp.length !== 6}
//               className="flex-1 py-2 bg-blue-500 text-white rounded disabled:bg-blue-300"
//             >
//               {loading ? 'Verifying...' : 'Verify'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default OTPVerifications;

import { useState, useEffect, useRef } from "react";
import { verifyOTPSchema } from "../../validations/register.validation";
import { verifyOtp } from "../calls/auth";
import { toast } from "sonner";
import { z } from "zod";
import { Loader2 } from "lucide-react";
const OTPVerification = ({ email, onVerify, onClose ,reSend}) => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [countdown, setCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef([]);
  const [error, setError] = useState("");
  // Handle countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  // Focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index, value) => {
    if (/^\d*$/.test(value)) {
      // Only allow single digits
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Move focus to next input if available
      if (value && index < 3) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text/plain");
    const numbers = pasteData.replace(/\D/g, "").split("").slice(0, 4);

    if (numbers.length === 4) {
      setOtp(numbers);
      inputRefs.current[3]?.focus();
    }
  };

  const handleResend = () => {
    setCountdown(30);
    setCanResend(false);
    setOtp(["", "", "", ""]);
    inputRefs.current[0]?.focus();
    reSend()
  };

  const handleVerify = async () => {
    const fullOtp = otp.join("");
    if (fullOtp.length === 4) {
      setIsLoading(true);

      try {
        verifyOTPSchema.parse({ email, otp: fullOtp });
        const data = await verifyOtp({ email, otp: fullOtp });
        console.log("verify OTP", data);
        toast.success(data.message);
        if (data.verified)
          setTimeout(() => {
            onVerify(true);
          }, 1000);
      } catch (error) {
        console.log(error.message);
        if (error instanceof z.ZodError) {
          console.log(error);
          toast.error(error.message);
        } else toast.error(error.message);
      } finally {
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-300 rounded-lg p-6 w-full max-w-sm text-black relative">
        <button
          onClick={() => onClose()}
          className="px-4 py-2 text-gray-700 hover:font-bold rounded-full hover:bg-slate-200 hover:text-red-500 absolute top-0 right-0"
        >
          X
        </button>
        <h1 className="text-2xl font-bold mb-4">Verify Your Email</h1>
        <p className="mb-6">
          We've sent a 4-digit verification code to{" "}
          <span className="font-semibold">{email}</span>
        </p>

        <div className="border-t border-b border-gray-200 py-6 my-4">
          <h2 className="text-lg font-medium mb-4">Enter the 4-digit code</h2>
          <div className="flex justify-center gap-2 mb-6 text-white">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className="w-12 h-12 border border-gray-300 rounded text-center text-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ))}
          </div>
          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

          <p className="text-center text-sm text-gray-600">
            Didn't receive the code?{" "}
            {canResend ? (
              <button
                onClick={handleResend}
                className="text-blue-600 font-medium hover:underline"
              >
                Resend now
              </button>
            ) : (
              <span>Resend in {countdown}s</span>
            )}
          </p>
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={handleVerify}
            disabled={otp.some((d) => d === "") || isLoading}
            className="px-3 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 disabled:bg-blue-300 flex items-center"
          >
            {isLoading ?<><Loader2 className="mr-1 h-4 w-4 animate-spin" />Verifying...</> : "Verify Email"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;
