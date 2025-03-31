
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { Calendar, CheckCircle, MapPin, User } from "lucide-react";
import useAuthStore from '../store/useAuthStore';

// Mock data for worker's assignments
const mockAssignments = [
  {
    id: 'job-1',
    serviceType: 'painting',
    customerName: 'Alice Johnson',
    location: '123 Main St, Anytown',
    date: '2023-07-15',
    description: 'Paint living room walls with eggshell white paint. Customer has the paint ready.',
    status: 'assigned',
    brokerId: 'broker-1',
    brokerName: 'Bob Smith',
  },
  {
    id: 'job-2',
    serviceType: 'carpentry',
    customerName: 'David Wilson',
    location: '456 Oak Ave, Somewhere',
    date: '2023-07-16',
    description: 'Fix kitchen cabinet doors that are not closing properly.',
    status: 'assigned',
    brokerId: 'broker-1',
    brokerName: 'Bob Smith',
  },
  {
    id: 'job-3',
    serviceType: 'furniture',
    customerName: 'Emily Davis',
    location: '789 Pine Rd, Elsewhere',
    date: '2023-07-14',
    description: 'Assemble a new bookshelf and desk from IKEA.',
    status: 'completed',
    brokerId: null,
    brokerName: null,
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

const WorkerPage = () => {
  const { user } = useAuthStore();
  const [assignments, setAssignments] = useState(mockAssignments);
  const [activeTab, setActiveTab] = useState('pending');
  const [workInProgress, setWorkInProgress] = useState({});

  const pendingAssignments = assignments.filter(job => job.status === 'assigned');
  const completedAssignments = assignments.filter(job => job.status === 'completed');

  const startWork = (jobId) => {
    setWorkInProgress({
      ...workInProgress,
      [jobId]: { status: 'in-progress', progress: 0 }
    });
    
    toast({
      title: "Work started",
      description: "You've started working on this job.",
    });
    
    // Simulate progress over time
    const interval = setInterval(() => {
      setWorkInProgress(prev => {
        const currentProgress = (prev[jobId]?.progress || 0) + 10;
        
        if (currentProgress >= 100) {
          clearInterval(interval);
          return {
            ...prev,
            [jobId]: { status: 'finished', progress: 100 }
          };
        }
        
        return {
          ...prev,
          [jobId]: { status: 'in-progress', progress: currentProgress }
        };
      });
    }, 1000);
  };

  const completeJob = (jobId) => {
    setAssignments(assignments.map(job => 
      job.id === jobId ? { ...job, status: 'completed' } : job
    ));
    
    setWorkInProgress({
      ...workInProgress,
      [jobId]: null
    });
    
    toast({
      title: "Job completed",
      description: "Great job! The task has been marked as completed.",
    });
  };

  const renderJobCard = (job) => {
    const jobProgress = workInProgress[job.id];
    const isInProgress = jobProgress?.status === 'in-progress';
    const isFinished = jobProgress?.status === 'finished';
    const serviceType = serviceTypesMap[job.serviceType] || { name: job.serviceType, color: 'bg-gray-100 text-gray-800' };
    
    return (
      <Card key={job.id} className="mb-4">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <Badge className={serviceType.color}>{serviceType.name}</Badge>
              <CardTitle className="mt-2 text-xl">{job.customerName}</CardTitle>
            </div>
            {job.status === 'completed' && (
              <Badge className="bg-green-100 text-green-800">Completed</Badge>
            )}
          </div>
          <CardDescription className="flex items-center gap-1 mt-1">
            <MapPin className="h-3.5 w-3.5" /> {job.location}
          </CardDescription>
          <CardDescription className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" /> {job.date}
          </CardDescription>
          {job.brokerId && (
            <CardDescription className="flex items-center gap-1">
              <User className="h-3.5 w-3.5" /> Assigned by: {job.brokerName}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <p className="text-sm">{job.description}</p>
          
          {(isInProgress || isFinished) && (
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-1">
                <span>Progress</span>
                <span>{jobProgress.progress}%</span>
              </div>
              <Progress value={jobProgress.progress} />
            </div>
          )}
        </CardContent>
        <CardFooter>
          {job.status === 'assigned' && !isInProgress && !isFinished && (
            <Button onClick={() => startWork(job.id)} className="w-full">
              Start Work
            </Button>
          )}
          
          {isInProgress && (
            <Button disabled className="w-full">
              In Progress...
            </Button>
          )}
          
          {isFinished && (
            <Button onClick={() => completeJob(job.id)} className="w-full" variant="success">
              <CheckCircle className="mr-2 h-4 w-4" /> Mark as Completed
            </Button>
          )}
          
          {job.status === 'completed' && (
            <Button disabled variant="outline" className="w-full">
              Completed
            </Button>
          )}
        </CardFooter>
      </Card>
    );
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Worker Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome back, {user?.name || 'Worker'}! Manage your assignments here.
        </p>
      </div>

      <Tabs defaultValue="pending" className="space-y-4" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="pending">
            Pending Jobs
            {pendingAssignments.length > 0 && (
              <Badge className="ml-2 bg-primary text-primary-foreground">
                {pendingAssignments.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed Jobs
            {completedAssignments.length > 0 && (
              <Badge className="ml-2 bg-green-600 text-white">
                {completedAssignments.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending" className="space-y-4">
          {pendingAssignments.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <p className="text-muted-foreground text-center">
                  No pending jobs assigned to you at the moment.
                </p>
              </CardContent>
            </Card>
          ) : (
            pendingAssignments.map(renderJobCard)
          )}
        </TabsContent>
        
        <TabsContent value="completed" className="space-y-4">
          {completedAssignments.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <p className="text-muted-foreground text-center">
                  You haven't completed any jobs yet.
                </p>
              </CardContent>
            </Card>
          ) : (
            completedAssignments.map(renderJobCard)
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WorkerPage;
