import express from 'express';

const app = express();

app.get('/', (req, res) => {
    res.status(200);
    res.json({
        message: 'success',
    })
});

export default app;