export class UserDTO {
  public id: string;
  public email?: string;
  public username: string;
  public bio?: string;
  public avatar?: string;

  constructor(model, isSelfUser = false) {
    this.id = model.id;
    if (isSelfUser) {
      this.email = model.email;
    }
    this.username = model.username;
    this.bio = model.bio;
    this.avatar = model.avatar;
  }
}
