import { Request, Response } from 'express';
import * as authService from '../services/authService';


export const register = async (req: Request, res: Response): Promise<Response> => {
  try {
    console.log(`[AUTH] Tentativa de registro para o e-mail: ${req.body.email}`);
    const user = await authService.registerUser(req.body);
    console.log(`[AUTH] Usuário ${user.email} registrado com sucesso.`);
    return res.status(201).json({ message: 'Usuário criado com sucesso!', user });
  } catch (error: any) {
    console.error(`[AUTH] Erro no registro: ${error.message}`);
    
    
    if (error.message.includes('e-mail já está cadastrado')) {
      return res.status(409).json({ message: error.message }); 
    }
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Dados inválidos.', details: error.message });
    }

    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};


export const login = async (req: Request, res: Response): Promise<Response> => {
  try {
    console.log(`[AUTH] Tentativa de login para o e-mail: ${req.body.email}`);
    const { user, token } = await authService.loginUser(req.body);
    console.log(`[AUTH] Login bem-sucedido para ${user.email}.`);
    return res.status(200).json({ message: 'Login bem-sucedido!', user, token });
  } catch (error: any) {
    console.error(`[AUTH] Erro no login: ${error.message}`);

    if (error.message.includes('Credenciais inválidas')) {
      return res.status(401).json({ message: error.message }); 
    }
    
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};
