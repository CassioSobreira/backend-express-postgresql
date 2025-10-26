import { Request, Response } from 'express';
import * as movieService from '../services/movieService';
import mongoose from 'mongoose';


interface AuthRequest extends Request {
  userId?: string;
}

const handleServiceError = (error: any, res: Response, action: string) => {
  console.error(`[CONTROLLER] Erro ao ${action} filme: ${error.message}`);
  
  if (error instanceof mongoose.Error.ValidationError) {
    
    return res.status(400).json({ message: 'Dados inválidos.', details: error.errors });
  }
  return res.status(error.status || 500).json({ message: error.message || 'Erro interno do servidor.' });
};

export const create = async (req: AuthRequest, res: Response) => {
  console.log('[CONTROLLER] Recebida requisição para criar filme.');
  try {
    const userId = req.userId;
    if (!userId) {
      console.warn('[CONTROLLER] Tentativa de criar filme sem userId no token.');
      return res.status(401).json({ message: 'Usuário não autenticado.' });
    }
    
    const movie = await movieService.createMovie(req.body, userId);
    console.log(`[CONTROLLER] Filme criado com sucesso para usuário ${userId}. ID: ${movie._id}`);
    res.status(201).json({ message: 'Filme adicionado com sucesso!', movie });
  } catch (error: any) {
    handleServiceError(error, res, 'criar');
  }
};


export const getAll = async (req: AuthRequest, res: Response) => {
  console.log('[CONTROLLER] Recebida requisição para listar filmes.');
  try {
    const userId = req.userId;
    if (!userId) {
       console.warn('[CONTROLLER] Tentativa de listar filmes sem userId no token.');
      return res.status(401).json({ message: 'Usuário não autenticado.' });
    }
    const filters = req.query; 
    console.log(`[CONTROLLER] Listando filmes para usuário ${userId} com filtros:`, filters);
    const movies = await movieService.getAllMovies(userId, filters);
    res.status(200).json(movies);
  } catch (error: any) {
    handleServiceError(error, res, 'listar');
  }
};


export const getById = async (req: AuthRequest, res: Response) => {
  const movieId = req.params.id;
  console.log(`[CONTROLLER] Recebida requisição para obter filme por ID: ${movieId}`);
  try {
    const userId = req.userId;
    if (!userId) {
      console.warn(`[CONTROLLER] Tentativa de obter filme ${movieId} sem userId no token.`);
      return res.status(401).json({ message: 'Usuário não autenticado.' });
    }
 
    const movie = await movieService.getMovieById(movieId, userId);
    console.log(`[CONTROLLER] Filme ${movieId} encontrado para usuário ${userId}.`);
    res.status(200).json(movie);
  } catch (error: any) {
    handleServiceError(error, res, `obter por ID (${movieId})`);
  }
};

export const update = async (req: AuthRequest, res: Response) => {
  const movieId = req.params.id;
  console.log(`[CONTROLLER] Recebida requisição para atualizar filme: ${movieId}`);
  try {
    const userId = req.userId;
    if (!userId) {
       console.warn(`[CONTROLLER] Tentativa de atualizar filme ${movieId} sem userId no token.`);
      return res.status(401).json({ message: 'Usuário não autenticado.' });
    }
    
    const { user, ...updateData } = req.body;
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: 'Corpo da requisição vazio. Nada para atualizar.' });
    }
    
    const updatedMovie = await movieService.updateMovie(movieId, updateData, userId);
     console.log(`[CONTROLLER] Filme ${movieId} atualizado com sucesso para usuário ${userId}.`);
    res.status(200).json({ message: 'Filme atualizado com sucesso!', movie: updatedMovie });
  } catch (error: any) {
    handleServiceError(error, res, `atualizar (${movieId})`);
  }
};


export const remove = async (req: AuthRequest, res: Response) => {
   const movieId = req.params.id;
   console.log(`[CONTROLLER] Recebida requisição para deletar filme: ${movieId}`);
   try {
    const userId = req.userId;
    if (!userId) {
      console.warn(`[CONTROLLER] Tentativa de deletar filme ${movieId} sem userId no token.`);
      return res.status(401).json({ message: 'Usuário não autenticado.' });
    }
   
    await movieService.deleteMovie(movieId, userId);
    console.log(`[CONTROLLER] Filme ${movieId} deletado com sucesso para usuário ${userId}.`);
    
    res.status(200).json({ message: 'Filme deletado com sucesso.' });
  } catch (error: any) {
    handleServiceError(error, res, `deletar (${movieId})`);
  }
};

