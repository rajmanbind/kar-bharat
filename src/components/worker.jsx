
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";

const BrokerWorker = ({ workerId, onComplete }) => {
  const [status, setStatus] = useState('idle'); // idle, processing, completed, failed
  const [progress, setProgress] = useState(0);
  const [taskInfo, setTaskInfo] = useState(null);

  useEffect(() => {
    // Simulate fetching worker information
    const fetchWorkerInfo = async () => {
      try {
        // This would be replaced with an actual API call
        setTaskInfo({
          id: workerId,
          type: 'data_processing',
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
  }, [workerId]);

  const startProcessing = () => {
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
          title: "Task Completed",
          description: `Worker ${workerId} has completed the assigned task.`
        });
      }
    }, 500);
  };

  const cancelTask = () => {
    setStatus('idle');
    setProgress(0);
    
    toast({
      title: "Task Cancelled",
      description: `Worker ${workerId} task has been cancelled.`
    });
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Broker Worker {workerId}</CardTitle>
        <CardDescription>
          {status === 'idle' && 'Ready to process tasks'}
          {status === 'processing' && `Processing... ${progress}%`}
          {status === 'completed' && 'Task completed successfully'}
          {status === 'failed' && 'Task failed to complete'}
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
              <span className="text-muted-foreground">Task Type:</span>
              <span>{taskInfo.type}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Started:</span>
              <span>{new Date(taskInfo.started).toLocaleString()}</span>
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
      </CardContent>
      
      <CardFooter className="flex justify-between">
        {status === 'idle' && (
          <Button onClick={startProcessing}>Start Processing</Button>
        )}
        
        {status === 'processing' && (
          <Button variant="destructive" onClick={cancelTask}>Cancel</Button>
        )}
        
        {status === 'completed' && (
          <Button variant="outline" onClick={() => setStatus('idle')}>Reset</Button>
        )}
        
        {status === 'failed' && (
          <Button variant="outline" onClick={startProcessing}>Retry</Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default BrokerWorker;
