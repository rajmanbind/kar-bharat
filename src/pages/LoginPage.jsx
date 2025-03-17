
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/hooks/use-toast";
import useAuthStore from '../store/useAuthStore';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('customer');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Mock authentication - in a real app, this would call your API
      setTimeout(() => {
        // Create mock user based on type
        const user = {
          id: `user-${Math.floor(Math.random() * 1000)}`,
          email,
          name: email.split('@')[0],
          type: userType
        };
        
        // Set user in auth store
        setUser(user);
        
        // Show success message
        toast({
          title: "Login successful",
          description: `Welcome back, ${user.name}!`,
        });
        
        // Redirect based on user type
        if (userType === 'customer') {
          navigate('/customer');
        } else if (userType === 'worker') {
          navigate('/worker');
        } else if (userType === 'broker') {
          navigate('/broker');
        }
        
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      toast({
        title: "Login failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
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
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>I am a:</Label>
              <RadioGroup 
                value={userType} 
                onValueChange={setUserType}
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
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Log in"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Don't have an account? Register feature coming soon!
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginPage;
