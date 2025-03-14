
import React, { useState } from 'react';
import BrokerWorker from '../components/worker';
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

const BrokerPage = () => {
  const [workers, setWorkers] = useState([1]);

  const addWorker = () => {
    setWorkers([...workers, workers.length + 1]);
  };

  const handleWorkerComplete = (workerId) => {
    console.log(`Worker ${workerId} completed its task`);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Service Worker Management</h1>
          <p className="text-muted-foreground mt-2">
            Assign workers to customers and track service completion
          </p>
        </div>
        <Button onClick={addWorker} className="flex items-center gap-2">
          <PlusCircle className="h-5 w-5" />
          Add New Worker
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {workers.map((workerId) => (
          <BrokerWorker 
            key={workerId} 
            workerId={workerId} 
            onComplete={handleWorkerComplete} 
          />
        ))}
      </div>

      {workers.length === 0 && (
        <div className="text-center p-12 border rounded-lg border-dashed">
          <p className="text-muted-foreground">No workers available. Add a worker to get started.</p>
        </div>
      )}
    </div>
  );
};

export default BrokerPage;
