import { Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import Sequelize from 'sequelize';
import User from './users.model';

export interface UserTokenCreationAttrs {
  userId: string;
  accessToken: string;
  refreshToken: string;
}

@Table({ tableName: 'users-tokens' })
class UserToken extends Model<UserToken, UserTokenCreationAttrs> {

  @Column({ type: DataType.UUIDV4, defaultValue: Sequelize.UUIDV4, primaryKey: true })
  id: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUIDV4, unique: true, allowNull: false })
  userId: string;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  accessToken: string;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  refreshToken: string;

}

export default UserToken;
