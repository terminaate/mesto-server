class PostDto {
  id: string;
  userId: string;
  title: string;
  description?: string;

  constructor(model) {
    this.id = model.id;
    this.userId = model.userId;
    this.title = model.title;
    this.description = model.description;
  }

}

export default PostDto;