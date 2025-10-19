import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';


export interface AuthRequest extends Request {
  userId?: string;
}

export const protect = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.warn('[AUTH] Tentativa de acesso sem token ou com formato inválido.');
    return res.status(401).json({ message: 'Acesso negado. Token não fornecido ou mal formatado.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('O segredo JWT não está configurado no servidor.');
    }
    
    const decoded = jwt.verify(token, jwtSecret) as { id: string };
    req.userId = decoded.id; 
    
    console.log(`[AUTH] Token válido. Acesso permitido para o usuário ID: ${req.userId}`);
    next(); 
  } catch (error) {
    console.warn('[AUTH] Token inválido ou expirado.');
    return res.status(401).json({ message: 'Token inválido ou expirado.' });
  }
};
