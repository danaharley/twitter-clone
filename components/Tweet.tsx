import React, { useEffect, useState } from "react";
import { Comment, CommentBody, Tweet } from "../typings";
import TimeAgo from "react-timeago";
import {
  ChatAlt2Icon,
  HeartIcon,
  SwitchHorizontalIcon,
  UploadIcon,
} from "@heroicons/react/outline";
import { fetchComment } from "../utils/fetchComments";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

interface Props {
  tweet: Tweet;
}

function Tweet({ tweet }: Props) {
  const { data } = useSession();
  const [comments, setComments] = useState<Comment[]>([]);
  const [input, setInput] = useState<string>("");
  const [commentBoxVisible, setCommentBoxVisible] = useState<boolean>(false);

  const refreshComments = async () => {
    const comments: Comment[] = await fetchComment(tweet._id);
    setComments(comments);
  };

  useEffect(() => {
    refreshComments();
  }, []);

  const postComment = async () => {
    const commentBody: CommentBody = {
      tweetId: tweet._id,
      comment: input,
      username: data?.user?.name || "Unknown User",
      profileImg:
        data?.user?.image ||
        "https://images.unsplash.com/photo-1481437642641-2f0ae875f836?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
    };

    const result = await fetch(`/api/addComment`, {
      method: "POST",
      body: JSON.stringify(commentBody),
    });

    const json = await result.json();

    const newComment = await fetchComment(tweet._id);
    setComments(newComment);

    toast("Comment posted!");

    return json;
  };

  const handleSubmitComment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    postComment();
    setInput("");
    setCommentBoxVisible(false);
  };

  return (
    <div className="flex flex-col space-x-3 border-y border-gray-100 p-5">
      <div className="flex space-x-3">
        <img
          className="h-10 w-10 rounded-full object-cover"
          src={tweet.profileImg}
          alt={tweet.username}
        />
        <div>
          <div className="flex items-center space-x-1">
            <p className="mr-1 font-bold">{tweet.username}</p>
            <p className="hidden text-sm text-gray-500 sm:inline">
              @{tweet.username.replace(/\s+/g, "").toLowerCase()} •
            </p>
            <TimeAgo
              date={tweet._createdAt}
              className="text-sm text-gray-500"
            />
          </div>
          <p className="pt-1">{tweet.text}</p>
          {tweet.image && (
            <img
              src={tweet.image}
              alt={tweet.username}
              className="m-5 ml-0 mb-1 max-h-60 w-full rounded-lg object-cover shadow-sm"
            />
          )}
        </div>
      </div>
      <div className="mt-5 flex items-center justify-around">
        <div
          className="flex cursor-pointer items-center space-x-3 text-gray-400"
          onClick={() => data && setCommentBoxVisible(!commentBoxVisible)}
        >
          <ChatAlt2Icon className="h-5 w-5" />
          <p>{comments.length}</p>
        </div>
        <div className="flex cursor-pointer items-center space-x-3 text-gray-400">
          <SwitchHorizontalIcon className="h-5 w-5" />
        </div>
        <div className="flex cursor-pointer items-center space-x-3 text-gray-400">
          <HeartIcon className="h-5 w-5" />
        </div>
        <div className="flex cursor-pointer items-center space-x-3 text-gray-400">
          <UploadIcon className="h-5 w-5" />
        </div>
      </div>

      {commentBoxVisible && (
        <form
          onSubmit={handleSubmitComment}
          className="mt-3 flex items-center space-x-3"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            type="text"
            placeholder="Write a comment..."
            className="w-full flex-1 rounded-md bg-gray-100 p-2 outline-none"
          />
          <button
            className="text-twitter disabled:text-gray-200"
            type="submit"
            disabled={!input}
          >
            Post
          </button>
        </form>
      )}

      {comments?.length > 0 && (
        <div className="my-2 mt-5 max-h-44 space-y-5 overflow-x-scroll border-t border-gray-100 p-5 scrollbar-hide">
          {comments.map((comment) => (
            <div key={comment._id} className="relative flex space-x-2">
              {comments?.length > 1 && (
                <hr className="absolute left-5 top-10 h-8 border-x border-gray-500/30" />
              )}
              <img
                src={comment.profileImg}
                alt={comment.username}
                className="mt-2 h-7 w-7 rounded-full object-cover"
              />
              <div>
                <div className="flex items-center space-x-1">
                  <p className="mr-1 font-bold">{comment.username}</p>
                  <p className="hidden text-sm text-gray-500 lg:inline">
                    @{comment.username.replace(/\s+/g, "").toLowerCase()} •
                  </p>
                  <TimeAgo
                    date={comment._createdAt}
                    className="text-sm text-gray-500 lg:inline"
                  />
                </div>
                <p>{comment.comment}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Tweet;
