import { Router } from 'express';
import { authenticateJWT } from '../middlewares/authMiddleware';
import {
  createDocument,
  getDocuments,
  getDocumentById,
  updateDocument,
  deleteDocument,
  getDocumentVersions,
  restoreDocumentVersion,
} from '../controllers/documentController';

const router = Router();

// All routes are protected with JWT
router.post('/documents', authenticateJWT, createDocument);
router.get('/documents', authenticateJWT, getDocuments);
router.get('/documents/:id', authenticateJWT, getDocumentById);
router.put('/documents/:id', authenticateJWT, updateDocument);
router.delete('/documents/:id', authenticateJWT, deleteDocument);

// Version control routes
router.get('/documents/:id/versions', authenticateJWT, getDocumentVersions);
router.post(
  '/documents/:documentId/versions/:versionId/restore',
  authenticateJWT,
  restoreDocumentVersion
);

export default router;
