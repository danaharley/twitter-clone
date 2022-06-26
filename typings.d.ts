export interface Tweet extends TweetBody {
  _id: string;
  _createdAt: string;
  _updatedAt: string;
  rev: string;
  _type: "tweet";
  blockTweet: boolean;
}

interface TweetBody {
  text: string;
  username: string;
  profileImg: string;
  image?: string;
}

export interface Comment extends CommentBody {
  _id: string;
  _createdAt: string;
  _updatedAt: string;
  rev: string;
  _type: "comment";
  tweet: {
    _ref: string;
    _type: "reference";
  };
}

interface CommentBody {
  comment: string;
  tweetId: string;
  username: string;
  profileImg: string;
}
