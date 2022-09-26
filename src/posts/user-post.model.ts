import { Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import Sequelize from 'sequelize';
import User from '../users/models/users.model';
import Post from './posts.model';

export interface UserPostCreationAttrs {
  value: string;
}

@Table({ tableName: 'users-posts' })
class UserPost extends Model<UserPost, UserPostCreationAttrs> {
  @Column({ type: DataType.UUIDV4, defaultValue: Sequelize.UUIDV4, primaryKey: true })
  id: string;

  @ForeignKey(() => Post)
  @Column({ type: DataType.UUIDV4 })
  postId: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUIDV4 })
  userId: string;
}

export default UserPost;
