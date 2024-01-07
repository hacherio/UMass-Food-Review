import fs from 'fs/promises'; // for async file reading/writing
import path from 'path';
import { MongoClient } from 'mongodb';
import { fileURLToPath } from 'url';

const url = 'mongodb://admin:secret@photos-db:27017';
// NOTE: Testing db
// const url = 'mongodb://localhost:27017';

const dbName = 'photos';
const client = new MongoClient(url);
let db;
let ratingsCollection;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const reviewsFilePath = path.join(__dirname, 'reviews.json');

// Initialize and connect to MongoDB
const init = async () => {
  try {
    await client.connect();
    db = client.db(dbName);
    ratingsCollection = db.collection('ratings');
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err);
  }
};

// MongoDB methods
const readAvgRatings = async (photoId) => {
  try {
    const ratings = await ratingsCollection.find({ photoId }).toArray();
    if (ratings.length === 0) return 0;

    // calculate average 
    const total = ratings.reduce((acc, rating) => acc + rating.rating, 0);  
    const avg = total / ratings.length;

    // round average to 2 decimals
    const roundedAvg = Math.round(avg * 100) / 100;
    return roundedAvg;

  } catch (err) {
    console.error('Error calculating average rating:', err);
    return 0;
  }
};

const readRatings = async (photoId) => {
  return await readAvgRatings(photoId);
};

const writeRating = async (photoId, id, rating) => {
  try {
    // round rating to 2 decimals
    const roundedRating = Math.round(rating * 100) / 100;

    await ratingsCollection.insertOne({ 
      id, photoId, rating: roundedRating 
    });
    await ratingsCollection.insertOne({ id, photoId, rating });
  } catch (err) {
    console.error('Error writing rating to MongoDB:', err);
  }
};

// Methods for JSON storing
const read = async () => {
  try {
    try {
      await fs.access(reviewsFilePath);
    } catch {
      return []; // Return an empty array if file does not exist
    }

    const reviewsData = await fs.readFile(reviewsFilePath, 'utf8');
    return JSON.parse(reviewsData);
  } catch (err) {
    console.error('Error reading reviews:', err);
    return [];
  }
};
const write = async (reviews) => {
  try {
    await fs.writeFile(reviewsFilePath, JSON.stringify(reviews), 'utf8');
  } catch (err) {
    console.error('Error writing reviews:', err);
  }
};

export default {
  read,
  write,
  readRatings,
  writeRating,
  init
};


