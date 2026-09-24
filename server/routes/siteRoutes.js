import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { requiresRole } from '../middlewares/roleMiddleware.js';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const protectedRoot = path.join(__dirname, '../protected');

// Carpetas completas protegidas por rol — express.static ya bloquea path traversal
router.use('/professor', requiresRole('PROFESSOR'), express.static(path.join(protectedRoot, '_professor')));
router.use('/student', requiresRole('STUDENT'), express.static(path.join(protectedRoot, '_student')));
router.use('/admin', requiresRole('ADMIN'), express.static(path.join(protectedRoot, '_admin')));

// Páginas de entrada individuales (si quieres mantenerlas como punto de entrada separado)
router.get('/professor.html', requiresRole('PROFESSOR'), (req, res) => {
    res.sendFile(path.join(protectedRoot, 'professor.html'));
});

router.get('/student.html', requiresRole('STUDENT'), (req, res) => {
    res.sendFile(path.join(protectedRoot, 'student.html'));
});

router.get('/admin.html', requiresRole('ADMIN'), (req, res) => {
    res.sendFile(path.join(protectedRoot, 'admin.html'));
});

export default router;