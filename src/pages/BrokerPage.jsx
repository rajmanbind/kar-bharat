
import React, { useState } from 'react';
import BrokerWorker from '../components/worker';
import { Button } from "@/components/ui/button";

const BrokerPage = () => {
  const [workers, setWorkers] = useState([1]);

  const addWorker = () => {
    setWorkers([...workers, workers.length + 1]);
  };

  const handleWorkerComplete = (workerId) => {
    console.log(`Worker ${workerId} completed its task`);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Broker Workers</h1>
        <Button onClick={addWorker}>Add Worker</Button>
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
    </div>
  );
};

export default BrokerPage;
