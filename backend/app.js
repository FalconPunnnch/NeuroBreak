import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import userRoutes from './scr/routes/userRoutes.js';
import productRoutes from './scr/routes/productRoutes.js';
import productCategoryRoutes from './scr/routes/productCategoryRoutes.js' 
import './scr/models/index.js'; 

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
    return res.json({ result: 'LA ACARREADA FUNCIONA'})
});

app.use('/products', productRoutes);
app.use('/productCategory', productCategoryRoutes);
app.use('/user', userRoutes);


export default app;