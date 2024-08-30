import express from 'express';
import { uploadService } from './services/upload';

const app = express();

const PORT = process.env.PROT || 5000;

app.use(express.json({ limit: '50mb' }));

app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.post('/upload', uploadService);

app.listen(PORT, () =>{
    console.log(`Server is running on ${PORT}`);
});
