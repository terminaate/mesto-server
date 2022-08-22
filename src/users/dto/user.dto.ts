import { UserDocument } from '../models/users.model';

class UserDto {
  id: string;
  email?: string;
  username: string;
  bio?: string;

  constructor(model: UserDocument) {
    this.id = model.id;
    this.email = model.email;
    this.username = model.username;
    this.bio = model.bio;
  }
}

export default UserDto;
