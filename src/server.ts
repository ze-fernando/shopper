import express from 'express';
import { uploadService } from './services/upload';

const app = express();

app.use(express.json({ limit: '50mb' }));

app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.post('/upload', uploadService);

app.listen(5000, () =>{
    console.log('server is running');
});
