import { Request, Response } from 'express';
import * as authService from '../services/authService';
import { UserResponse } from '../services/authService';

export const register = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Nome, email e password são obrigatórios.' });
    }

    console.log(`[AUTH] Tentativa de registo para o e-mail: ${req.body.email}`);

    const user: UserResponse = await authService.registerUser({ name, email, password });

    console.log(`[AUTH] Utilizador ${user.email} registado com sucesso.`);
    return res.status(201).json({ message: 'Utilizador criado com sucesso!', user });

  } catch (error: any) {
    console.error(`[AUTH] Erro no registo: ${error.message}`);
    return res.status(error.status || 500).json({ message: error.message || 'Erro interno do servidor.' });
  }
};

export const login = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'E-mail e password são obrigatórios.' });
    }

    console.log(`[AUTH] Tentativa de login para o e-mail: ${req.body.email}`);

    const { user, token }: { user: UserResponse; token: string } = await authService.loginUser({ email, password });

    console.log(`[AUTH] Login bem-sucedido para ${user.email}.`);
    return res.status(200).json({ message: 'Login bem-sucedido!', user, token });

  } catch (error: any) {
    console.error(`[AUTH] Erro no login: ${error.message}`);
    return res.status(error.status || 500).json({ message: error.message || 'Erro interno do servidor.' });
  }
};

