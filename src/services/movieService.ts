import Movie, { IMovie } from '../models/Movie';
import mongoose from 'mongoose';


const findMovieAndCheckOwnership = async (movieId: string, userId: string): Promise<IMovie> => {
    
    if (!mongoose.Types.ObjectId.isValid(movieId)) {
        const error: any = new Error('ID do filme inválido.');
        error.status = 400; 
        throw error;
    }

    const movie = await Movie.findById(movieId);

    if (!movie) {
        const error: any = new Error('Filme não encontrado.');
        error.status = 404; 
        throw error;
    }

    
    if (movie.user.toString() !== userId) {
        console.warn(`[AUTH] ATENÇÃO: Usuário ${userId} tentando acessar filme ${movieId} de outro usuário.`);
        const error: any = new Error('Acesso negado. Você não tem permissão para acessar ou modificar este recurso.');
        error.status = 403; 
        throw error;
    }
    return movie;
};



export const createMovie = async (movieData: Omit<IMovie, 'user' | 'save' | '_id'>, userId: string): Promise<IMovie> => {
  console.log(`[SERVICE] Criando filme para o usuário: ${userId}`);
  const movie = new Movie({
    ...movieData,
    user: userId,
  });
  await movie.save();
  return movie;
};


export const getAllMovies = async (userId: string, filters: any): Promise<IMovie[]> => {
  console.log(`[SERVICE] Buscando filmes do usuário: ${userId} com filtros:`, filters);
  const query: any = { user: userId }; 
  if (filters.genre) {
    query.genre = { $regex: filters.genre, $options: 'i' }; 
  }
  if (filters.director) {
    query.director = { $regex: filters.director, $options: 'i' };
  }
  if (filters.title) {
    query.title = { $regex: filters.title, $options: 'i' };
  }
   if (filters.rating) {
    const ratingNum = Number(filters.rating);
    if (!isNaN(ratingNum)) {
       query.rating = { $gte: ratingNum }; 
    }
  }
   if (filters.year) {
    const yearNum = Number(filters.year);
    if (!isNaN(yearNum)) {
      query.year = yearNum;
    }
  }

  return Movie.find(query);
};

export const getMovieById = async (movieId: string, userId: string): Promise<IMovie> => {
  console.log(`[SERVICE] Buscando filme por ID: ${movieId} para usuário: ${userId}`);

  return findMovieAndCheckOwnership(movieId, userId);
};

export const updateMovie = async (movieId: string, movieData: Partial<Omit<IMovie, 'user' | 'save' | '_id'>>, userId: string): Promise<IMovie> => {
  await findMovieAndCheckOwnership(movieId, userId);

  console.log(`[SERVICE] Atualizando filme: ${movieId}`);
  const updatedMovie = await Movie.findByIdAndUpdate(
    movieId,
    movieData,
    { new: true, runValidators: true }
  );

  if (!updatedMovie) {
       const error: any = new Error('Filme não encontrado após tentativa de atualização.');
       error.status = 404;
       throw error;
  }
  return updatedMovie;
};


export const deleteMovie = async (movieId: string, userId: string): Promise<void> => {
  await findMovieAndCheckOwnership(movieId, userId);

  console.log(`[SERVICE] Deletando filme: ${movieId}`);
  await Movie.findByIdAndDelete(movieId);
};

