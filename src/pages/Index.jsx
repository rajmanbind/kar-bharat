
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to Your Blank App</h1>
        <p className="text-xl text-gray-600 mb-8">Start building your amazing project here!</p>
        <Link to="/broker">
          <Button size="lg">Go to Broker Workers</Button>
        </Link>
      </div>
    </div>
  );
};

export default Index;
