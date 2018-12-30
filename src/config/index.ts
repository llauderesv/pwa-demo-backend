import MongodbModel from '../models/mongodb';

const mongoDBConfig: MongodbModel = {
  url: 'mongodb://localhost:27017',
  database: 'pwa-demo',
};

export { mongoDBConfig };
