import { Router } from 'express';
import uploadController from '../controllers/upload';
import confirmController from '../controllers/confirm';
import listByCodeController from '../controllers/listByCode';

export const route = Router();

route.post('/upload', uploadController);
route.patch('/confirm', confirmController);
route.get('/:code/list', listByCodeController);