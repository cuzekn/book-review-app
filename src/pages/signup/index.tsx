import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';

import Compressor from 'compressorjs';

import { authApi } from '../../api';
import { FormInput } from '../../components/FormInput';
import { ImageUpload } from '../../components/ImageUpload';
import { getApiErrorMessage } from '../../utils/errorHandling';
import {
  EMAIL_VALIDATION,
  NAME_VALIDATION,
  PASSWORD_VALIDATION,
} from '../../utils/validation';

type SignUpInputs = {
  email: string;
  name: string;
  password: string;
};

export const SignUp = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpInputs>();
  const [isLoading, setIsLoading] = useState(false);
  const [compressedIconFile, setCompressedIconFile] = useState<File | null>(
    null,
  );

  const handleImageChange = (file: File | null) => {
    if (!file) {
      setCompressedIconFile(null);
      return;
    }

    // Compressor.jsで画像をリサイズ
    new Compressor(file, {
      maxWidth: 300,
      maxHeight: 300,
      quality: 0.8,
      success: (compressedFile) => {
        const compressedFileWithName = new File([compressedFile], file.name, {
          type: compressedFile.type,
          lastModified: Date.now(),
        });
        setCompressedIconFile(compressedFileWithName);
        console.log('画像を圧縮しました:', {
          元のサイズ: `${(file.size / 1024).toFixed(2)} KB`,
          圧縮後: `${(compressedFile.size / 1024).toFixed(2)} KB`,
        });
      },
      error: (err) => {
        console.error('画像圧縮エラー:', err);
        toast.error('画像の処理に失敗しました。別の画像をお試しください。');
      },
    });
  };

  const uploadIconIfExists = (iconFile: File | null) => {
    if (!iconFile) return;

    authApi
      .uploadIcon(iconFile)
      .catch((iconError) =>
        console.error('アイコンアップロードエラー:', iconError),
      );
  };

  const onSubmit: SubmitHandler<SignUpInputs> = async (data) => {
    setIsLoading(true);
    try {
      // ユーザー登録
      await authApi.signup(data);

      // アイコンがあればアップロード（失敗しても登録は成功とする）
      uploadIconIfExists(compressedIconFile);

      toast.success('新規登録に成功しました');
      console.log('新規登録成功:', data);
      console.log('iconFile:', compressedIconFile);
      navigate('/');
    } catch (error) {
      console.error('新規登録エラー:', error);
      const errorMessage = getApiErrorMessage(
        error,
        '新規登録に失敗しました。もう一度お試しください。',
      );
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-base-300 p-8 lg:p-16">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body">
          <h1 className="card-title mb-3 text-4xl font-bold">新規登録</h1>
          <p className="text-base-content/60 mb-8">
            アカウントを作成して、書籍レビューを始めましょう
          </p>
          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="space-y-6"
          >
            <ImageUpload onImageChange={handleImageChange} />

            <FormInput
              label="ユーザー名"
              id="name"
              type="text"
              error={errors.name}
              placeholder="ユーザー名"
              {...register('name', NAME_VALIDATION)}
            />

            <FormInput
              label="メールアドレス"
              id="email"
              type="email"
              error={errors.email}
              placeholder="メールアドレス"
              {...register('email', EMAIL_VALIDATION)}
            />

            <FormInput
              label="パスワード"
              id="password"
              type="password"
              error={errors.password}
              placeholder="6文字以上"
              {...register('password', PASSWORD_VALIDATION)}
            />

            <button type="submit" className="btn btn-primary w-full">
              {isLoading ? '登録中...' : '新規登録'}
            </button>
          </form>

          <div className="divider"></div>

          <p className="text-base-content/60 text-center">
            すでにアカウントをお持ちの方は
            <Link to="/login" className="link link-primary ml-1">
              ログイン
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
