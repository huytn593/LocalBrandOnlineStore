import { Star, StarHalf } from 'lucide-react';

const RatingStars = ({ rating = 0, size = 16, className = "" }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - Math.ceil(rating);

  return (
    <div className={`flex items-center text-yellow-400 ${className}`}>
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} size={size} fill="currentColor" strokeWidth={1} />
      ))}
      {hasHalfStar && (
        <StarHalf size={size} fill="currentColor" strokeWidth={1} />
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} size={size} className="text-gray-300" strokeWidth={1} />
      ))}
    </div>
  );
};

export default RatingStars;
