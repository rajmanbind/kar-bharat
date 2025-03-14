
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, User, Briefcase, CheckCircle } from "lucide-react";

const WORKER_TYPES = {
  CARPENTER: 'carpenter',
  MECHANIC: 'mechanic',
  DESIGNER: 'designer'
};

const BrokerWorker = ({ workerId, onComplete }) => {
  const [status, setStatus] = useState('idle'); // idle, processing, assigned, completed, failed
  const [progress, setProgress] = useState(0);
  const [taskInfo, setTaskInfo] = useState(null);
  const [workerType, setWorkerType] = useState(WORKER_TYPES.CARPENTER);
  const [assignedCustomer, setAssignedCustomer] = useState(null);

  useEffect(() => {
    // Simulate fetching worker information
    const fetchWorkerInfo = async () => {
      try {
        // This would be replaced with an actual API call
        setTaskInfo({
          id: workerId,
          type: workerType,
          started: new Date().toISOString(),
          estimated_completion: null
        });
      } catch (error) {
        console.error("Error fetching worker info:", error);
        toast({
          title: "Error",
          description: "Failed to load worker information",
          variant: "destructive"
        });
      }
    };

    if (workerId) {
      fetchWorkerInfo();
    }
  }, [workerId, workerType]);

  const startProcessing = () => {
    if (!assignedCustomer) {
      toast({
        title: "Assignment Required",
        description: "Please assign this worker to a customer first",
        variant: "destructive"
      });
      return;
    }
    
    setStatus('processing');
    
    // Simulate a processing task with progress updates
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 5;
      setProgress(currentProgress);
      
      if (currentProgress >= 100) {
        clearInterval(interval);
        setStatus('completed');
        if (onComplete) onComplete(workerId);
        
        toast({
          title: "Service Completed",
          description: `Worker ${workerId} has completed the service at ${assignedCustomer.location}`,
        });
      }
    }, 500);
  };

  const assignToCustomer = () => {
    // Simulate assigning to a random customer
    const customers = [
      { id: 1, name: "John Smith", location: "123 Main St" },
      { id: 2, name: "Jane Doe", location: "456 Oak Ave" },
      { id: 3, name: "Bob Johnson", location: "789 Pine Rd" },
      { id: 4, name: "Alice Williams", location: "321 Maple Dr" }
    ];
    
    const randomCustomer = customers[Math.floor(Math.random() * customers.length)];
    setAssignedCustomer(randomCustomer);
    setStatus('assigned');
    
    toast({
      title: "Worker Assigned",
      description: `${workerType.charAt(0).toUpperCase() + workerType.slice(1)} assigned to ${randomCustomer.name} at ${randomCustomer.location}`,
    });
  };

  const cancelTask = () => {
    setStatus('idle');
    setProgress(0);
    setAssignedCustomer(null);
    
    toast({
      title: "Task Cancelled",
      description: `Worker ${workerId} task has been cancelled.`
    });
  };
  
  const getWorkerTypeIcon = () => {
    switch(workerType) {
      case WORKER_TYPES.CARPENTER:
        return <Briefcase className="h-5 w-5" />;
      case WORKER_TYPES.MECHANIC:
        return <Briefcase className="h-5 w-5" />;
      case WORKER_TYPES.DESIGNER:
        return <Briefcase className="h-5 w-5" />;
      default:
        return <User className="h-5 w-5" />;
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            {getWorkerTypeIcon()}
            Worker {workerId}
          </CardTitle>
          <Select
            value={workerType}
            onValueChange={(value) => {
              if (status === 'idle') {
                setWorkerType(value);
              } else {
                toast({
                  title: "Cannot Change Type",
                  description: "Worker must be idle to change type",
                  variant: "destructive"
                });
              }
            }}
            disabled={status !== 'idle'}
          >
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={WORKER_TYPES.CARPENTER}>Carpenter</SelectItem>
              <SelectItem value={WORKER_TYPES.MECHANIC}>Mechanic</SelectItem>
              <SelectItem value={WORKER_TYPES.DESIGNER}>Designer</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <CardDescription>
          {status === 'idle' && 'Ready to be assigned'}
          {status === 'assigned' && 'Assigned to customer'}
          {status === 'processing' && `In progress... ${progress}%`}
          {status === 'completed' && 'Service completed successfully'}
          {status === 'failed' && 'Service failed to complete'}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {taskInfo && (
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Worker ID:</span>
              <span>{taskInfo.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Specialty:</span>
              <span className="capitalize">{taskInfo.type}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Started:</span>
              <span>{new Date(taskInfo.started).toLocaleString()}</span>
            </div>
          </div>
        )}
        
        {assignedCustomer && (
          <div className="mt-4 p-3 bg-muted rounded-md">
            <div className="font-medium mb-2">Customer Assignment</div>
            <div className="flex items-center gap-2 mb-1">
              <User className="h-4 w-4 text-muted-foreground" />
              <span>{assignedCustomer.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{assignedCustomer.location}</span>
            </div>
          </div>
        )}
        
        {status === 'processing' && (
          <div className="mt-4">
            <div className="h-2 bg-secondary rounded-full">
              <div 
                className="h-full bg-primary rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
        
        {status === 'completed' && (
          <div className="mt-4 flex items-center justify-center p-3 bg-green-50 text-green-700 rounded-md">
            <CheckCircle className="h-5 w-5 mr-2" />
            <span>Service completed successfully</span>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between">
        {status === 'idle' && (
          <Button onClick={assignToCustomer}>Assign to Customer</Button>
        )}
        
        {status === 'assigned' && (
          <>
            <Button onClick={startProcessing}>Start Service</Button>
            <Button variant="outline" onClick={cancelTask}>Cancel</Button>
          </>
        )}
        
        {status === 'processing' && (
          <Button variant="destructive" onClick={cancelTask}>Cancel</Button>
        )}
        
        {status === 'completed' && (
          <Button variant="outline" onClick={() => {
            setStatus('idle');
            setAssignedCustomer(null);
          }}>New Assignment</Button>
        )}
        
        {status === 'failed' && (
          <Button variant="outline" onClick={assignToCustomer}>Retry</Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default BrokerWorker;
