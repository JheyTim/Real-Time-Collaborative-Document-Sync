import { Sequelize } from 'sequelize-typescript';
import { User } from './User';
import { Document } from './Document';
import { DocumentVersion } from './DocumentVersion';

const sequelize = new Sequelize({
  dialect: 'mysql',
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  models: [User, Document, DocumentVersion], // Load models here
});

export default sequelize;
