class CommentDto {
  id: string;
  userId: string;
  postId: string;
  content: string;
  likes: string[];

  constructor(model) {
    this.id = model.id;
    this.userId = model.userId;
    this.postId = model.postId;
    this.content = model.content;
    this.likes = model.likes;
  }
}

export default CommentDto;
