import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import useAuthStore from '../store/useAuthStore';
import WorkerSearch from '../components/WorkerSearch';

const serviceTypes = [
  { id: 'painting', name: 'Painting' },
  { id: 'carpentry', name: 'Carpentry' },
  { id: 'plumbing', name: 'Plumbing' },
  { id: 'electrical', name: 'Electrical Work' },
  { id: 'cleaning', name: 'Cleaning' },
  { id: 'gardening', name: 'Gardening & Landscaping' },
  { id: 'furniture', name: 'Furniture Assembly/Repair' },
  { id: 'moving', name: 'Moving & Heavy Lifting' },
];

const CustomerPage = () => {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState("search");
  const [orderType, setOrderType] = useState('direct');
  const [serviceType, setServiceType] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orders, setOrders] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const newOrder = {
      id: `order-${Math.floor(Math.random() * 10000)}`,
      customerId: user?.id,
      customerName: user?.name,
      serviceType,
      description,
      location,
      date,
      orderType,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    
    setTimeout(() => {
      setOrders([newOrder, ...orders]);
      
      setServiceType('');
      setDescription('');
      setLocation('');
      setDate('');
      
      toast({
        title: "Order placed successfully",
        description: `Your order for ${serviceTypes.find(s => s.id === serviceType)?.name} service has been placed.`,
      });
      
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Welcome, {user?.name || 'Customer'}</h1>
        <p className="text-muted-foreground mt-2">Find workers or place an order for service</p>
      </div>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="search">Find Workers</TabsTrigger>
          <TabsTrigger value="order">Place an Order</TabsTrigger>
        </TabsList>
        
        <TabsContent value="search">
          <WorkerSearch />
        </TabsContent>
        
        <TabsContent value="order">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Place a New Order</CardTitle>
                <CardDescription>Fill out the form to request a service</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Order Type</Label>
                    <RadioGroup 
                      value={orderType} 
                      onValueChange={setOrderType}
                      className="flex space-x-6"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="direct" id="direct" />
                        <Label htmlFor="direct">Direct to Worker</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="broker" id="broker" />
                        <Label htmlFor="broker">Through Broker</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="service-type">Service Type</Label>
                    <Select
                      value={serviceType}
                      onValueChange={setServiceType}
                      required
                    >
                      <SelectTrigger id="service-type">
                        <SelectValue placeholder="Select service type" />
                      </SelectTrigger>
                      <SelectContent>
                        {serviceTypes.map((service) => (
                          <SelectItem key={service.id} value={service.id}>
                            {service.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe what you need done"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={4}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      placeholder="Your address"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="date">Preferred Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      required
                    />
                  </div>
                  
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Place Order"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>My Orders</CardTitle>
                  <CardDescription>Track your service requests</CardDescription>
                </CardHeader>
                <CardContent>
                  {orders.length === 0 ? (
                    <p className="text-center py-4 text-muted-foreground">No orders yet</p>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div key={order.id} className="border rounded-lg p-4">
                          <
