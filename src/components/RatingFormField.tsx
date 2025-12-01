import { BookRating } from './BookRating';

type RatingFormFieldProps = {
  onChange: (value: number) => void;
  value: number;
  label?: string;
  required?: boolean;
};

export const RatingFormField = ({
  onChange,
  value,
  label = '評価',
  required = false,
}: RatingFormFieldProps) => {
  return (
    <div className="form-control">
      <label className="label">
        <span className="label-text font-semibold">
          {label}
          {required && <span className="ml-1 text-error">*</span>}
        </span>
        {value > 0 && (
          <span className="label-text-alt text-base-content/60">
            {value} / 5
          </span>
        )}
      </label>
      <div className="mt-1">
        <BookRating value={value} onChange={onChange} />
      </div>
      {value === 0 && (
        <label className="label">
          <span className="label-text-alt text-base-content/60">
            星をクリックして評価してください
          </span>
        </label>
      )}
    </div>
  );
};
