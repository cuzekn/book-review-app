import { useForm, type SubmitHandler } from 'react-hook-form';
import { Link } from 'react-router-dom';

import { FormInput } from '../../components/FormInput';
import { ImageUpload } from '../../components/ImageUpload';
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
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpInputs>();

  const handleImageChange = (file: File | null) => {
    if (file) {
      console.log('選択された画像:', file.name);
    }
  };

  const onSubmit: SubmitHandler<SignUpInputs> = (data) => {
    console.log('新規登録データ:', data);
    alert('新規登録処理を実行します');
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
              新規登録
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
