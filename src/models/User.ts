import { Model, DataTypes, Sequelize, Optional } from 'sequelize';
import bcrypt from 'bcryptjs';

interface UserAttributes {
  id?: number;
  name: string;
  email: string;
  password?: string; 
  createdAt?: Date;
  updatedAt?: Date;
}


interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number; 
  public name!: string;
  public email!: string;
  public password!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

 
  public async comparePassword(passwordAttempt: string): Promise<boolean> {
    if (!this.password) return false; 
    return bcrypt.compare(passwordAttempt, this.password);
  }


  public static associate(models: any) {
    
    User.hasMany(models.Movie, {
      foreignKey: 'userId', 
      as: 'movies',        
    });
  }
}


export const initUser = (sequelize: Sequelize) => {
  User.init(
    {
      
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false, 
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, 
        validate: {
          isEmail: true, 
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'), 
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'), 
      },
    },
    {
      
      sequelize,       
      tableName: 'Users', 
      modelName: 'User',  
      timestamps: true,   
      underscored: false, 
      hooks: {
        beforeCreate: async (user: User) => {
          if (user.password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
          }
        },
        
      },
      
      defaultScope: {
        attributes: { exclude: ['password'] }, 
      },
      scopes: {
        withPassword: { 
          attributes: { include: ['password'] },
        },
      },
    }
  );
  return User;
};

export default User; 

