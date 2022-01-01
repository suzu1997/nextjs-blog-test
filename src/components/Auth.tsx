import { useRouter } from 'next/router';
import React, { FC, useState } from 'react';
import Cookie from 'universal-cookie';
import axios from 'axios';

const cookie = new Cookie();

export const Auth: FC = () => {
  const router = useRouter();
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  // trueならログインモード,falseなら新規登録モード
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const login = async () => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_RESTAPI_URL}/jwt/create`,
        { username, password },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      if (res.status === 200) {
        const options = { path: '/' }; // pathが'/'以下の場所でcookie有効
        cookie.set('access_token', res.data.access, options);
        router.push('/');
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const authUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLogin) {
      login();
    } else {
      try {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_RESTAPI_URL}/register/`,
          { username, password },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        if (res.status === 201) {
          login();
        }
      } catch {
        setError('Registration Error');
      }
    }
  };

  return (
    <>
      <p className="text-3xl text-center ">{isLogin ? 'Login' : 'Sign up'}</p>
      <form onSubmit={authUser} className="mt-8 space-y-3">
        <div>
          <input
            className="px-3 py-2 border border-gray-300"
            type="text"
            required
            placeholder="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <input
            className="px-3 py-2 border border-gray-300"
            type="password"
            required
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <p
          data-testid="mode-change"
          onClick={() => {
            setIsLogin(!isLogin);
            setError('');
          }}
          className="cursor-pointer flex items-center justify-center flex-col font-medium hover:text-indigo-500"
        >
          change mode ?
        </p>
        <div className="text-center">
          <button
            disabled={!username || !password}
            type="submit"
            className="disabled:opacity-40 py-2 px-4 text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
          >
            {isLogin ? 'Login with JWT' : 'Create new user'}
          </button>
        </div>
      </form>
      {error && <p className="mt-5 text-red-600">{error}</p>}
    </>
  );
};
