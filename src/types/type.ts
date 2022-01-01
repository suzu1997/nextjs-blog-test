type Tag = {
  id: number;
  name: string;
}
export type Post = {
  id: number;
  title: string;
  content: string;
  username: string;
  tags: Array<Tag>;
  created_at: string;
}