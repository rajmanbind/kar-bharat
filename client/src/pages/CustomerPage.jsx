
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
import { Calendar, Clock, MapPin } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

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
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsContent value="search">
          <WorkerSearch />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CustomerPage;
