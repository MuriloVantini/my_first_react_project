import ChapterModel from "./chapterModel";

interface PostModel {
    id: number;
    created_at: string;
    updated_at: string;
    title: string;
    caption: string;
    description: string;
    image: string;
    like_posts_count: number;
    access_count: number;
    chapters: ChapterModel[]
}

export default PostModel;