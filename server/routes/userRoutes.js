import express from 'express';
import { admin_requestCreateNewUser, admin_requestUpdateUser, requestGetActiveUser, requestLogin, requestLogout } from '../controllers/userController.js';
import { requiresRole, requiresPermission } from '../middlewares/roleMiddleware.js';


const router = express.Router();

// Session control
router.post('/api/user/login', requestLogin);
router.post('/api/user/logout', requestLogout);
router.get('/api/user/get-active-user', requestGetActiveUser);

// Admin user management actions
router.post('/api/user/admin/create-new-user', requiresPermission('user', 'write'), admin_requestCreateNewUser);
router.post('/api/user/admin/update-user', requiresPermission('user', 'write'), admin_requestUpdateUser);

export default router;