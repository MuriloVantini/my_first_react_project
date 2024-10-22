interface CommentModel{
    id:number;
    user_id:number;
    post_id?:number;
    description:string;
    created_at:string;
    updated_at:string;
    like_comments_count:number;
}

export default CommentModel;