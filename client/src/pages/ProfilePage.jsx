import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Loader2,
  User,
  Phone,
  Mail,
  MapPin,
  Camera,
  Shield,
  Key,
  LocateFixed,
} from "lucide-react";
import useAuthStore from "../store/useAuthStore";
import useUserStore from "../store/useUserStore";

const ProfilePage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");
  const { user, setUser } = useUserStore();
  const navigate = useNavigate();
  // Personal Info
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [addressFromStorage, setAddressFromStorage] = useState(null);

  // If not logged in, redirect to login
  if (!user) {
    navigate("/login");
    return null;
  }

  const getInitials = (name, n) => {
    if (!name) return "U";
    if (n === "1")
      return name.charAt(0).toUpperCase();
    if (n ==="0")
      return name.charAt(0).toUpperCase() + name.slice(1);
  };

  const onPersonalSubmit = async (values) => {
    setIsLoading(true);

    try {
      // For demo purposes, just update directly
      // In a real implementation, this would call the API
      setTimeout(() => {
        const updatedUser = {
          ...user,
          name: values.name,
          email: values.email,
          phone: values.phone,
        };

        setUser(updatedUser);

        toast.success("Profile updated successfully", {
          description: "Your personal information has been updated.",
        });

        setIsLoading(false);
      }, 1000);
    } catch (error) {
      toast.error("Update failed", {
        description: error.message || "Something went wrong. Please try again.",
      });
      setIsLoading(false);
    }
  };
  useEffect(()=>{
    setAddressFromStorage(user.address)
  },[])

  return (
    <div className="container py-8 animate-fade-in">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {/* Profile sidebar */}
        <div className="md:col-span-1">
          <Card>
            <CardContent className="p-6 flex flex-col items-center">
              <div className="relative group">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src={user.profileImage} alt={user.name} />
                  <AvatarFallback className="bg-aqua-600 text-white text-xl">
                    {getInitials(user.name, "1")}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="icon"
                    variant="secondary"
                    className="h-8 w-8 rounded-full bg-black/50 hover:bg-black/70"
                  >
                    <Camera className="h-4 w-4" />
                    <span className="sr-only">Upload photo</span>
                  </Button>
                </div>
              </div>

              <h2 className="text-xl font-bold mt-2">
                {getInitials(user.name, "0")}
              </h2>
              <p className="text-sm text-muted-foreground capitalize mb-4">
                {user.userType}
              </p>

              <Separator className="my-4 w-full" />

              <div className="w-full space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{user.email}</span>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{user.phone}</span>
                </div>

                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  {/* <LocateFixed className="h-4 w-4 text-muted-foreground" /> */}
                  <span className="text-sm">{addressFromStorage?`${addressFromStorage.street} ${addressFromStorage.city}, ${addressFromStorage.state}, ${addressFromStorage.country}, ${addressFromStorage.zipCode} `:""}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profile edit tabs */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
              <CardDescription>
                Manage your account settings and preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Personal Info Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Personal Information</h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                      />
                    </div>
                    
                    <Button
                      // onClick={handlePersonalSubmit}
                      disabled={isLoading}
                      className="w-full sm:w-auto"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </Button>
                  </div>
                </div>

                {/* Address Section */}
                {/* <div className="space-y-4 pt-6 border-t">
          <h3 className="text-lg font-medium">Address</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="street">Street Address</Label>
              <Input
                id="street"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="state">State/Province</Label>
                <Input
                  id="state"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="zipCode">Postal/Zip Code</Label>
                <Input
                  id="zipCode"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                />
              </div>
            </div>
            <Button
              onClick={handleAddressSubmit}
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : "Save Address"}
            </Button>
          </div>
        </div> */}

                {/* Password Section */}
                {/* <div className="space-y-4 pt-6 border-t">
          <h3 className="text-lg font-medium">Password</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <Button
                onClick={handlePasswordSubmit}
                disabled={isLoading}
                className="w-full sm:w-auto"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : "Change Password"}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setCurrentPassword('');
                  setNewPassword('');
                  setConfirmPassword('');
                }}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div> */}
              </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Shield className="h-4 w-4" />
                Your data is protected and never shared with third parties.
              </div>
              <Button
                variant="link"
                className="text-xs text-muted-foreground h-auto p-0"
              >
                Delete Account
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
