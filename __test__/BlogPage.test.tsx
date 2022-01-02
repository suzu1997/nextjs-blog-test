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

process.env.NEXT_PUBLIC_RESTAPI_URL = 'http://127.0.0.1:8000/api';

const handlers = [
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
  // cookieをリセット
  document.cookie =
    // access_tokenを空に、有効期限を過去にする
    'access_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;';
});
afterAll(() => {
  server.close();
});

describe('BlogPage Test Cases', () => {
  it('Should route to admin page and route back to blog page', async () => {
    const { page } = await getPage({
      route: '/',
    });
    render(page);
    userEvent.click(screen.getByTestId('admin-nav'));
    expect(await screen.findByText('Login')).toBeInTheDocument();
    userEvent.click(screen.getByTestId('blog-nav'));
    expect(await screen.findByText('Blog page')).toBeInTheDocument();
  });

  it('Should render delete btn and logout btn when JWT token cookie exist', async () => {
    // 擬似的なtokenを作成
    document.cookie = 'access_token=dummytoken';
    const { page } = await getPage({
      route: '/',
    });
    render(page);
    expect(await screen.findByText('Blog page')).toBeInTheDocument();
    expect(screen.getByTestId('btn-1')).toBeInTheDocument();
    expect(screen.getByTestId('btn-2')).toBeInTheDocument();
    expect(screen.getByTestId('logout-icon')).toBeInTheDocument();
  });

  it('Should not render delete btn and logout btn when no cookie', async () => {
    const { page } = await getPage({
      route: '/',
    });
    render(page);
    expect(await screen.findByText('Blog page')).toBeInTheDocument();
    expect(screen.queryByTestId('btn-1')).toBeNull();
    expect(screen.queryByTestId('btn-2')).toBeNull();
    expect(screen.queryByTestId('logout-icon')).toBeNull();
  });

  it('Should render the list of blogs pre-fetched by getStaticProps', async() => {
    const { page } = await getPage({
      route: '/',
    });
    render(page);
    expect(await screen.findByText('Blog page')).toBeInTheDocument();
    expect(screen.getByText('title 1')).toBeInTheDocument();
    expect(screen.getByText('title 2')).toBeInTheDocument();
  })
});
