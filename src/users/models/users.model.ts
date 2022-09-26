import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import Sequelize from 'sequelize';
import Role from '../../roles/roles.model';

export interface UserCreationAttrs {
  userId: string;
  accessToken: string;
  refreshToken: string;
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

  @HasMany(() => Role)
  roles: Role[];
}

export default User;