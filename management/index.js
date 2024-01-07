import express from 'express';
import cors from 'cors';
import Store from './store.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/photos', (req, res) => {
  const photos = Store.read();
  res.send(photos);
});

app.delete('/delete', async (req, res) => {
  const { id, photoId } = req.query;

  const photos = Store.read();

  const photo = photos[photoId];

  // deletes that specific review
  if (photo) {
    photo.reviews = photo.reviews.filter(r => r.id !== id); 
    Store.write(photos);
  }

  Store.write(photos);
  await emitDeleteEvent(id, photoId);
  res.send({ status: 'OK' });
});

const emitDeleteEvent = async (id, photoId) => {
  try { 
    await fetch('http://event-bus:4004/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'ReviewDeleted',
        data: {
          id, photoId
        }
      }),
    });
  } catch (err) {
    console.log(`(${process.pid}) management Service: ${err}`);
    res.status(500).send({
      status: 'ERROR',
      message: err,
    });
  }
};

app.post('/events', (req, res) => {
  const { type, data } = req.body;
  const photos = Store.read();

  if (type === 'PhotoCreated') {
    const { title, description, imageID } = data;
    photos[imageID] = {title, description, reviews: []};
  }

  if (type === 'ReviewCreated') {
    const { id, content, rating, photoId } = data;
    const photo = photos[photoId];
    photo.reviews.push({ id, content, rating });
  }

  Store.write(photos);

  res.send({ status: 'OK' });
});


app.listen(4002, () => {
  console.log('Listening on 4002');
});
