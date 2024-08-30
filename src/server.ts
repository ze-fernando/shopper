import express from 'express';
import { uploadService } from './controllers/upload';
import { route } from './routes/imageRouter';

const app = express();

const PORT = process.env.PROT || 5000;

app.use(express.json({ limit: '50mb' }));

app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use(route);

app.listen(PORT, () =>{
    console.log(`Server is running on ${PORT}`);
});
