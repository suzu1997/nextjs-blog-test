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
            username: 'username1',
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
            username: 'username2',
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
  rest.get(
    `${process.env.NEXT_PUBLIC_RESTAPI_URL}/get-blogs/1`,
    (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({
          id: 1,
          title: 'title 1',
          content: 'content 1',
          username: 'username1',
          tags: [
            { id: 1, name: 'tag1' },
            { id: 2, name: 'tag2' },
          ],
          created_at: '2021-01-01 10:00:00',
        })
      );
    }
  ),
  rest.get(
    `${process.env.NEXT_PUBLIC_RESTAPI_URL}/get-blogs/2`,
    (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({
          id: 2,
          title: 'title 2',
          content: 'content 2',
          username: 'username2',
          tags: [
            { id: 1, name: 'tag1' },
            { id: 2, name: 'tag2' },
          ],
          created_at: '2021-01-03 13:00:00',
        })
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

describe('BlogDetailPage Test Cases', () => {
  it('Should render detailed content of ID 1', async () => {
    const { page } = await getPage({
      route: '/posts/1',
    });
    render(page);
    expect(await screen.findByText('title 1')).toBeInTheDocument();
    expect(screen.getByText('content 1')).toBeInTheDocument();
    expect(screen.getByText('by username1')).toBeInTheDocument();
    expect(screen.getByText('tag1')).toBeInTheDocument();
    expect(screen.getByText('tag2')).toBeInTheDocument();
  });

  it('Should render detailed content of ID 2', async () => {
    const { page } = await getPage({
      route: '/posts/2',
    });
    render(page);
    expect(await screen.findByText('title 2')).toBeInTheDocument();
    expect(screen.getByText('content 2')).toBeInTheDocument();
    expect(screen.getByText('by username2')).toBeInTheDocument();
    expect(screen.getByText('tag1')).toBeInTheDocument();
    expect(screen.getByText('tag2')).toBeInTheDocument();
  });

  it('Should route back to blog-page from detail page', async () => {
    const { page } = await getPage({
      route: '/posts/2',
    });
    render(page);
    expect(await screen.findByText('title 2')).toBeInTheDocument();
    userEvent.click(screen.getByTestId('back-blog'));
    expect(await screen.findByText('Blog page')).toBeInTheDocument();
  });
});
