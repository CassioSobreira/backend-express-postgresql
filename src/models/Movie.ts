import { Model, DataTypes, Sequelize, Optional } from 'sequelize';

export interface MovieAttributes {
  id?: number;
  title: string;
  director?: string | null;
  year?: number | null;
  genre?: string | null;
  rating?: number | null;
  userId: number;
  createdAt?: Date;
  updatedAt?: Date;
}


export interface MovieCreationAttributes extends Optional<MovieAttributes, 'id' | 'director' | 'year' | 'genre' | 'rating' | 'createdAt' | 'updatedAt'> {}

class Movie extends Model<MovieAttributes, MovieCreationAttributes> implements MovieAttributes {
  public id!: number;
  public title!: string;
  public director!: string | null;
  public year!: number | null;
  public genre!: string | null;
  public rating!: number | null;
  public userId!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static associate(models: any) {
    Movie.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
      onDelete: 'CASCADE',
    });
  }
}

export const initMovie = (sequelize: Sequelize) => {
  Movie.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      director: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      year: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      genre: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      rating: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
          min: 1,
          max: 10,
        }
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
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
      tableName: 'Movies',
      modelName: 'Movie',
      timestamps: true,
      underscored: false,
    }
  );
  return Movie;
};

export default Movie;

