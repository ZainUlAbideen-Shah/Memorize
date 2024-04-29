import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

import postRoutes from './routes/posts.js';
import userRoutes from './routes/user.js';

const __dirname = path.resolve();

const app = express();

app.use(bodyParser.json({ limit: '30mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));
app.use(cors());
dotenv.config();

const PORT = process.env.PORT || 5000;

main().catch(err => console.log(err));
async function main() {
    await mongoose.connect(process.env.CONNECTION_URL)
};
main().then(
    () => { app.listen(PORT, () => { console.log(`Server running on port: ${PORT}`) }) }
);

app.use('/posts', postRoutes);
app.use('/user', userRoutes);

app.use(express.static(path.join(__dirname, '/client/dist')));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

