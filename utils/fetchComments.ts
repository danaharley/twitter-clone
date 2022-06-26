import { Comment } from "../typings";

export const fetchComment = async (tweetId: string) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URl}api/getComments?tweetId=${tweetId}`
  );

  const data = await res.json();
  const comments: Comment[] = data.comments;

  return comments;
};
