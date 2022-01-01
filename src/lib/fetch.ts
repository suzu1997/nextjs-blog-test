import fetch from 'node-fetch';
import { Post } from '../types/type';

export const getAllPostsData = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_RESTAPI_URL}/get-blogs/`);
  const posts = await res.json();
  return posts;
}

export const getAllPostIds = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_RESTAPI_URL}/get-blogs/`)
  const posts = await res.json();
  return posts.map((post: Post) => {
    return {
      params: {
        id: String(post.id)
      }
    }
  })
}

export const getPostData = async (id: string) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_RESTAPI_URL}/get-blogs/${id}`)
  const post = await res.json();
  return post;
}