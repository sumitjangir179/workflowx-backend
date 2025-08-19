import express from 'express';

const app = express();

app.use(express.json({limit: '16mb'}));


// route declaration
import userRoutes from './routes/user.route.js';

app.use('/api/v1/users', userRoutes);

export default app;