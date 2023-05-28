import express from 'express';
import router from './router';
import { protect } from './modules/auth';
import { createUser, login } from './handlers/user';

const app = express();

app.use(express.json())

app.get('/', (req, res) => {
    res.status(200);
    res.json({
        message: 'success',
    })
});

app.use('/api', protect, router);

app.post('/signup', createUser);
app.post('/login', login);

export default app;