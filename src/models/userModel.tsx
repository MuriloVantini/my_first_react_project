import CommentModel from "./commentModel";
import PostModel from "./postModel";

interface UserModel {
  id: number;
  name: string;
  email: string;
  like_posts?: PostModel[];
  comments?: CommentModel[];
  updateUser?: (
    id: number,
    name: string,
    email: string,
    like_posts?: PostModel[],
    comments?: CommentModel[]
  ) => void;
}

export default UserModel;
