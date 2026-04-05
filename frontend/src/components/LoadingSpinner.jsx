import { Loader2 } from 'lucide-react';

const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center h-full min-h-[50vh]">
      <Loader2 className="w-10 h-10 animate-spin text-black" />
    </div>
  );
};

export default LoadingSpinner;
