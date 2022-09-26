import { BelongsToMany, Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import Sequelize from 'sequelize';
import Role from '../../roles/roles.model';
import UserRole from '../../roles/user-role.model';
import Post from '../../posts/posts.model';
import UserPost from '../../posts/user-post.model';

export interface UserCreationAttrs {
  email?: string;
  login: string;
  username: string;
  bio?: string;
  password: string;
  roles: Role[];
}

@Table({ tableName: 'users' })
class User extends Model<User, UserCreationAttrs> {
  @Column({ type: DataType.UUIDV4, defaultValue: Sequelize.UUIDV4, primaryKey: true })
  id: string;

  @Column({ type: DataType.STRING })
  email?: string;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  login: string;

  @Column({ type: DataType.STRING })
  username: string;

  @Column({ type: DataType.STRING })
  bio?: string;

  @Column({ type: DataType.STRING, allowNull: false })
  password: string;

  @BelongsToMany(() => Role, () => UserRole)
  roles: Role[];

  @BelongsToMany(() => Post, () => UserPost)
  posts: Post[];
}

export default User;