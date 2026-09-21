import express from 'express';
import { admin_requestCreateNewUser, requestLogin, requestLogout } from '../controllers/userController';


const router = express.Router();

router.post('/api/user/login', requestLogin);
router.post('/api/user/logout', requestLogout);
router.post('/api/user/admin/create-new-user', admin_requestCreateNewUser);

export default router;