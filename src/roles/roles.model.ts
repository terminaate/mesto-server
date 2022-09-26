import { Column, DataType, Model, Table } from 'sequelize-typescript';
import Sequelize from 'sequelize';

export interface RoleCreationAttrs {
  value: string;
}

@Table({ tableName: 'roles' })
class Role extends Model<Role, RoleCreationAttrs> {
  @Column({ type: DataType.UUIDV4, defaultValue: Sequelize.UUIDV4, primaryKey: true })
  id: string;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  value: string;
}

export default Role;
