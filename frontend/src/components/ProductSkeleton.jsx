const ProductSkeleton = () => {
    return (
      <div className="flex flex-col h-full bg-white border border-gray-100 rounded-lg overflow-hidden shadow-sm animate-pulse">
        <div className="aspect-[4/5] bg-gray-200"></div>
        <div className="p-4 flex flex-col flex-grow">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="mt-auto flex justify-between items-center">
             <div className="h-5 bg-gray-200 rounded w-1/4"></div>
             <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
          </div>
        </div>
      </div>
    );
  };
  
  export default ProductSkeleton;
