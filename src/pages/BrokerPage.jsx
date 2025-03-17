
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { PlusCircle, Calendar, MapPin, User, CheckCircle2 } from "lucide-react";
import useAuthStore from '../store/useAuthStore';

// Mock data for workers
const mockWorkers = [
  { id: "worker-1", name: "John Doe", specialties: ["carpentry", "furniture"], rating: 4.8, activeJobs: 1 },
  { id: "worker-2", name: "Jane Smith", specialties: ["painting", "cleaning"], rating: 4.6, activeJobs: 0 },
  { id: "worker-3", name: "Mike Johnson", specialties: ["plumbing", "electrical"], rating: 4.9, activeJobs: 2 },
  { id: "worker-4", name: "Sarah Williams", specialties: ["gardening", "cleaning"], rating: 4.7, activeJobs: 1 },
];

// Mock data for orders from customers
const mockOrders = [
  {
    id: 'order-1',
    customerName: 'Alice Johnson',
    serviceType: 'painting',
    location: '123 Main St, Anytown',
    date: '2023-07-20',
    description: 'Need the living room and kitchen painted. Approximately 500 sq ft.',
    status: 'pending',
    createdAt: '2023-07-10T14:30:00Z',
  },
  {
    id: 'order-2',
    customerName: 'Robert Brown',
    serviceType: 'carpentry',
    location: '456 Elm St, Somewhere',
    date: '2023-07-22',
    description: 'Fix squeaky hardwood floors in the bedroom and repair kitchen cabinet doors.',
    status: 'pending',
    createdAt: '2023-07-11T09:15:00Z',
  },
  {
    id: 'order-3',
    customerName: 'Carol Martinez',
    serviceType: 'plumbing',
    location: '789 Oak Dr, Elsewhere',
    date: '2023-07-18',
    description: 'Leaky faucet in master bathroom and clogged drain in kitchen sink.',
    status: 'pending',
    createdAt: '2023-07-12T16:45:00Z',
  },
];

// Mock data for assigned jobs
const mockAssignedJobs = [
  {
    id: 'job-1',
    orderId: 'order-4',
    customerName: 'David Wilson',
    serviceType: 'furniture',
    location: '321 Pine Ave, Anytown',
    date: '2023-07-15',
    description: 'Assemble new bedroom furniture set (bed frame, dresser, nightstands).',
    status: 'assigned',
    workerId: 'worker-1',
    workerName: 'John Doe',
    assignedAt: '2023-07-08T10:30:00Z',
  },
  {
    id: 'job-2',
    orderId: 'order-5',
    customerName: 'Emma Garcia',
    serviceType: 'electrical',
    location: '654 Cedar Ln, Somewhere',
    date: '2023-07-16',
    description: 'Install ceiling fans in three bedrooms and fix non-working outlets in kitchen.',
    status: 'assigned',
    workerId: 'worker-3',
    workerName: 'Mike Johnson',
    assignedAt: '2023-07-09T14:15:00Z',
  },
  {
    id: 'job-3',
    orderId: 'order-6',
    customerName: 'Frank Miller',
    serviceType: 'gardening',
    location: '987 Maple Rd, Elsewhere',
    date: '2023-07-17',
    description: 'Lawn mowing, hedge trimming, and general yard cleanup.',
    status: 'completed',
    workerId: 'worker-4',
    workerName: 'Sarah Williams',
    assignedAt: '2023-07-10T09:00:00Z',
    completedAt: '2023-07-17T16:30:00Z',
  },
];

const serviceTypesMap = {
  'painting': { name: 'Painting', color: 'bg-blue-100 text-blue-800' },
  'carpentry': { name: 'Carpentry', color: 'bg-amber-100 text-amber-800' },
  'plumbing': { name: 'Plumbing', color: 'bg-emerald-100 text-emerald-800' },
  'electrical': { name: 'Electrical Work', color: 'bg-yellow-100 text-yellow-800' },
  'cleaning': { name: 'Cleaning', color: 'bg-purple-100 text-purple-800' },
  'gardening': { name: 'Gardening', color: 'bg-green-100 text-green-800' },
  'furniture': { name: 'Furniture Work', color: 'bg-indigo-100 text-indigo-800' },
  'moving': { name: 'Moving', color: 'bg-red-100 text-red-800' },
};

