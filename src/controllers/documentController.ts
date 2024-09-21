import { Request, Response, RequestHandler } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { Document } from '../models/Document';
import { DocumentVersion } from '../models/DocumentVersion';

interface JwtUserPayload extends JwtPayload {
  id: number;
}

// Create a new document
export const createDocument: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const { title, content } = req.body;
  const userId = (req.user as JwtUserPayload).id;

  try {
    const document = await Document.create({
      title,
      content,
      userId, // Get the authenticated user's ID
    });

    res.status(201).json(document);
  } catch (error) {
    res.status(500).json({ message: 'Error creating document', error });
  }
};

// Get all documents for the logged-in user
export const getDocuments = async (req: Request, res: Response) => {
  const userId = (req.user as JwtUserPayload).id;

  try {
    const documents = await Document.findAll({
      where: { userId },
    });
    res.status(200).json(documents);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving documents', error });
  }
};

// Get a single document by ID
export const getDocumentById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = (req.user as JwtUserPayload).id;

  try {
    const document = await Document.findOne({
      where: { id, userId },
    });

    if (!document) {
      return res.status(404).json({ message: 'Document not found.' });
    }

    res.status(200).json(document);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving document', error });
  }
};

// Update a document
export const updateDocument = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, content } = req.body;
  const userId = (req.user as JwtUserPayload).id;

  try {
    const document = await Document.findOne({
      where: { id, userId },
    });

    if (!document) {
      return res.status(404).json({ message: 'Document not found.' });
    }

    // Before updating, save the current state as a new version
    await DocumentVersion.create({
      title: document.title,
      content: document.content,
      documentId: document.id,
      userId, // Record who made the update
    });

    // Update the document with new data
    document.title = title || document.title;
    document.content = content || document.content;
    await document.save();

    res.status(200).json(document);
  } catch (error) {
    res.status(500).json({ message: 'Error updating document', error });
  }
};

// Delete a document
export const deleteDocument = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = (req.user as JwtUserPayload).id;

  try {
    const document = await Document.findOne({
      where: { id, userId },
    });

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    await document.destroy();
    res.status(200).json({ message: 'Document deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting document', error });
  }
};

// Get all versions of a document
export const getDocumentVersions = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const versions = await DocumentVersion.findAll({
      where: { documentId: id },
    });

    res.status(200).json(versions);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error retrieving document versions', error });
  }
};

// Restore a document to a specific version
export const restoreDocumentVersion = async (req: Request, res: Response) => {
  const { documentId, versionId } = req.params;
  const userId = (req.user as JwtUserPayload).id;

  try {
    // Find the document
    const document = await Document.findOne({
      where: { id: documentId, userId },
    });

    if (!document) {
      return res.status(404).json({ message: 'Document not found.' });
    }

    // Find the specific version to restore
    const version = await DocumentVersion.findOne({
      where: { id: versionId, documentId },
    });

    if (!version) {
      return res.status(404).json({ message: 'Version not found.' });
    }

    // Restore the document to this version
    document.title = version.title;
    document.content = version.content;
    await document.save();

    res.status(200).json(document);
  } catch (error) {
    res.status(500).json({ message: 'Error restoring document', error });
  }
};
