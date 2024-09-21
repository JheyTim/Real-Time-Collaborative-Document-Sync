import { Request, Response, RequestHandler } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { Document } from '../models/Document';

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
