import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2, Mail, Upload } from "lucide-react";
import useAuthStore from "../store/useAuthStore.js";
import {
  registerSchema,
  emailSchema,
} from "../../validations/register.validation";
import { registerUser, sendOtp } from "../calls/auth.js";
import OTPVerifications from "../components/OtpVerifications.jsx";
import useUserStore from "../store/useUserStore.js";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    cnf_password: "",
    userType: "customer",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showOtpDialog, setShowOtpDialog] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [emailVerificationLoader, setEmailVerificationLoader] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const { setUser } = useUserStore();
  const { setToken } = useAuthStore();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRadioChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      userType: value,
    }));
  };

  const validateForm = () => {
    try {
      registerSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors = {};
        error.errors.forEach((err) => {
          console.log(err);
          newErrors[err.path[0]] = err.message;
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleVerifyEmail = async () => {
    try {
      setEmailVerificationLoader(true)
      emailSchema.parse({ email: formData.email });

      const data = await sendOtp({ email: formData.email });
      console.log("Send OTP", data);
      toast.success(`${data.message}${data.otp}`);
     alert(`${data.message}${data.otp}`);
      setShowOtpDialog(true);
      setErrors((prev) => ({ ...prev, email: "" }));
      // console.log("Email", formData.email);
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors((prev) => ({
          ...prev,
          email: error.errors[0].message,
        }));
      }
    }
    finally{
      setEmailVerificationLoader(false)
    }
  };

  const onOtpVerified = async (verified) => {
    setIsEmailVerified(verified);
    setShowOtpDialog(!verified);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    // if (!validateForm()) return;

    if (!isEmailVerified) {
      toast.error("Email verification required");
      return;
    }

    try {
      registerSchema.parse(formData);
      setErrors({});

      const data = await registerUser(formData);
      console.log("response data", data.data);
      console.log("Token data", data.token);
      // toast.success(data.message);
      // Simulate API response
      console.log(data);
      if (data.success === false && data.error) {
        toast.error(data.error);
      }
      if (data.message && data.data) {
        setUser(data.data);
        setToken(data.token);
        toast.success(data.message);
        setTimeout(() => {
          setIsLoading(false);
          navigate(`/complete-profile?role=${formData.userType}?`);
        }, 1500);
      }
      if (data.message && data.errors) {
        const newErrors = {};
        data.errors.forEach((err) => {
          newErrors[err.field] = err.message;
        });
        console.log(newErrors);
        setErrors(newErrors);
      }
    } catch (error) {
      console.log(error);
      if (error instanceof z.ZodError) {
        const newErrors = {};
        error.errors.forEach((err) => {
          newErrors[err.path[0]] = err.message;
        });
        setErrors(newErrors);
      }
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 1500);
    }
  };
  console.log({ isLoading, isEmailVerified });
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted p-4">
      <Card className="w-full max-w-md animate-fade-in">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">
            Create an account
          </CardTitle>
          {/* <CardDescription>Enter your details to register</CardDescription> */}
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit}
            className="space-y-4"
            encType="multipart/form-data"
          >
            <div className="space-y-1">
              <Label>Register as :</Label>
              <RadioGroup
                value={formData.userType}
                onValueChange={handleRadioChange}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="customer" id="customer" />
                  <Label htmlFor="customer">Customer</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="worker" id="worker" />
                  <Label htmlFor="worker">Worker</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="broker" id="broker" />
                  <Label htmlFor="broker">Broker</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-1">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <div className="flex gap-2">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={isEmailVerified ? "border-green-500" : ""}
                />
                <Button
                  type="button"
                  variant={isEmailVerified ? "outline" : "secondary"}
                  onClick={handleVerifyEmail}
                  disabled={isEmailVerified}
                  className={isEmailVerified ? "border-green-500" : ""}
                >
                  {isEmailVerified ? "Verified" : emailVerificationLoader?<> <Loader2 className="mr-0 h-4 w-4 animate-spin" />Verify</>:"Verify"}
                </Button>
              </div>
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            {/* <div className="space-y-1">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
              />
              {errors.phone && (
                <p className="text-sm text-red-500">{errors.phone}</p>
              )}
            </div> */}

            {/* <div className="grid grid-cols-2 gap-4"> */}
            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="cnf_password">Confirm Password</Label>
              <Input
                id="cnf_password"
                name="cnf_password"
                type="password"
                value={formData.cnf_password}
                onChange={handleChange}
              />
              {errors.cnf_password && (
                <p className="text-sm text-red-500">{errors.cnf_password}</p>
              )}
            </div>
            {/* </div> */}

            {/* <div className="space-y-1">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
              />
              {errors.address && (
                <p className="text-sm text-red-500">{errors.address}</p>
              )}
            </div> */}
            {/* 
            <div className="space-y-1">
              <Label>Profile Image</Label>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current.click()}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  {profileImage ? profileImage.name : "Upload Image"}
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>
              {errors.profileImage && (
                <p className="text-sm text-red-500">{errors.profileImage}</p>
              )}
            </div> */}

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || !isEmailVerified}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create account"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline">
              Log in
            </Link>
          </p>
        </CardFooter>
      </Card>

      {/* <OTPVerification
        isOpen={showOtpDialog}
        onClose={() => setShowOtpDialog(false)}
        email={formData.email}
        onVerified={onOtpVerified}
      /> */}
      {showOtpDialog && (
        <OTPVerifications
          email={formData.email}
          onVerify={onOtpVerified}
          onClose={() => setShowOtpDialog(false)}
          reSend = {handleVerifyEmail}
        />
      )}
    </div>
  );
};

export default RegisterPage;
