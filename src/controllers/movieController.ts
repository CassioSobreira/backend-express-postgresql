import { Request, Response } from 'express';
import * as movieService from '../services/movieService';
import { ValidationError } from 'sequelize'; 


interface AuthRequest extends Request {
  userId?: string; 
}


const handleMovieError = (error: any, res: Response, action: string) => {
  console.error(`[CONTROLLER] Erro ao ${action} filme: ${error.message}`);

  
  if (error instanceof ValidationError) {
    const messages = error.errors.map((e: any) => e.message);
    return res.status(400).json({ message: 'Dados inválidos.', details: messages });
  }

  if (error.status) {
    return res.status(error.status).json({ message: error.message });
  }

  return res.status(500).json({ message: 'Erro interno do servidor.' });
};


export const create = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Usuário não autenticado.' });
    }
   
    const movie = await movieService.createMovie(req.body, Number(userId)); 
    return res.status(201).json({ message: 'Filme adicionado com sucesso!', movie });
  } catch (error: any) {
    return handleMovieError(error, res, 'criar');
  }
};


export const getAll = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Usuário não autenticado.' });
    }
    const filters = req.query; 
    const movies = await movieService.getAllMovies(Number(userId), filters); 
    return res.status(200).json(movies);
  } catch (error: any) {
    return handleMovieError(error, res, 'listar');
  }
};


export const getById = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    const userId = req.userId;
    const movieId = req.params.id; 
    if (!userId) {
      return res.status(401).json({ message: 'Usuário não autenticado.' });
    }
    
    const movie = await movieService.getMovieById(Number(movieId), Number(userId));
    return res.status(200).json(movie); 
  } catch (error: any) {
    return handleMovieError(error, res, 'obter por ID');
  }
};

export const update = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    const userId = req.userId;
    const movieId = req.params.id;
    if (!userId) {
      return res.status(401).json({ message: 'Usuário não autenticado.' });
    }
    
    const { id, userId: bodyUserId, createdAt, updatedAt, ...updateData } = req.body;

    const updatedMovie = await movieService.updateMovie(Number(movieId), updateData, Number(userId));
    return res.status(200).json({ message: 'Filme atualizado com sucesso!', movie: updatedMovie });
  } catch (error: any) {
    return handleMovieError(error, res, 'atualizar');
  }
};


export const remove = async (req: AuthRequest, res: Response): Promise<Response> => {
   try {
    const userId = req.userId;
    const movieId = req.params.id;
    if (!userId) {
      return res.status(401).json({ message: 'Usuário não autenticado.' });
    }
    await movieService.deleteMovie(Number(movieId), Number(userId));

    return res.status(200).json({ message: 'Filme deletado com sucesso.' });
  } catch (error: any) {
    return handleMovieError(error, res, 'deletar');
  }
};

