export class PostDTO {
  public content: string;

  constructor(model) {
    this.content = model.content;
  }
}
