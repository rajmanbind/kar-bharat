
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";
import { User, MapPin, Clock } from "lucide-react";

const workerTypes = [
  { id: 'carpenter', name: 'Carpenter', color: 'bg-amber-100 text-amber-800' },
  { id: 'mechanic', name: 'Mechanic', color: 'bg-blue-100 text-blue-800' },
  { id: 'designer', name: 'Designer', color: 'bg-purple-100 text-purple-800' },
  { id: 'painter', name: 'Painter', color: 'bg-green-100 text-green-800' },
  { id: 'plumber', name: 'Plumber', color: 'bg-red-100 text-red-800' },
];

const BrokerWorker = ({ workerId, onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('idle'); // idle, working, completed
  const [customer, setCustomer] = useState(null);
  
  // Randomly select a worker type for this worker
  const workerType = workerTypes[workerId % workerTypes.length];
  
  const assignCustomer = () => {
    // Mock customer assignment
    const customers = [
      { name: 'John Smith', location: '123 Main St.', jobDescription: 'Kitchen cabinets repair' },
      { name: 'Alice Johnson', location: '456 Oak Ave.', jobDescription: 'Door installation' },
      { name: 'Bob Miller', location: '789 Pine Rd.', jobDescription: 'Bookshelf assembly' },
      { name: 'Carol Davis', location: '321 Elm St.', jobDescription: 'Window frame repair' },
      { name: 'David Wilson', location: '654 Maple Dr.', jobDescription: 'Table and chairs assembly' }
    ];
    
    const randomCustomer = customers[Math.floor(Math.random() * customers.length)];
    setCustomer(randomCustomer);
    setStatus('working');
    setProgress(0);
    
    toast({
      title: "Worker assigned",
      description: `${workerType.name} has been assigned to ${randomCustomer.name}`,
    });
    
    // Simulate work progress
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 10;
        
        if (newProgress >= 100) {
          clearInterval(interval);
          setStatus('completed');
          onComplete(workerId);
          return 100;
        }
        
        return newProgress;
      });
    }, 1000);
  };
  
  const completeTask = () => {
    setStatus('idle');
    setCustomer(null);
    
    toast({
      title: "Task completed",
      description: `${workerType.name} has completed the task successfully`,
      variant: "success",
    });
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <Badge className={workerType.color}>{workerType.name}</Badge>
            <CardTitle className="mt-2 text-xl">Worker #{workerId}</CardTitle>
          </div>
          {status === 'idle' && <Badge variant="outline">Available</Badge>}
          {status === 'working' && <Badge className="bg-blue-100 text-blue-800">Working</Badge>}
          {status === 'completed' && <Badge className="bg-green-100 text-green-800">Completed</Badge>}
        </div>
      </CardHeader>
      <CardContent>
        {customer ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4 text-muted-foreground" />
              <span>{customer.name}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{customer.location}</span>
            </div>
            <div className="space-y-1 mt-4">
              <div className="text-sm font-medium">Job Description:</div>
              <p className="text-sm text-muted-foreground">{customer.jobDescription}</p>
            </div>
            
            {status === 'working' && (
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} />
              </div>
            )}
          </div>
        ) : (
          <div className="py-6 flex flex-col items-center justify-center text-center text-muted-foreground">
            <Clock className="h-10 w-10 mb-2 opacity-50" />
            <p>No customer assigned</p>
            <p className="text-sm">Assign a customer to this worker</p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        {status === 'idle' && (
          <Button onClick={assignCustomer} className="w-full">
            Assign Customer
          </Button>
        )}
        {status === 'working' && (
          <Button disabled className="w-full">
            In Progress...
          </Button>
        )}
        {status === 'completed' && (
          <Button onClick={completeTask} variant="outline" className="w-full">
            Mark as Complete
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default BrokerWorker;
