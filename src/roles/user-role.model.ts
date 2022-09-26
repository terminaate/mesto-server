import { Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import Sequelize from 'sequelize';
import User from '../users/models/users.model';
import Role from './roles.model';

export interface UserRoleCreationAttrs {
  value: string;
}

@Table({ tableName: 'users-roles' })
class UserRole extends Model<UserRole, UserRoleCreationAttrs> {
  @Column({ type: DataType.UUIDV4, defaultValue: Sequelize.UUIDV4, primaryKey: true })
  id: string;

  @ForeignKey(() => Role)
  @Column({ type: DataType.UUIDV4 })
  roleId: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUIDV4 })
  userId: string;
}

export default UserRole;
