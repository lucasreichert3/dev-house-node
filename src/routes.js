import { Router } from 'express';
import multer from 'multer';
import SessionController from './controllers/SessionController';
import HouseController from './controllers/HouseController';
import DashboardController from './controllers/DashboardController';
import ReservationController from './controllers/ReservationController';
import updloadConfig from './config/upload';

const routes = new Router();
const upload = multer(updloadConfig);

routes.post('/session', SessionController.store);

routes.post('/houses', upload.single('thumbnail'), HouseController.store);
routes.get('/houses', HouseController.index);
routes.put('/houses/:id', upload.single('thumbnail'), HouseController.update);
routes.delete('/houses', HouseController.destroy);

routes.get('/dashboard', DashboardController.show);

routes.post('/houses/:house_id/reservation', ReservationController.store);
routes.get('/reservations', ReservationController.index);
routes.delete('/reservations/cancel', ReservationController.destroy);

export default routes;
