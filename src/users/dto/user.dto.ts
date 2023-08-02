export class UserDTO {
  public id: string;
  public email?: string;
  public username: string;
  public bio?: string;

  constructor(model, isSelfUser = true) {
    this.id = model.id;
    if (isSelfUser) {
      this.email = model.email;
    }
    this.username = model.username;
    this.bio = model.bio;
  }
}
