import { MongoClient, GridFSBucket } from 'mongodb';

const url = 'mongodb://admin:secret@photos-db:27017';
// NOTE: Testing db
// const url = 'mongodb://localhost:27017';

const client = new MongoClient(url);
const dbName = 'photos';
let photos;

const photoCollection = async () => {
  if (!photos) {
    await client.connect();
    const db = client.db(dbName);
    photos = db.collection('infos');
  }
  return photos;
};

const read = async () => {
  try {
    const collection = await photoCollection();
    const docs = await collection.find({}).toArray();
    return docs || [];
  } catch (err) {
    console.log(err);
  }
};

const write = async (photo) => {
  try {
    const collection = await photoCollection();
    await collection.insertOne(photo);
  } catch (err) {
    console.log(err);
  }
};

const gfs = new GridFSBucket(client.db(dbName));

export default {
  dbName,
  read,
  write,
  gfs,
  client
};