const BrokerPage = () => {
  const { user } = useAuthStore();
  const [workers, setWorkers] = useState(mockWorkers);
  const [orders, setOrders] = useState(mockOrders);
  const [assignedJobs, setAssignedJobs] = useState(mockAssignedJobs);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedWorker, setSelectedWorker] = useState('');
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);

  const pendingOrders = orders.filter(order => order.status === 'pending');
  const activeJobs = assignedJobs.filter(job => job.status === 'assigned');
  const completedJobs = assignedJobs.filter(job => job.status === 'completed');

  const handleAssignOrder = (order) => {
    setSelectedOrder(order);
    setIsAssignDialogOpen(true);
  };

  const handleAssignWorker = () => {
    if (!selectedWorker || !selectedOrder) {
      toast({
        title: "Error",
        description: "Please select a worker to assign.",
        variant: "destructive",
      });
      return;
    }

    const worker = workers.find(w => w.id === selectedWorker);
    
    // Create a new job assignment
    const newJob = {
      id: `job-${Date.now()}`,
      orderId: selectedOrder.id,
      customerName: selectedOrder.customerName,
      serviceType: selectedOrder.serviceType,
      location: selectedOrder.location,
      date: selectedOrder.date,
      description: selectedOrder.description,
      status: 'assigned',
      workerId: worker.id,
      workerName: worker.name,
      assignedAt: new Date().toISOString(),
    };
    
    // Update state
    setAssignedJobs([...assignedJobs, newJob]);
    setOrders(orders.filter(o => o.id !== selectedOrder.id));
    setWorkers(workers.map(w => w.id === worker.id 
      ? { ...w, activeJobs: w.activeJobs + 1 } 
      : w
    ));
    
    // Close dialog and reset selection
    setIsAssignDialogOpen(false);
    setSelectedOrder(null);
    setSelectedWorker('');
    
    toast({
      title: "Job assigned successfully",
      description: `The job has been assigned to ${worker.name}.`,
    });
  };

  const renderOrderCard = (order) => {
    const serviceType = serviceTypesMap[order.serviceType] || { name: order.serviceType, color: 'bg-gray-100 text-gray-800' };
    
    return (
      <Card key={order.id} className="mb-4">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <Badge className={serviceType.color}>{serviceType.name}</Badge>
              <CardTitle className="mt-2 text-lg">{order.customerName}</CardTitle>
            </div>
            <Badge variant="outline">{new Date(order.createdAt).toLocaleDateString()}</Badge>
          </div>
          <CardDescription className="flex items-center gap-1 mt-1">
            <MapPin className="h-3.5 w-3.5" /> {order.location}
          </CardDescription>
          <CardDescription className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" /> Requested for: {order.date}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm">{order.description}</p>
        </CardContent>
        <CardFooter>
          <Button onClick={() => handleAssignOrder(order)} className="w-full">
            Assign Worker
          </Button>
        </CardFooter>
      </Card>
    );
  };

  const renderJobCard = (job) => {
    const serviceType = serviceTypesMap[job.serviceType] || { name: job.serviceType, color: 'bg-gray-100 text-gray-800' };
    
    return (
      <Card key={job.id} className="mb-4">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <Badge className={serviceType.color}>{serviceType.name}</Badge>
              <CardTitle className="mt-2 text-lg">{job.customerName}</CardTitle>
            </div>
            {job.status === 'completed' ? (
              <Badge className="bg-green-100 text-green-800">Completed</Badge>
            ) : (
              <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>
            )}
          </div>
          <CardDescription className="flex items-center gap-1 mt-1">
            <MapPin className="h-3.5 w-3.5" /> {job.location}
          </CardDescription>
          <CardDescription className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" /> Scheduled: {job.date}
          </CardDescription>
          <CardDescription className="flex items-center gap-1">
            <User className="h-3.5 w-3.5" /> Assigned to: {job.workerName}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm">{job.description}</p>
          <div className="mt-2 text-xs text-muted-foreground">
            {job.status === 'completed' 
              ? `Completed on ${new Date(job.completedAt).toLocaleDateString()}`
              : `Assigned on ${new Date(job.assignedAt).toLocaleDateString()}`
            }
          </div>
        </CardContent>
        <CardFooter>
          {job.status === 'completed' ? (
            <div className="flex items-center justify-center w-full text-green-600">
              <CheckCircle2 className="mr-2 h-4 w-4" /> 
              <span>Completed</span>
            </div>
          ) : (
            <Button variant="outline" className="w-full" disabled>
              In Progress
            </Button>
          )}
        </CardFooter>
      </Card>
    );
  };

  const renderWorkerCard = (worker) => {
    return (
      <Card key={worker.id} className="mb-4">
        <CardHeader>
          <CardTitle className="text-lg">{worker.name}</CardTitle>
          <CardDescription className="mt-1">
            Rating: {worker.rating}/5
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-1 mb-2">
            {worker.specialties.map(specialty => (
              <Badge key={specialty} variant="outline" className="text-xs">
                {serviceTypesMap[specialty]?.name || specialty}
              </Badge>
            ))}
          </div>
          <p className="text-sm text-muted-foreground">
            Active Jobs: {worker.activeJobs}
          </p>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Broker Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Welcome back, {user?.name || 'Broker'}! Manage your workers and customer orders.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">New Orders</h2>
            <Badge className="bg-primary">{pendingOrders.length}</Badge>
          </div>
          {pendingOrders.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <p className="text-muted-foreground text-center">
                  No new orders at the moment.
                </p>
              </CardContent>
            </Card>
          ) : (
            pendingOrders.map(renderOrderCard)
          )}
        </div>
        
        <div className="md:col-span-2">
          <Tabs defaultValue="active" className="space-y-4">
            <TabsList>
              <TabsTrigger value="active">
                Active Jobs
                {activeJobs.length > 0 && (
                  <Badge className="ml-2 bg-blue-600 text-white">{activeJobs.length}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="completed">
                Completed Jobs
                {completedJobs.length > 0 && (
                  <Badge className="ml-2 bg-green-600 text-white">{completedJobs.length}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="workers">
                My Workers
                {workers.length > 0 && (
                  <Badge className="ml-2 bg-amber-600 text-white">{workers.length}</Badge>
                )}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="active" className="space-y-4">
              {activeJobs.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-10">
                    <p className="text-muted-foreground text-center">
                      No active jobs at the moment.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeJobs.map(renderJobCard)}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="completed" className="space-y-4">
              {completedJobs.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-10">
                    <p className="text-muted-foreground text-center">
                      No completed jobs yet.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {completedJobs.map(renderJobCard)}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="workers" className="space-y-4">
              {workers.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-10">
                    <p className="text-muted-foreground text-center">
                      No workers in your team yet.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {workers.map(renderWorkerCard)}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Worker to Job</DialogTitle>
            <DialogDescription>
              Select a worker to assign to this job based on their specialties and availability.
            </DialogDescription>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="py-4">
              <div className="space-y-1 mb-4">
                <h4 className="font-medium">Order Details</h4>
                <p className="text-sm">Customer: {selectedOrder.customerName}</p>
                <p className="text-sm">Service: {serviceTypesMap[selectedOrder.serviceType]?.name || selectedOrder.serviceType}</p>
                <p className="text-sm">Date: {selectedOrder.date}</p>
              </div>
              
              <Separator className="my-4" />
              
              <div className="space-y-4">
                <label className="block text-sm font-medium">
                  Select Worker
                </label>
                <Select value={selectedWorker} onValueChange={setSelectedWorker}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a worker" />
                  </SelectTrigger>
                  <SelectContent>
                    {workers.map((worker) => (
                      <SelectItem key={worker.id} value={worker.id}>
                        {worker.name} ({worker.activeJobs} active jobs)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAssignDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAssignWorker}>
              Assign Worker
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BrokerPage;
