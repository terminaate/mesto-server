class PostDto {
  id: string;
  title: string;
  description?: string;

  constructor(model) {
    this.id = model.id;
    this.title = model.title;
    this.description = model.description;
  }

}

export default PostDto;