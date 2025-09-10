import { DataTypes } from 'sequelize';
import { sequelize } from '../constants.js';

const TaskSchema = sequelize.define(
  'Task',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    tag:{
        type: DataTypes.STRING,
        allowNull: true,
        enum: ['feat', 'bug', 'chore', 'docs', 'style', 'refactor', 'test', 'ci', 'perf', 'build', 'revert'],
        defaultValue: 'feat'
    },

    status: {
        type: DataTypes.STRING,
        allowNull: false,
        enum: ['todo', 'in-progress', 'done', 'archived'],
        defaultValue: 'todo'
    },

    dueDate: {
        type: DataTypes.DATE,
        allowNull: true,
    },

    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
    },

    projectId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Projects',
        key: 'id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
    },
  },

  {
    timestamps: true,
  },
);

export default TaskSchema;
