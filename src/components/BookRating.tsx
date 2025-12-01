/* eslint-disable @typescript-eslint/member-ordering */
import { Rating } from '@smastrom/react-rating';

import '@smastrom/react-rating/style.css';

type BookRatingProps = {
  value: number;
  onChange?: (value: number) => void;
  readonly?: boolean;
  size?: number;
  showReviewCount?: boolean;
  reviewCount?: number;
};

export const BookRating = ({
  value,
  onChange,
  readonly = false,
  size = 120,
  showReviewCount = false,
  reviewCount,
}: BookRatingProps) => {
  return (
    <div className="flex items-center gap-2">
      <Rating
        value={value}
        onChange={onChange}
        readOnly={readonly}
        style={{ maxWidth: size }}
      />
      {showReviewCount && reviewCount !== undefined && (
        <span className="text-sm text-gray-600">({reviewCount}件)</span>
      )}
    </div>
  );
};

export default BookRating;
