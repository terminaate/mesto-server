class PostDto {
  id: string;
  userId: string;
  title: string;
  description?: string;
  likes: string[];

  constructor(model) {
    this.id = model.id;
    this.userId = model.userId;
    this.title = model.title;
    this.description = model.description;
    this.likes = model.likes;
  }

}

export default PostDto;