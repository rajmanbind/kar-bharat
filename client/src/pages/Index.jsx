
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Hammer, Users, User } from "lucide-react";
import useUserStore from "../store/useUserStore";
import useAuthStore from "../store/useAuthStore";

const Index = () => {
  const { user } = useUserStore();
  const { token } = useAuthStore();
  // Redirect to appropriate dashboard if logged in
  const getDashboardLink = (user,token) => {
    if (!user||!token) return "/login";
    switch (user.userType) {
      case "customer":
        return "/customer";
      case "worker":
        return "/worker";
      case "broker":
        return "/broker";
      default:
        return "/login";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* <header className="container mx-auto py-6 px-4 flex justify-between items-center"> */}
        {/* <div className="flex items-center"> */}
          {/* <Hammer className="h-6 w-6 mr-2 text-primary" /> */}
          {/* <span className="font-bold text-xl text-black">WorkConnect</span> */}
        {/* </div> */}
        {/* <Link to={user ? getDashboardLink() : "/login"}>
          <Button variant="outline">
            {user ? "Dashboard" : "Log In"}
          </Button>
        </Link> */}
      {/* </header> */}

      <main className="container mx-auto px-4 py-16 md:py-24 text-gray-600">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Connect with Skilled Workers for Your Projects
          </h1>
          <p className="text-xl text-gray-600 mb-10">
            Find the right professionals for your home improvement, repair, and maintenance needs.
          </p>
          <Link to={user && token ? getDashboardLink(user,token) : "/login"} className="hover:bg-gray-500 rounded-full py-2">
            <Button size="lg" className="mb-16">
              {user ? "Go to Dashboard" : "Get Started"} 
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button> 
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="p-3 rounded-full bg-blue-100 mb-4">
                  <User className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">For Customers</h3>
                <p className="text-gray-600 mb-4">
                  Find skilled professionals for your home improvement projects. Post your requirements and get connected with reliable workers.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="p-3 rounded-full bg-amber-100 mb-4">
                  <Hammer className="h-8 w-8 text-amber-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">For Workers</h3>
                <p className="text-gray-600 mb-4">
                  Showcase your skills and find jobs in your area. Get connected with customers or work with brokers for a steady stream of work.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="p-3 rounded-full bg-green-100 mb-4">
                  <Users className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">For Brokers</h3>
                <p className="text-gray-600 mb-4">
                  Manage a team of skilled workers and connect them with customers. Handle projects efficiently and grow your business.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="container mx-auto py-8 px-4 mt-20 border-t border-gray-200">
        <div className="text-center text-gray-500 text-sm">
          <p>© 2023 WorkConnect. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
