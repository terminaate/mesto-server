import { BelongsToMany, Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import Sequelize from 'sequelize';
import User from '../users/models/users.model';
import UserRole from './user-role.model';

export interface RoleCreationAttrs {
  value: string;
}

@Table({ tableName: 'roles' })
class Role extends Model<Role, RoleCreationAttrs> {
  @Column({ type: DataType.UUIDV4, defaultValue: Sequelize.UUIDV4, primaryKey: true })
  id: string;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  value: string;

  @BelongsToMany(() => User, () => UserRole)
  users: User[]
}

export default Role;
