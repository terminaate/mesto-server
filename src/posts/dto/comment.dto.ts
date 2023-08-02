export class CommentDTO {
  public id: string;
  public userId: string;
  public postId: string;
  public content: string;
  public likes: string[];

  constructor(model) {
    this.id = model.id;
    this.userId = model.userId;
    this.postId = model.postId;
    this.content = model.content;
    this.likes = model.likes;
  }
}
