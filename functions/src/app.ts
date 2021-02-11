import * as express from 'express';
import * as cors from 'cors';
import router from './routes';

const app = express();
app.use(cors({ origin: true }));
app.use('/', router);

export default app;