import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import useAuthStore from "../store/useAuthStore";
import { toast } from "sonner";
import { loginUser } from "../calls/auth";
import useUserStore from "../store/useUserStore";
import { z } from "zod";
import { loginSchema } from "../../validations/register.validation";
import { Loader2 } from "lucide-react";
const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser, user } = useUserStore();
  const { setToken } = useAuthStore();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      loginSchema.parse(formData);
      setErrors({});

      const data = await loginUser(formData);
      console.log(data);
      if (data.success === false && data.error) {
        toast.error(data.error);
      }
      if (data.message && data.data) {
        setUser({ ...user, ...data.data });
        setToken(data.token);
        toast.success(data.message);
      console.log(data);
        setTimeout(() => {
          navigate(`/${data?.data?.userType||"/"}`);
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
     alert(error.message);
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
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Log in</CardTitle>
          <CardDescription>
            Enter your details to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit}
            className="space-y-4"
            encType="multipart/form-data"
          >
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter you email"
              />

              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
              />
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            {/* <Button
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
            </Button> */}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  {" "}
                  <Loader2 className="mr-0 h-4 w-4 animate-spin" /> Logging
                  in...{" "}
                </>
              ) : (
                "Log in"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <a href="/register" className="text-primary hover:underline">
              Register here
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginPage;
