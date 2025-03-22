
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Loader2, Mail } from "lucide-react";
import useAuthStore from '../store/useAuthStore';
import OTPVerification from '../components/OTPVerification';

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string(),
  phone: z.string().min(10, { message: "Please enter a valid phone number" }),
  type: z.enum(["customer", "worker", "broker"], { 
    required_error: "Please select a user type" 
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const RegisterPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showOtpDialog, setShowOtpDialog] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useAuthStore();
  
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      type: "customer",
    },
  });

  const handleVerifyEmail = () => {
    const email = form.getValues("email");
    if (!email) {
      form.setError("email", { 
        type: "manual", 
        message: "Please enter your email first" 
      });
      return;
    }
    if (!form.formState.dirtyFields.email || form.getFieldState("email").invalid) {
      form.trigger("email");
      if (form.getFieldState("email").invalid) return;
    }
    setShowOtpDialog(true);
  };

  const onOtpVerified = (verified) => {
    setIsEmailVerified(verified);
    if (verified) {
      toast.success("Email verified successfully", {
        description: "Your email has been verified. You can now complete registration."
      });
    }
  };

  const onSubmit = async (values) => {
    if (!isEmailVerified) {
      toast.error("Email verification required", {
        description: "Please verify your email before completing registration."
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // This is just a mock - in production this would call your API
      
      // In a real implementation, this would call the backend registration endpoint
      // const response = await fetch('/api/users', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     name: values.name,
      //     email: values.email,
      //     password: values.password,
      //     phone: values.phone,
      //     type: values.type,
      //     otpVerified: 'true', // Important: This tells the backend that OTP is verified
      //   }),
      // });
      
      // For demo purposes only
      setTimeout(() => {
        const mockUser = {
          id: `user-${Math.floor(Math.random() * 1000)}`,
          name: values.name,
          email: values.email,
          phone: values.phone,
          type: values.type,
          token: 'mock-jwt-token',
        };
        
        setUser(mockUser);
        
        toast.success("Registration successful! Welcome to WorkConnect!", {
          description: "You've successfully registered an account.",
        });
        
        // Redirect based on user type
        if (values.type === 'customer') {
          navigate('/customer');
        } else if (values.type === 'worker') {
          navigate('/worker');
        } else if (values.type === 'broker') {
          navigate('/broker');
        }
        
        setIsLoading(false);
      }, 1500);
    } catch (error) {
      toast.error("Registration failed", {
        description: error.message || "Something went wrong. Please try again."
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted p-4">
      <Card className="w-full max-w-md animate-fade-in">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
          <CardDescription>
            Enter your details to register with WorkConnect
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <div className="flex gap-2">
                      <FormControl>
                        <Input 
                          type="email" 
                          placeholder="john@example.com" 
                          {...field} 
                          className={isEmailVerified ? "pr-8 border-green-500" : ""}
                        />
                      </FormControl>
                      <Button 
                        type="button" 
                        variant={isEmailVerified ? "outline" : "secondary"}
                        className="flex-shrink-0"
                        onClick={handleVerifyEmail}
                        disabled={isEmailVerified}
                      >
                        {isEmailVerified ? (
                          <>Verified</>
                        ) : (
                          <>
                            <Mail className="mr-2 h-4 w-4" />
                            Verify
                          </>
                        )}
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input type="tel" placeholder="(123) 456-7890" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>I am a:</FormLabel>
                    <FormControl>
                      <RadioGroup 
                        onValueChange={field.onChange} 
                        defaultValue={field.value} 
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
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
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
                ) : "Create account"}
              </Button>
              
              {!isEmailVerified && (
                <p className="text-sm text-center text-amber-500">
                  Please verify your email before registration
                </p>
              )}
            </form>
          </Form>
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
      
      {/* OTP Verification Dialog */}
      <OTPVerification 
        isOpen={showOtpDialog}
        onClose={() => setShowOtpDialog(false)}
        email={form.getValues("email")}
        onVerified={onOtpVerified}
      />
    </div>
  );
};

export default RegisterPage;
