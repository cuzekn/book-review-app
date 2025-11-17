import { useRef, useState } from 'react';
import { MdAddAPhoto } from 'react-icons/md';

type ImageUploadProps = {
  onImageChange?: (file: File | null) => void;
};

export const ImageUpload = ({ onImageChange }: ImageUploadProps) => {
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
      onImageChange?.(file);
    }
  };

  const handleImageClick = () => {
    // inputの値をリセットして、同じファイルでも再選択できるようにする
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const handleRemoveImage = () => {
    setPreviewUrl('');
    if (inputRef.current) {
      inputRef.current.value = '';
    }
    onImageChange?.(null);
  };

  return (
    <div className="form-control">
      <div className="label">
        <span className="label-text font-semibold">ユーザーアイコン</span>
      </div>
      <label
        htmlFor="icon"
        className="block w-fit cursor-pointer"
        onClick={handleImageClick}
      >
        {previewUrl ? (
          <div className="avatar">
            <div className="border-base-content/20 w-16 rounded-full border transition hover:opacity-75">
              <img src={previewUrl} alt="プレビュー" />
            </div>
          </div>
        ) : (
          <div className="placeholder avatar">
            <div className="border-base-content/20 text-base-content/40 flex w-16 items-center justify-center rounded-full border bg-base-200 transition hover:opacity-75">
              <MdAddAPhoto className="text-2xl" />
            </div>
          </div>
        )}
      </label>
      <input
        ref={inputRef}
        type="file"
        id="icon"
        accept="image/*"
        onChange={handleImageChange}
        className="hidden"
      />
      {previewUrl && (
        <button
          type="button"
          className="btn btn-ghost btn-sm mt-2 bg-red-500/10 p-2 text-red-600 hover:bg-red-500/20"
          onClick={handleRemoveImage}
        >
          画像を削除
        </button>
      )}
    </div>
  );
};
