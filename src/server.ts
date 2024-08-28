import express from 'express';
import { uploadService } from './services/upload';

const app = express();

app.post('/upload', uploadService);

app.listen(5000, () =>{
    console.log('server is running');
});