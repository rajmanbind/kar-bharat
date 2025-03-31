import React, { useState, useRef, useEffect } from "react";
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
import { Loader2, Mail, Upload } from "lucide-react";
import { registerSchemaTwo } from "../../validations/register.validation";
import { registerUserTwo } from "../calls/auth.js";
import useUserStore from "../store/useUserStore.js";
import useAuthStore from "../store/useAuthStore.js";
import { getskillList } from "../calls/user.js";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    phone: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    },
    skills: [],
    brokerId: "",
  });
  const [profileImage, setProfileImage] = useState(null);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const { user, setUser } = useUserStore();
  const { token } = useAuthStore();
  const [skillList, setSkillList] = useState(null);
  const [selectedSkills, setSelectedSkills] = useState(null);

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData((prev) => ({
  //     ...prev,
  //     [name]: value,
  //   }));
  // };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Handle nested address fields
    if (name.startsWith("address.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [field]: value,
        },
      }));
    } else {
      // Handle regular fields
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({
          ...prev,
          profileImage: "Please upload an image file",
        }));
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          profileImage: "File size must be less than 5MB",
        }));
        return;
      }
      console.log(file);
      setProfileImage(file);
      setErrors((prev) => ({ ...prev, profileImage: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      console.log(formData);
      // Validate form data first
      registerSchemaTwo.parse(formData);
      setErrors({});

      // Create new FormData instance
      const formDataToSend = new FormData();

      // Append all form fields
      formDataToSend.append("phone", formData.phone);
      formDataToSend.append("address", JSON.stringify(formData.address));

      if (formData.skills.length > 0) {
        formDataToSend.append("skills", JSON.stringify(formData.skills));
      }

      if (formData.brokerId) {
        formDataToSend.append("brokerId", formData.brokerId);
      }

      // Append the file if it exists
      //   if (!profileImage) {
      //     throw new Error("Profile image is required");
      //   }
      formDataToSend.append("profileImage", profileImage);

      // For debugging - log FormData contents
      // for (let [key, value] of formDataToSend.entries()) {
      //   console.log(key, value);
      // }

      const data = await registerUserTwo(formDataToSend, token);
      console.log(data);
      if (data.success === false && data.error) {
        toast.error(data.error);
      }
      if (data.message && data.data) {
        setUser({ ...user, ...data.data });
        toast.success(data.message);
        setTimeout(() => {
          navigate(`/${user.userType}`);
        }, 1500);
      }
      if (data.message && data.errors) {
        const newErrors = {};
        data.errors.forEach((err) => {
          newErrors[err.field] = err.message;
          // const path = err.field // Join path segments with dots

          // Handle array index errors (e.g., "skills.0")
          // if (path.startsWith('skills.')) {
          //   const index = path.split('.')[1]; // Get the array index
          //   newErrors.skills = newErrors.skills || {};
          //   newErrors.skills[index] = err.message;
          // }
          // // Handle general array validation (e.g., "skills")
          // else if (path === 'skills') {
          //   newErrors.skills = newErrors.skills || { _error: err.message };
          // }
          // // Handle nested address errors
          // else if (path.startsWith('address.')) {
          //   const field = path.split('.')[1];
          //   newErrors.address = newErrors.address || {};
          //   newErrors.address[field] = err.message;
          // }
          // // Handle regular fields
          // else {
          //   newErrors[path] = err.message;
          // }
        });
        console.log(newErrors);

        setErrors(newErrors);
      }
    } catch (error) {
      console.log(error);
      if (error instanceof z.ZodError) {
        const newErrors = {};
        error.errors.forEach((err) => {
          console.log(err);
          // newErrors[err.path[0]] = err.message;
          const path = err?.path[0];
          // Handle nested address errors from Zod
          if (path === "address") {
            const addressField = err.path[1];
            newErrors.address = newErrors.address || {};
            newErrors.address[addressField] = err.message;
          } else {
            newErrors[path] = err.message;
          }
        });
        setErrors(newErrors);
      }
    } finally {
      setTimeout(() => {
        // toast.error(error.message);
        setIsLoading(false);
      }, 1500);
    }
  };
  useEffect(() => {
    // More robust check for user authentication
    if (!user || !token) {
      console.log("Redirecting - Missing user or token:", { user, token });
      navigate("/login", { replace: true }); // Added replace to prevent back navigation
    }
  }, [user, token, navigate]); //

  const getWorkerList = async () => {
    try {
      const data = await getskillList(token);
      // console.log(data);
      if (data.success === false && data.error) {
        toast.error(data.error);
      }
      if (data.message && data.data) {
        setSkillList(data.data);
        // toast.success(data.message);
        console.log(data.message);
      }
    } catch (error) {
      console.log("something went wrong: ", error);
    }
  };
  useEffect(() => {
    // console.log(formData.userType, user);
    getWorkerList();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted p-4">
      <Card className="w-full max-w-md animate-fade-in">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Complete profile</CardTitle>
          {/* <CardDescription>Enter your details to register</CardDescription> */}
        </CardHeader>

        <CardContent>
          <form
            onSubmit={handleSubmit}
            className="space-y-4"
            encType="multipart/form-data"
          >
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

            <div className="space-y-1 flex items-center justify-center flex-col">
              {/* <Label>Profile Image</Label> */}
              <div className="flex items-center gap-4">
                {/* Clickable circle preview that opens file dialog */}
                <div
                  className="relative h-16 w-16 rounded-full border-2 border-gray-200 cursor-pointer hover:border-gray-300 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {profileImage ? (
                    <img
                      src={
                        typeof profileImage === "string"
                          ? profileImage
                          : URL.createObjectURL(profileImage)
                      }
                      alt="Profile preview"
                      className="h-full w-full rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full rounded-full bg-gray-100 flex items-center justify-center flex-col text-gray-400">
                      <Upload className="h-4 w-4 " />
                      Upload
                    </div>
                  )}
                </div>

                {/* Hidden file input */}
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
            </div>
            <div className="space-y-1">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91"
              />
              {errors.phone && (
                <p className="text-sm text-red-500">{errors.phone}</p>
              )}
            </div>
            {/* {user.userType === "worker" && (
              <>
                <div className="space-y-1">
                  <Label htmlFor="skills">Skills (comma separated)</Label>
                  <Input
                    id="skills"
                    value={formData.skills.join(", ")}
                    onChange={(e) => {
                      const skills = e.target.value
                        .split(",")
                        .map((s) => s.trim());
                      setFormData((prev) => ({ ...prev, skills }));
                    }}
                    placeholder="Enter skills"
                  />
                  {errors.skills && (
                    <p className="text-sm text-red-500">{errors.skills}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="brokerId">Broker ID</Label>
                  <Input
                    id="brokerId"
                    name="brokerId"
                    value={formData.brokerId}
                    onChange={handleChange}
                    placeholder="Enter broker Id"
                  />
                  {errors.brokerId && (
                    <p className="text-sm text-red-500">{errors.brokerId}</p>
                  )}
                </div>
              </>
            )} */}

            {/* <div className="space-y-1">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="address"
              />
              {errors.address && (
                <p className="text-sm text-red-500">{errors.address}</p>
              )}
            </div> */}

            {/* {user.userType === "worker" && (
              <div className="space-y-1">
                <Label htmlFor="skills">Select Skills</Label>
                <select
                  id="skills"
                  multiple
                  className="w-full p-2 border rounded-md"
                  value={formData.skills}
                  onChange={(e) => {
                    const selectedOptions = Array.from(
                      e.target.selectedOptions
                    ).map((option) => option.value);
                    setFormData((prev) => ({
                      ...prev,
                      skills: selectedOptions,
                    }));
                  }}
                >
                  {skillList&&skillList.map((skill) => (
                    <option key={skill._id} value={skill.name}>
                      {skill.name}
                    </option>
                  ))}
                </select>
                {errors.skills && (
                  <p className="text-sm text-red-500">{errors.skills}</p>
                )}
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Hold Ctrl (Windows/Linux) or Command (Mac) to select
                    multiple skills
                  </p>
                  {formData.skills.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm font-medium">Selected Skills:</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {formData.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 text-sm bg-gray-100 text-black rounded-md"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )} */}
            {user.userType === "worker" && (
              <div className="space-y-1">
                <Label htmlFor="skills">Select Skills</Label>
                <select
                  id="skills"
                  className="w-full p-2 border rounded-md"
                  value="" // Keep this empty to reset after selection
                  onChange={(e) => {
                    const selectedSkill = e.target.value;
                    if (
                      selectedSkill &&
                      !formData.skills.includes(selectedSkill)
                    ) {
                      setFormData((prev) => ({
                        ...prev,
                        skills: [...prev.skills, selectedSkill],
                      }));
                    }
                    e.target.value = ""; // Reset the select after choosing
                  }}
                >
                  <option value="">Select a skill to add</option>
                  {skillList &&
                    skillList.map((skill) => (
                      <option
                        key={skill._id}
                        value={skill.name}
                        disabled={formData.skills.includes(skill.name)} // Disable already selected
                      >
                        {skill.name}
                      </option>
                    ))}
                </select>
                {errors.skills && (
                  <p className="text-sm text-red-500">{errors.skills}</p>
                )}
                {/* Show general skills array error */}
                {errors.skills?._error && (
                  <p className="text-sm text-red-500">{errors.skills._error}</p>
                )}

                {/* Show specific skill errors */}
                {errors.skills &&
                  Object.entries(errors.skills).map(([key, value]) => {
                    if (key !== "_error") {
                      return (
                        <p key={key} className="text-sm text-red-500">
                          Skill #{parseInt(key) + 1}: {value}
                        </p>
                      );
                    }
                    return null;
                  })}
                <div className="mt-2">
                  {formData.skills.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm font-medium">Selected Skills:</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {formData.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 text-sm bg-gray-100 text-black rounded-md flex items-center"
                          >
                            {skill}
                            <button
                              type="button"
                              onClick={() => {
                                setFormData((prev) => ({
                                  ...prev,
                                  skills: prev.skills.filter(
                                    (s) => s !== skill
                                  ),
                                }));
                              }}
                              className="ml-1 text-gray-500 hover:text-red-500"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
            {/* {skillList.map(d=><>{d.name}</>)}
            {formData.userType === "worker" && (
              <>
            
                <div className="space-y-1">
                  <Label htmlFor="skills">Skills (comma separated)</Label>
                  <Input
                    id="skills"
                    value={formData.skills.join(", ")}
                    onChange={(e) => {
                      const skills = e.target.value
                        .split(",")
                        .map((s) => s.trim());
                      setFormData((prev) => ({ ...prev, skills }));
                    }}
                  />
                  {errors.skills && (
                    <p className="text-sm text-red-500">{errors.skills}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="brokerId">Broker ID</Label>
                  <Input
                    id="brokerId"
                    name="brokerId"
                    value={formData.brokerId}
                    onChange={handleChange}
                  />
                  {errors.brokerId && (
                    <p className="text-sm text-red-500">{errors.brokerId}</p>
                  )}
                </div>
              </>
            )} */}
            <div className="space-y-4">
              <Label>Address Details</Label>

              {/* Street Address */}
              <div className="space-y-1">
                <Label htmlFor="street">Street Address</Label>
                <Input
                  id="street"
                  name="address.street"
                  value={formData.address.street || ""}
                  onChange={handleChange}
                  placeholder="123 Main St"
                />
                {errors.address?.street && (
                  <p className="text-sm text-red-500">
                    {errors.address.street}
                  </p>
                )}
              </div>

              {/* City and State */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    name="address.city"
                    value={formData.address.city || ""}
                    onChange={handleChange}
                    placeholder="City"
                  />
                  {errors.address?.city && (
                    <p className="text-sm text-red-500">
                      {errors.address.city}
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="state">State/Province</Label>
                  <Input
                    id="state"
                    name="address.state"
                    value={formData.address.state || ""}
                    onChange={handleChange}
                    placeholder="State"
                  />
                  {errors.address?.state && (
                    <p className="text-sm text-red-500">
                      {errors.address.state}
                    </p>
                  )}
                </div>
              </div>

              {/* Zip Code and Country */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="zipCode">Zip/Postal Code</Label>
                  <Input
                    id="zipCode"
                    name="address.zipCode"
                    value={formData.address.zipCode || ""}
                    onChange={handleChange}
                    placeholder="Zip Code"
                  />
                  {errors.address?.zipCode && (
                    <p className="text-sm text-red-500">
                      {errors.address.zipCode}
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    name="address.country"
                    value={formData.address.country || ""}
                    onChange={handleChange}
                    placeholder="Country"
                  />
                  {errors.address?.country && (
                    <p className="text-sm text-red-500">
                      {errors.address.country}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  proccessing...
                </>
              ) : (
                "Complete profile"
              )}
            </Button>
          </form>
        </CardContent>
        {/* <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline">
              Log in
            </Link>
          </p>
        </CardFooter> */}
      </Card>

      {/* <OTPVerification
        isOpen={showOtpDialog}
        onClose={() => setShowOtpDialog(false)}
        email={formData.email}
        onVerified={onOtpVerified}
      /> */}
    </div>
  );
};

export default RegisterPage;
