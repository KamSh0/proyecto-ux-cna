import express from 'express';
import session from 'express-session';
import userRoutes from './server/routes/userRoutes.js';
import siteRoutes from './server/routes/siteRoutes.js';

const app = express();
const PORT = 3033;

app.use(express.json());
app.use(express.static('public'));
app.use(session({
    secret: 'VARSITY_ATHLETE',
    resave: false,
    saveUninitialized: false
}))

app.use(userRoutes);
app.use(siteRoutes);

app.listen(PORT, () => {
    console.log(`Servidor funcionando en http://localhost:${PORT}`);
})