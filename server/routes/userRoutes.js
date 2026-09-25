import express from 'express';
import { admin_requestCreateNewUser, requestGetActiveUser, requestLogin, requestLogout } from '../controllers/userController.js';
import { requiresRole } from '../middlewares/roleMiddleware.js';


const router = express.Router();

router.post('/api/user/login', requestLogin);
router.post('/api/user/logout', requestLogout);
router.get('/api/user/get-active-user', requestGetActiveUser);
router.post('/api/user/admin/create-new-user', requiresRole("ADMIN"), admin_requestCreateNewUser);

export default router;