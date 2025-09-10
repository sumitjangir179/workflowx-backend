import express from 'express';
import cookieParser from 'cookie-parser';

const app = express();

app.use(express.json({limit: '16mb'}));
app.use(cookieParser())


// route declaration
import userRoutes from './routes/user.route.js';
import projectRoutes from './routes/project.route.js';
import taskRoutes from './routes/task.route.js';
import ApiError from './utils/ApiError.js';

app.use('/api/v1/users', userRoutes);
app.use('/api/v1/projects', projectRoutes);
app.use('/api/v1/tasks', taskRoutes);

export default app;

app.use((err, req, res, next) => {
    if(err instanceof ApiError){
        return res.status(err.statusCode).json({
            success: false,
            message: err.message
        });
    }

    return res.status(500).json({
        success: false,
        message: err.message
    });
})