import express from 'express';
import mongo from 'mongodb';
import multer from 'multer';
import store from './store.js';
import bodyParser from 'body-parser';
import { Readable } from 'stream';
import cors from 'cors'; 
import morgan from 'morgan';
import winston from 'winston';

// MongoDB URI and Database name
const { client, gfs, dbName, read, write } = store;
const { ObjectId } = mongo;

// Init express app
const app = express();

// Set up multer for file handling
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Middleware usage
app.use(cors());
app.use(morgan('tiny'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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

// Route to fetch photos
app.get('/photos', async (req, res) => {
  try {
    // Get photos from DB
    const db = client.db(dbName);
    const collection = db.collection('fs.files');
    const photos = await collection.find().toArray();  
    
    // Successfully fetch fs.files collection through JSON
    res.json(photos);
    logger.info('GET /photos Successfully retrieved photos');
  } catch (error) {     // Log error
    res.status(500).send(error); 
    logger.error('Failed to retrieve photo. Internal server error: ', error);
  }
});

// Route to handle GET request for a specific image by ID
app.get('/photos/:id', async (req, res) => {
  try {
    // Convert string ID to MongoDB ObjectID
    const imageId = new ObjectId(req.params.id); 
    const db = client.db(dbName);

    // Get image file by imageId
    const file = await db.collection('fs.files').findOne({ _id: imageId });
    const readStream = gfs.openDownloadStream(imageId);

    // Check if file exists
    if (!file) 
      return res.status(404).send('File not found');
    
    
    // Set the proper content type before streaming the image
    res.set('Content-Type', file.contentType);
    readStream.pipe(res);
    logger.info('GET /photos/:id Successfully read photo.');
  
  } catch (error) {
    res.status(500).send(error); 
    logger.error('Failed to read specific photo. Internal server error: ', error);
  }
});

// Route to handle GET request for info of specific image by ID
app.get('/photos/:id/info', async (req, res) => {
  try {
    // Get photos' info from DB based on photoId
    const photoId = req.params.id;
    let retrieveInfo = await read();
    const photoInfo = retrieveInfo.find(p => p.imageID.equals(photoId));
    
    // Check if photoInfo data is existing
    if (!photoInfo) 
      return res.status(404).send('Photo Info not found');
    
    // Send object of photo info
    res.json({
      title: photoInfo.title, 
      description: photoInfo.description
    });
  
    logger.info('GET /photos/:id/info Successfully retrieved specific photo info');
  } catch (error) {
    res.status(500).send(error); 
    logger.error('Failed to retrieve specific photo info. Internal server error:', error);
  }
});

// Upload image
app.post('/photos', upload.single('image'), async (req, res) => {
  try {
    // Check if file has been uploaded
    if (!req.file) 
      return res.status(400).send('No file uploaded.');

    // Upload image to GridFS
    const readableStream = new Readable();
    readableStream.push(req.file.buffer);
    readableStream.push(null); 

    // Readable stream wih requested file
    let uploadStream = gfs.openUploadStream(req.file.originalname); 
    readableStream.pipe(uploadStream);
    
    // Error handling on uploads
    uploadStream.on('error', () => {
      logger.error('Error occurred while uploading');
      return res.status(500).send('Error occurred while uploading');
    });

    uploadStream.on('finish', async () => {
      // Get title and description 
      const { title, description } = req.body;

      // Save as object to photos collection
      const photoInfo = {
        title,
        description,
        imageID: uploadStream.id
      };

      // Save to database
      await write(photoInfo);

      // Emit event
      await emitPhotoCreatedEvent(photoInfo);

      // Successfully send data through JSON and log it
      res.json(photoInfo);
      logger.info('POST /photos Successfully upload photo');
      console.log(`(${process.pid}) Photos Service: ${JSON.stringify(photoInfo)}`);
    });
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal Server Error');
    logger.info('Internal Server Error: ', error);
  }
});


// Emit photo created event to other services 
const emitPhotoCreatedEvent = async (photo) => {
  try { 
    await fetch('http://event-bus:4004/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'PhotoCreated',
        data: photo
      })
    });
  } catch (error) {
    console.log(error);
  }
};

// POST event from request
app.post('/events', async (req, res) => {
  const event = req.body;
  const type = event.type;
  console.log(`(${process.pid}) Photos Service Received Event: ${type}`);
  res.send({});
});

app.listen(4000, () => {
  console.log(`(${process.pid}) Photos Service: Listening on 4000`);
});