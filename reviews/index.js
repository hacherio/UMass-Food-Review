import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import winston from 'winston'; 
import { randomBytes } from 'crypto';
import Store from './store.js';

// Initialize MongoDB on script load
Store.init();

const app = express();

app.use(cors());
app.use(morgan('tiny'));
app.use(express.json());

// Winston file logging
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.simple()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'app.log' })
  ]
});  

app.get('/photos/:id/reviews', async (req, res) => {
  try {

    const photoId = req.params.id;
    const reviews = await Store.read();

    // Filter reviews by photoId
    const filterRev = reviews.filter(r => r.photoId === photoId);
    const avgRating = await Store.readRatings(photoId);
    
    logger.info('GET /photos/:id/reviews');
    res.send({ reviews: filterRev, averageRating: avgRating });
  } catch (error) {
    logger.error('Error getting reviews: ', error);
    res.status(500).send('Error getting reviews'); 
  }
});

app.post('/photos/:id/reviews', async (req, res) => {
  try {
    const photoId = req.params.id;
    const { content, rating } = req.body;
    
    // create Ids for reviewers
    const id = randomBytes(4).toString('hex');

    // Store new reviews
    const reviews = await Store.read();
    const newReview = { id, content, rating, photoId };

    reviews.push(newReview);

    await Store.writeRating(photoId, id, rating);
    await Store.write(reviews);

    // emit event
    emitReviewCreatedEvent(newReview);

    logger.info('POST /photos/:id/reviews - Review created');
    res.status(201).send(newReview);
  } catch (error) {
    logger.error('Error creating review: ', error);
    res.status(500).send('Error creating review');
  }
});


const emitReviewCreatedEvent = async (review) => {
  try {
    await fetch('http://event-bus:4004/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },  
      body: JSON.stringify({
        type: 'ReviewCreated',
        data: review
      })
    });
  } catch (err) {
    console.log(`(${process.pid}) Review Service: ${err}`);
  }
}

app.post('/events', async (req, res) => {
  const event = req.body;
  const type = event.type;

  if (type === 'ReviewDeleted') {
    const { id, photoId } = event.data;
    let reviews = await Store.read();

    // Filter out deleted review
    reviews = reviews.filter(r => !(r.id === id && r.photoId === photoId));
    await Store.write(reviews);
  }

  console.log(`(${process.pid}) Review Service Received Event: ${type}`);
  res.send({});
});


app.listen(4001, () => {
  console.log(`(${process.pid}) Review Service: Listening on 4001`);
});




