import React, {
  Dispatch,
  MouseEvent,
  SetStateAction,
  useRef,
  useState,
} from "react";
import {
  CalendarIcon,
  EmojiHappyIcon,
  LocationMarkerIcon,
  PhotographIcon,
  SearchCircleIcon,
} from "@heroicons/react/outline";
import { useSession } from "next-auth/react";
import { Tweet, TweetBody } from "../typings";
import { fetchTweets } from "../utils/fetchTweets";
import toast from "react-hot-toast";

interface Props {
  setTweets: Dispatch<SetStateAction<Tweet[]>>;
}

function TweetBox({ setTweets }: Props) {
  const [input, setInput] = useState<string>("");
  const { data } = useSession();
  const [boxImgIsOpen, setBoxImgIsOpen] = useState<boolean>(false);
  const [image, setImage] = useState<string>("");

  const ref = useRef<HTMLInputElement>(null);

  const addImgToTweet = (
    e: React.MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) => {
    e.preventDefault();

    if (!ref.current?.value) return;
    setImage(ref.current.value);

    ref.current.value = "";
    setBoxImgIsOpen(false);
  };

  const postTweet = async () => {
    const tweetBody: TweetBody = {
      text: input,
      username: data?.user?.name || "Unknown User",
      profileImg:
        data?.user?.image ||
        "https://images.unsplash.com/photo-1481437642641-2f0ae875f836?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
      image: image,
    };

    const result = await fetch(`/api/addTweet`, {
      method: "POST",
      body: JSON.stringify(tweetBody),
    });

    const json = await result.json();

    const newTweet = await fetchTweets();
    setTweets(newTweet);

    toast("Boom!!! Tweet Posted!", {
      icon: "🚀",
    });

    return json;
  };

  const handleSubmit = (
    e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) => {
    e.preventDefault();

    postTweet();

    setInput("");
    setImage("");
    setBoxImgIsOpen(false);
  };

  return (
    <div className="flex space-x-2 p-5">
      <img
        src={
          data?.user?.image ||
          "https://images.unsplash.com/photo-1481437642641-2f0ae875f836?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
        }
        alt={data?.user?.name || "avatar"}
        className="mt-4 h-14 w-14 rounded-full object-cover"
      />
      <div className="flex flex-1 items-center pl-2">
        <form className="flex flex-1 flex-col">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            type="text"
            className="h-24 w-full text-xl text-slate-500 outline-none placeholder:text-xl"
            placeholder="What's happening?..."
          />
          <div className="flex items-center">
            <div className="flex flex-1 items-center space-x-2 text-twitter">
              <PhotographIcon
                onClick={() => setBoxImgIsOpen(!boxImgIsOpen)}
                className="h-5 w-5 cursor-pointer transition-transform duration-150 ease-out hover:scale-150"
              />
              <SearchCircleIcon className="h-5 w-5" />
              <EmojiHappyIcon className="h-5 w-5" />
              <CalendarIcon className="h-5 w-5" />
              <LocationMarkerIcon className="h-5 w-5" />
            </div>
            <button
              onClick={handleSubmit}
              className="rounded-full bg-twitter py-2 px-5 font-bold text-white disabled:opacity-40"
              disabled={!input || !data}
            >
              Tweet
            </button>
          </div>
          {boxImgIsOpen && (
            <form className="mt-5 flex rounded-lg bg-twitter/80 py-2 px-4">
              <input
                ref={ref}
                type="text"
                className="w-full flex-1 bg-transparent text-white outline-none placeholder:text-white"
                placeholder="Enter image url..."
              />
              <button
                type="submit"
                onClick={addImgToTweet}
                className="mx-3 font-bold text-white transition-all duration-150 ease-out hover:rounded-md hover:bg-white hover:px-1 hover:text-twitter"
              >
                Add Image
              </button>
            </form>
          )}
          {image && (
            <img
              src={image}
              alt="new"
              className="mt-10 h-40 w-full rounded object-contain shadow"
            />
          )}
        </form>
      </div>
    </div>
  );
}

export default TweetBox;
