class UserDto {
  id: string;
  email?: string;
  username: string;
  bio?: string;

  constructor(model, isSelfUser = true) {
    this.id = model.id;
    if (isSelfUser) {
      this.email = model.email;
    }
    this.username = model.username;
    this.bio = model.bio;
  }
}

export default UserDto;
