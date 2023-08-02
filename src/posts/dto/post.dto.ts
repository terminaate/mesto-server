export class PostDTO {
  public id: string;
  public userId: string;
  public likes: string[];
  public comments: string[];

  constructor(model) {
    this.id = model.id;
    this.userId = model.userId;
    this.likes = model.likes;
    this.comments = model.comments;
  }
}
