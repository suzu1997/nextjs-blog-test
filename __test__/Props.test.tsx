/**
 * @jest-environment jsdom
 */
import { render, screen, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import PostDetail from '../src/pages/posts/[id]';
import { Post } from '../src/types/type';

describe('PostDetailPage Test Cases', () => {
  const dummyProps: Post = {
    id: 1,
    title: 'title 1',
    content: 'content 1',
    username: 'username1',
    tags: [
      { id: 1, name: 'tag1' },
      { id: 2, name: 'tag2' },
    ],
    created_at: '2021-01-01 10:00:00',
  };
  it('Should render collectly with given props value', () => {
    render(<PostDetail {...dummyProps} />);
    expect(screen.getByText(dummyProps.title)).toBeInTheDocument();
    expect(screen.getByText(dummyProps.content)).toBeInTheDocument();
    expect(screen.getByText(`by ${dummyProps.username}`)).toBeInTheDocument();
    expect(screen.getByText(dummyProps.tags[0].name)).toBeInTheDocument();
    expect(screen.getByText(dummyProps.tags[1].name)).toBeInTheDocument();
    expect(screen.getByText(dummyProps.created_at)).toBeInTheDocument();
  });
});
