/**
 * @jest-environment jsdom
 */
import { render, screen, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { getPage } from 'next-page-tester';
import { initTestHelpers } from 'next-page-tester';

initTestHelpers();

// テストファイルの中では、環境変数が上手く読み込めないので、テストファイルの中で改めて定義しておく
process.env.NEXT_PUBLIC_RESTAPI_URL = 'http://127.0.0.1:8000/api';

const handlers = [
  rest.post(
    `${process.env.NEXT_PUBLIC_RESTAPI_URL}/jwt/create`,
    (req, res, ctx) => {
      // 擬似的なアクセストークンを返すようにしておく
      return res(
        ctx.status(200),
        ctx.json({
          access: '123xyz',
        })
      );
    }
  ),
  rest.post(
    `${process.env.NEXT_PUBLIC_RESTAPI_URL}/register/`,
    (req, res, ctx) => {
      return res(ctx.status(201));
    }
  ),
  rest.get(
    `${process.env.NEXT_PUBLIC_RESTAPI_URL}/get-blogs/`,
    (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json([
          {
            id: 1,
            title: 'title 1',
            content: 'content 1',
            username: 'usename1',
            tags: [
              { id: 1, name: 'tag1' },
              { id: 2, name: 'tag2' },
            ],
            created_at: '2021-01-01 10:00:00',
          },
          {
            id: 2,
            title: 'title 2',
            content: 'content 2',
            username: 'usename2',
            tags: [
              { id: 1, name: 'tag1' },
              { id: 2, name: 'tag2' },
            ],
            created_at: '2021-01-02 13:00:00',
          },
        ])
      );
    }
  ),
];

const server = setupServer(...handlers);
beforeAll(() => {
  server.listen();
});
afterEach(() => {
  server.resetHandlers();
  cleanup();
});
afterAll(() => {
  server.close();
});

describe('AdminPage Test Cases', () => {
  it('Should route to index page when login succeeded', async () => {
    const { page } = await getPage({
      route: '/admin-page',
    });
    render(page);
    expect(await screen.findByText('Login')).toBeInTheDocument();
    // userEvent.type … タイピング
    // getByPlaceholderTextで、placeholderの文字列で要素を取得
    userEvent.type(screen.getByPlaceholderText('username'), 'user1');
    userEvent.type(screen.getByPlaceholderText('password'), 'dummypw');
    userEvent.click(screen.getByText('Login with JWT'));
    expect(await screen.findByText('Blog page')).toBeInTheDocument();
  });

  // ログインに失敗した時
  it('Should not route to index-page when login is failed', async () => {
    // JWTトークン取得のレスポンスがBad requestであるようにAPIをモック
    server.use(
      rest.post(
        `${process.env.NEXT_PUBLIC_RESTAPI_URL}/jwt/create`,
        (req, res, ctx) => {
          return res(ctx.status(400));
        }
      )
    );
    const { page } = await getPage({
      route: '/admin-page',
    });
    render(page);
    expect(await screen.findByText('Login')).toBeInTheDocument();
    userEvent.type(screen.getByPlaceholderText('username'), 'user1');
    userEvent.type(screen.getByPlaceholderText('password'), 'dummypw');
    userEvent.click(screen.getByText('Login with JWT'));
    // エラーがちゃんと表示されるか
    expect(await screen.findByText('Login Error')).toBeInTheDocument();
    // ログインページに居続けるか
    expect(screen.getByText('Login')).toBeInTheDocument();
    // queryByText('') … 指定した文字列が含まれるかどうかを返す
    // toBeNull() … 存在しないことをチェック
    expect(screen.queryByText('Blog page')).toBeNull();
  });

  // ログインモードから登録モードに変更できるか
  it('Should change to register mode', async () => {
    const { page } = await getPage({
      route: '/admin-page',
    });
    render(page);
    expect(await screen.findByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Login with JWT')).toBeInTheDocument();
    userEvent.click(screen.getByTestId('mode-change'));
    expect(await screen.findByText('Sign up')).toBeInTheDocument();
    expect(screen.getByText('Create new user')).toBeInTheDocument();
  });

  it('Should route to index-page when register+login succeeded', async () => {
    const { page } = await getPage({
      route: '/admin-page',
    });
    render(page);
    expect(await screen.findByText('Login')).toBeInTheDocument();
    userEvent.click(screen.getByTestId('mode-change'));
    userEvent.type(screen.getByPlaceholderText('username'), 'user1');
    userEvent.type(screen.getByPlaceholderText('password'), 'dummypw');
    userEvent.click(screen.getByText('Create new user'));
    expect(await screen.findByText('Blog page')).toBeInTheDocument();
  });

  // 新規登録に失敗した時
  it('Should not route to index-page when register+login is failed', async () => {
    server.use(
      rest.post(
        `${process.env.NEXT_PUBLIC_RESTAPI_URL}/register/`,
        (req, res, ctx) => {
          return res(ctx.status(400));
        }
      )
    );

    const { page } = await getPage({
      route: '/admin-page',
    });
    render(page);
    expect(await screen.findByText('Login')).toBeInTheDocument();
    userEvent.click(screen.getByTestId('mode-change'));
    userEvent.type(screen.getByPlaceholderText('username'), 'user1');
    userEvent.type(screen.getByPlaceholderText('password'), 'dummypw');
    userEvent.click(screen.getByText('Create new user'));
    expect(await screen.findByText('Registration Error')).toBeInTheDocument();
    expect(screen.getByText('Sign up')).toBeInTheDocument();
    expect(screen.queryByText('Blog page')).toBeNull();
  });
});
