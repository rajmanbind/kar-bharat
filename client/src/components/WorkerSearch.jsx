import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
// import {
//   Card, CardContent, CardFooter, CardHeader, CardTitle,
//   Button, Input, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
//   Badge, Slider
// } from "@/components/ui";
import { useDebounce } from "use-debounce";
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
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// import { Separator } from "@/components/ui/separator";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Star,
  Phone,
  MapPin,
  User,
  Search,
  DollarSign,
  GraduationCap,
  Briefcase,
  Filter,
  X,
  Loader2,
  // Badge,
} from "lucide-react";

import { toast } from "@/hooks/use-toast";
import { useIsMobile } from "../hooks/use-mobile";
import { getskillList, searchWorker } from "../calls/user";
import useAuthStore from "../store/useAuthStore";
import { SearchInput } from "./ui/search-input";

// const skillOptions = [
//   "Carpentry",
//   "Plumbing",
//   "Electrical",
//   "Painting",
//   "Cleaning",
//   "Gardening",
//   "Furniture Assembly",
// ];

const WorkerSearch = () => {
  // Search filters
  const [searchQuery, setSearchQuery] = useState("");
  const [skills, setSkills] = useState("");
  const [location, setLocation] = useState("");
  const [rating, setRating] = useState("");
  const { token } = useAuthStore();
  // UI states
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [bookingDetails, setBookingDetails] = useState({
    task: "",
    description: "",
    address: "",
  });
  const isMobile = useIsMobile();
  // console.log(isMobile);
  // Search workers
  const [laoding, setLoading] = useState(false);
  // Debounce search inputs (500ms delay)
  const [debouncedSearch] = useDebounce(searchQuery, 500);
  const [debouncedSkills] = useDebounce(skills, 500);
  const [debouncedLocation] = useDebounce(location, 500);
  const [debouncedRating] = useDebounce(rating, 500);
  const [skillList, setSkillList] = useState([]);
  const getWorker = async () => {
    try {
      const data = await searchWorker(token);
      console.log(data);
      return data.data;
    } catch (error) {
      throw error;
    }
  };

  const {
    data: workers = [],
    refetch,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: [
      "workers",
      debouncedSearch,
      debouncedSkills,
      debouncedLocation,
      debouncedRating,
    ],
    queryFn: async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (searchQuery) params.append("query", debouncedSearch);
        if (skills) params.append("skills", debouncedSkills);
        if (location) params.append("location", debouncedLocation);
        if (rating) params.append("rating", debouncedRating);

        const data = await searchWorker(token, params);
        console.log(data);
        return data.data;
      } catch (error) {
        toast({
          title: "Search Failed",
          description: error.message,
          variant: "destructive",
        });
        return [];
      } finally {
        setLoading(false);
      }
    },
    // enabled: false,
    keepPreviousData: true,
  });

  const handleSearch = (e) => {
    e.preventDefault();
    refetch();
  };

  const handleBookWorker = async () => {
    try {
      if (!bookingDetails.task) {
        toast({
          title: "Missing Details",
          description: "Please describe your task",
          variant: "destructive",
        });
        return;
      }

      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workerId: selectedWorker.id,
          ...bookingDetails,
        }),
      });

      if (!res.ok) throw new Error("Booking failed");

      toast({
        title: "Booked!",
        description: `${selectedWorker.name} will contact you soon`,
      });

      // Reset
      setSelectedWorker(null);
      setBookingDetails({
        task: "",
        description: "",
        address: "",
      });
    } catch (error) {
      toast({
        title: "Booking Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };
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
    <div className="sm:p-4 max-w-3xl mx-auto">
      {laoding && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
          <div className="p-6 rounded-lg shadow-lg flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="mt-2 text-sm">Finding workers...</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSearch} className="mb-6 space-y-4">
        {/* Search row - input + button */}

        <div className="flex">
          <div className="relative flex flex-1 items-center">
            <SearchInput
              placeholder="What service do you need?"
              className={cn(
                "flex-1 border-r-md rounded-r-md",
                "sm:border-r sm:rounded"
              )}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <Button
              type="submit"
              disabled={isLoading}
              className={cn(
                "absolute right-0 h-full rounded-l-none rounded-r-md border-l", // Add left border
                "sm:relative sm:border-l-0 sm:rounded-l-none sm:rounded-r" // Remove left border on larger screens
              )}
            >
              <span className="sr-only">Search</span>
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Search className="block sm:hidden h-4 w-4" />
                  <span className="hidden sm:block">Search</span>
                </>
              )}
            </Button>
          </div>
        </div>
        {/* Filter toggle button - centered below search */}
        <div className="flex justify-center">
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground"
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? (
              <>
                <X size={16} className="mr-0 sm:mr-2" />
                <span className="hidden sm:inline">Hide filters</span>
              </>
            ) : (
              <>
                <Filter size={16} className="mr-0 sm:mr-2" />
                <span className="hidden sm:inline">Show filters</span>
              </>
            )}
          </Button>
        </div>

        {/* Filters section (unchanged) */}
        {showFilters && (
          <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
            <div>
              <Label>Skills Needed</Label>
              <Select value={skills} onValueChange={setSkills}>
                <SelectTrigger>
                  <SelectValue placeholder="Any skill" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={"all"}>All</SelectItem>
                  {skillList.length > 0 &&
                    skillList.map((skill) => (
                      <SelectItem key={skill._id} value={skill.name}>
                        {skill.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Location</Label>
              <Input
                placeholder="City or area"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <div>
              <Label>Minimum Rating</Label>
              <Select value={rating} onValueChange={setRating}>
                <SelectTrigger>
                  <SelectValue placeholder="Any rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="4">4+ Stars</SelectItem>
                  <SelectItem value="3">3+ Stars</SelectItem>
                  <SelectItem value="0">Any Rating</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </form>
      {workers.length === 0 && !isLoading && (
        <h2 className="font-semibold text-lg">
          {searchQuery || skills || location || rating
            ? "No workers match your filters"
            : "No workers found"}
        </h2>
      )}
      {/* Conditional rendering with loading state */}
      {workers.length > 0 && (
        <div className="space-y-4">
          <h2 className="font-semibold text-lg">Available Workers</h2>
          {workers.map((worker) => (
            <Card
              key={worker._id}
              className={`${
                selectedWorker?.id === worker.id
                  ? "border-secondary border"
                  : ""
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex justify-between mb-4">
                  <CardTitle className="text-lg flex items-center">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage
                        src={worker.profileImage}
                        alt={worker.name}
                      />
                      <AvatarFallback className="bg-aqua-600 text-white text-xl">
                        {worker.name}
                      </AvatarFallback>
                    </Avatar>
                    {worker.name}
                  </CardTitle>

                  <Badge variant={worker.brokerId ? "outline" : "secondary"}>
                    {worker.brokerId ? "Agency" : "Independent"}
                  </Badge>
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  <span>
                    {worker.rating} ({worker.reviews} reviews)
                  </span>
                </div>
              </CardHeader>

              <CardContent className="pb-3 space-y-2">
                {worker.skills && (
                  <div className="flex flex-wrap gap-1">
                    {worker.skills.map((skill) => (
                      <Badge
                        key={skill}
                        variant="secondary"
                        className="text-xs"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {worker.address
                      ? `${worker.address.street}, ${worker.address.city}, ${worker.address.state}, ${worker.address.country}, ${worker.address.zipCode}`
                      : ""}
                  </span>
                </div>

                {worker.rate && (
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="h-4 w-4 text-green-500" />
                    <span>${worker.rate}/hour</span>
                  </div>
                )}
              </CardContent>

              <CardFooter>
                <Button
                  onClick={() => setSelectedWorker(worker)}
                  className="w-full"
                  variant={
                    selectedWorker?._id === worker._id ? "default" : "outline"
                  }
                >
                  {selectedWorker?._id === worker._id ? "Selected" : "Select"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Booking Form */}
      {selectedWorker && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md animate-in fade-in zoom-in-95">
            <CardHeader>
              <CardTitle>Book {selectedWorker.name}</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <div>
                <Label>What do you need done?</Label>
                <Input
                  placeholder="e.g., Fix leaking pipe"
                  value={bookingDetails.task}
                  onChange={(e) =>
                    setBookingDetails({
                      ...bookingDetails,
                      task: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <Label>Details (optional)</Label>
                <Input
                  placeholder="Any special instructions?"
                  value={bookingDetails.description}
                  onChange={(e) =>
                    setBookingDetails({
                      ...bookingDetails,
                      description: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <Label>Where?</Label>
                <Input
                  placeholder="Your address"
                  value={bookingDetails.address}
                  onChange={(e) =>
                    setBookingDetails({
                      ...bookingDetails,
                      address: e.target.value,
                    })
                  }
                />
              </div>
            </CardContent>

            <CardFooter className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setSelectedWorker(null)}
              >
                Cancel
              </Button>
              <Button
                className="flex-1"
                onClick={handleBookWorker}
                disabled={!bookingDetails.task}
              >
                Confirm Booking
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
};

export default WorkerSearch;
