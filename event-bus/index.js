import express from 'express';
import logger from 'morgan';

const app = express();

app.use(logger('dev'));
app.use(express.json());

const servicePorts = [
  { name: 'photos', port: 4000 },
  { name: 'reviews', port: 4001 },
  { name: 'management', port: 4002 },
];

app.post('/events', async (req, res) => {
  const event = req.body;

  console.log(`(${process.pid}) Event Bus (Received Event) ${event.type}`);

  for (const { name, port } of servicePorts) {
    try {
      console.log(
        `(${process.pid}) Event Bus (Sending Event to ${port}) ${event.type}`
      );

      await fetch(`http://${name}:${port}/events`, {
        method: 'POST',
        body: JSON.stringify(event),
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (err) {
      console.log(err);
    }
  }

  res.send({ status: 'OK' });
});

app.listen(4004, () => {
  console.log(`(${process.pid}) Event Bus Listening on 4004`);
});
