import { UserDocument } from '../models/users.model';

class UserDto {
  email?: string;
  username: string;
  bio?: string;

  constructor(model: UserDocument) {
    this.email = model.email;
    this.username = model.username;
    this.bio = model.bio;
  }
}

export default UserDto;