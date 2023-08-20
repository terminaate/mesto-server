import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { UserDTO } from './dto/user.dto';
import { FilesService } from '../files/files.service';
import { UsersException } from './users.exception';
import { PatchUserDTO } from './dto/patch-user.dto';
import { UsersRepository } from './users.repository';
import { OrFilter } from '../common/types/OrFilter';

@Injectable()
export class UsersService {
  constructor(
    private filesService: FilesService,
    private usersRepository: UsersRepository,
  ) {}

  public async getUserByIdent(ident: string): Promise<UserDTO> {
    const filter: OrFilter = {
      $or: [{ username: ident }],
    };
    if (Types.ObjectId.isValid(ident)) {
      filter.$or.push({ _id: ident });
    }

    const user = await this.usersRepository.findUserByFilter(filter);
    if (!user) {
      throw UsersException.UserNotExist();
    }

    return new UserDTO(user);
  }

  public async patchUser(userId: string, patchUserDTO: PatchUserDTO): Promise<UserDTO> {
    if (!userId) {
      throw UsersException.UserIdNotExist();
    }

    const user = await this.usersRepository.findUserById(userId);
    if (!user) {
      throw UsersException.UserIdNotExist();
    }

    if (patchUserDTO.avatar && this.filesService.validateImage(patchUserDTO.avatar)) {
      this.filesService.writeUserAvatar(userId, patchUserDTO.avatar);
      patchUserDTO.avatar = `/static/${userId}/avatar`;
    } else if (patchUserDTO.avatar === null) {
      this.filesService.deleteUserAvatar(userId);
      patchUserDTO.avatar = null;
    }

    await user.updateOne(patchUserDTO);
    return { ...new UserDTO(user), ...patchUserDTO };
  }

  public async deleteUser(userId: string): Promise<UserDTO> {
    const user = await this.usersRepository.findUserById(userId);
    if (!user) {
      throw UsersException.UserIdNotExist();
    }

    await this.usersRepository.deleteUserTokenByUserId(userId);
    await user.deleteOne();

    this.filesService.deleteUserFolder(userId);
    return new UserDTO(user);
  }

  public async findUsersByUserName(username: string): Promise<UserDTO[]> {
    if (!username) {
      return [];
    }
    return (await this.usersRepository.findUsers({ username: new RegExp(username, 'i') })).map((user) => new UserDTO(user));
  }
}
