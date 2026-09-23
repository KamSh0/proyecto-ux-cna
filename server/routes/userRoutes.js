import express from 'express';
import { admin_requestCreateNewUser, requestLogin, requestLogout } from '../controllers/userController';
import { requiresRole } from '../middlewares/RoleMiddleware';


const router = express.Router();

router.post('/api/user/login', requestLogin);
router.post('/api/user/logout', requestLogout);
router.post('/api/user/admin/create-new-user', requiresRole("ADMIN"), admin_requestCreateNewUser);

export default router;