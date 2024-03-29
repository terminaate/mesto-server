class PostDto {
  id: string;
  userId: string;
  likes: string[];
  comments: string[];

  constructor(model) {
    this.id = model.id;
    this.userId = model.userId;
    this.likes = model.likes;
    this.comments = model.comments;
  }
}

export default PostDto;
