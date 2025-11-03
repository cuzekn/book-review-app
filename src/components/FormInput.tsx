import { useState } from 'react';
import { type FieldError, type UseFormRegisterReturn } from 'react-hook-form';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';

type FormInputProps = {
  id: string;
  label: string;
  type: 'text' | 'email' | 'password';
  error?: FieldError;
  placeholder?: string;
} & UseFormRegisterReturn;

export const FormInput = ({
  id,
  label,
  placeholder,
  type,
  error,
  ...register
}: FormInputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const inputType =
    type === 'password' ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="form-control">
      <label htmlFor={id} className="label">
        <span className="label-text font-semibold">{label}</span>
      </label>
      <div className="relative">
        <input
          type={inputType}
          id={id}
          className={`input-bordered input w-full ${
            error ? 'input-error' : ''
          } ${type === 'password' ? 'pr-12' : ''}`}
          placeholder={placeholder}
          {...register}
        />
        {type === 'password' && (
          <button
            type="button"
            className="text-base-content/60 absolute right-3 top-1/2 z-10 -translate-y-1/2 transition hover:text-base-content"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? 'パスワードを隠す' : 'パスワードを表示'}
          >
            {showPassword ? (
              <MdVisibilityOff className="text-xl" />
            ) : (
              <MdVisibility className="text-xl" />
            )}
          </button>
        )}
      </div>
      {error && (
        <label className="label">
          <span
            className="label-text-alt flex items-center gap-1 text-error"
            role="alert"
          >
            ⚠ {error.message}
          </span>
        </label>
      )}
    </div>
  );
};
