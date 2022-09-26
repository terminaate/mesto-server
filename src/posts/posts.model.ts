import { BelongsToMany, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import Sequelize from 'sequelize';
import User from '../users/models/users.model';
import UserPost from './user-post.model';

export interface PostCreationAttrs {
  userId: string;
  title: string;
  description?: string;
  roles: string[];
}

@Table({ tableName: 'posts' })
class Post extends Model<Post, PostCreationAttrs> {
  @Column({ type: DataType.UUIDV4, defaultValue: Sequelize.UUIDV4, primaryKey: true })
  id: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUIDV4, allowNull: false })
  userId: string;

  @Column({ type: DataType.STRING, allowNull: false })
  title: string;

  @Column({ type: DataType.STRING, allowNull: true })
  description: string;

  @BelongsToMany(() => User, () => UserPost)
  likes: User[];
}

export default Post;
