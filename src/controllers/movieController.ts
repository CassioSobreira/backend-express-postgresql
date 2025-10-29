import { Request, Response } from 'express';
import * as movieService from '../services/movieService';
import db from '../models'; 


interface AuthRequest extends Request {
  userId?: string | number; 
}


const handleServiceError = (error: any, res: Response, action: string) => {
  console.error(`[CONTROLLER] Erro ao ${action} filme: ${error.message}`);
  
  if (error.name === 'SequelizeValidationError') {
    
    const details = error.errors.map((e: any) => `${e.path}: ${e.message}`).join(', ');
    return res.status(400).json({ message: 'Dados inválidos.', details: details });
  }
  if (error.name === 'SequelizeUniqueConstraintError') {
     const details = error.errors.map((e: any) => `${e.path}: ${e.message}`).join(', ');
     return res.status(409).json({ message: 'Conflito de dados. Já existe um registo com estes valores únicos.', details: details });
  }
  
  return res.status(error.status || 500).json({ message: error.message || 'Erro interno do servidor.' });
};


export const create = async (req: AuthRequest, res: Response) => {
  try {
    
    const userId = typeof req.userId === 'string' ? parseInt(req.userId, 10) : req.userId;
    if (!userId || isNaN(userId)) {
      return res.status(401).json({ message: 'ID do utilizador inválido ou não encontrado no token.' });
    }
    
    if (!req.body.title) {
        return res.status(400).json({ message: 'O título do filme é obrigatório.' });
    }

    const movie = await movieService.createMovie(req.body, userId);
    res.status(201).json({ message: 'Filme adicionado com sucesso!', movie });
  } catch (error: any) {
    handleServiceError(error, res, 'criar');
  }
};


export const getAll = async (req: AuthRequest, res: Response) => {
  try {
    const userId = typeof req.userId === 'string' ? parseInt(req.userId, 10) : req.userId;
     if (!userId || isNaN(userId)) {
      return res.status(401).json({ message: 'ID do utilizador inválido ou não encontrado no token.' });
    }
    const filters = req.query;
    const movies = await movieService.getAllMovies(userId, filters);
    res.status(200).json(movies);
  } catch (error: any) {
    handleServiceError(error, res, 'listar');
  }
};


export const getById = async (req: AuthRequest, res: Response) => {
  try {
    const userId = typeof req.userId === 'string' ? parseInt(req.userId, 10) : req.userId;
    if (!userId || isNaN(userId)) {
      return res.status(401).json({ message: 'ID do utilizador inválido ou não encontrado no token.' });
    }


    const movieIdString = req.params.id;
    const movieId = parseInt(movieIdString, 10); 

    if (isNaN(movieId) || movieId <= 0) { 
        console.warn(`[CONTROLLER] Tentativa de buscar filme com ID inválido: "${movieIdString}"`);
        return res.status(400).json({ message: 'O ID do filme fornecido na URL é inválido.' });
    }

    console.log(`[CONTROLLER] Buscando filme ID: ${movieId} para utilizador ID: ${userId}`);
    const movie = await movieService.getMovieById(movieId, userId); 
    res.status(200).json(movie);
  } catch (error: any) {
    handleServiceError(error, res, `obter filme por ID ${req.params.id}`);
  }
};


export const update = async (req: AuthRequest, res: Response) => {
  try {
    const userId = typeof req.userId === 'string' ? parseInt(req.userId, 10) : req.userId;
    if (!userId || isNaN(userId)) {
      return res.status(401).json({ message: 'ID do utilizador inválido ou não encontrado no token.' });
    }

    
    const movieIdString = req.params.id;
    const movieId = parseInt(movieIdString, 10);
    if (isNaN(movieId) || movieId <= 0) {
        console.warn(`[CONTROLLER] Tentativa de atualizar filme com ID inválido: "${movieIdString}"`);
        return res.status(400).json({ message: 'O ID do filme fornecido na URL é inválido.' });
    }

    const { user, ...updateData } = req.body; 
    if (Object.keys(updateData).length === 0) {
        return res.status(400).json({ message: 'Nenhum dado fornecido para atualização.' });
    }

    console.log(`[CONTROLLER] Atualizando filme ID: ${movieId} para utilizador ID: ${userId}`);
    const updatedMovie = await movieService.updateMovie(movieId, updateData, userId);
    res.status(200).json({ message: 'Filme atualizado com sucesso!', movie: updatedMovie });
  } catch (error: any) {
    handleServiceError(error, res, `atualizar filme ID ${req.params.id}`);
  }
};


export const remove = async (req: AuthRequest, res: Response) => {
   try {
    const userId = typeof req.userId === 'string' ? parseInt(req.userId, 10) : req.userId;
     if (!userId || isNaN(userId)) {
      return res.status(401).json({ message: 'ID do utilizador inválido ou não encontrado no token.' });
    }

   
    const movieIdString = req.params.id;
    const movieId = parseInt(movieIdString, 10);
     if (isNaN(movieId) || movieId <= 0) {
        console.warn(`[CONTROLLER] Tentativa de deletar filme com ID inválido: "${movieIdString}"`);
        return res.status(400).json({ message: 'O ID do filme fornecido na URL é inválido.' });
    }

    console.log(`[CONTROLLER] Deletando filme ID: ${movieId} para utilizador ID: ${userId}`);
    await movieService.deleteMovie(movieId, userId);
    res.status(200).json({ message: 'Filme deletado com sucesso.' });
  } catch (error: any) {
    handleServiceError(error, res, `deletar filme ID ${req.params.id}`);
  }
};

