import db from '../models'; 
import { Op } from 'sequelize';
import Movie, { MovieAttributes, MovieCreationAttributes } from '../models/Movie';
import User from '../models/User'; 
const findMovieAndCheckOwnership = async (movieId: number, userId: number): Promise<Movie> => {
    const movie = await db.Movie.findByPk(movieId);

    if (!movie) {
        console.warn(`[SERVICE] Tentativa de acesso a filme inexistente: ID ${movieId}`);
        const error: any = new Error('Filme não encontrado.');
        error.status = 404; 
        throw error;
    }

    if (movie.userId !== userId) {
        console.warn(`[AUTH] ATENÇÃO: Utilizador ${userId} tentando aceder/modificar filme ${movieId} de outro utilizador (${movie.userId}).`);
        const error: any = new Error('Acesso negado. Você não tem permissão para aceder ou modificar este recurso.');
        error.status = 403; 
        throw error;
    }
    console.log(`[SERVICE] Verificação de posse bem-sucedida para filme ${movieId} e utilizador ${userId}.`);
    return movie;
};

export const createMovie = async (movieData: MovieCreationAttributes, userId: number): Promise<Movie> => {
  console.log(`[SERVICE] Criando filme para o utilizador ID: ${userId}`);
  const newMovie = await db.Movie.create({
    ...movieData,
    userId: userId,
  });
  console.log(`[SERVICE] Filme "${newMovie.title}" criado com ID: ${newMovie.id}`);
  return newMovie;
};

export const getAllMovies = async (userId: number, filters: any): Promise<Movie[]> => {
  console.log(`[SERVICE] Buscando filmes do utilizador ID: ${userId} com filtros:`, filters);

  const whereClause: any = { userId: userId };

  if (filters.genre) {
    whereClause.genre = { [Op.iLike]: `%${filters.genre}%` };
  }
  if (filters.director) {
    whereClause.director = { [Op.iLike]: `%${filters.director}%` };
  }
  if (filters.title) {
    whereClause.title = { [Op.iLike]: `%${filters.title}%` };
  }
   if (filters.rating) {
    const ratingNum = Number(filters.rating);
    if (!isNaN(ratingNum)) {
       whereClause.rating = { [Op.gte]: ratingNum };
    }
  }
   if (filters.year) {
    const yearNum = Number(filters.year);
    if (!isNaN(yearNum)) {
      whereClause.year = yearNum;
    }
  }

  const movies = await db.Movie.findAll({ where: whereClause });
  console.log(`[SERVICE] Encontrados ${movies.length} filmes para o utilizador ID: ${userId}`);
  return movies;
};

export const getMovieById = async (movieId: number, userId: number): Promise<Movie> => {
  console.log(`[SERVICE] Buscando filme ID: ${movieId} para utilizador ID: ${userId}`);
  return findMovieAndCheckOwnership(movieId, userId);
};

type MovieUpdateData = Partial<Omit<MovieAttributes, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>;
export const updateMovie = async (movieId: number, movieData: MovieUpdateData, userId: number): Promise<Movie> => {
  console.log(`[SERVICE] Tentando atualizar filme ID: ${movieId} para utilizador ID: ${userId}`);
  const movieInstance = await findMovieAndCheckOwnership(movieId, userId);

  await movieInstance.update(movieData);
  console.log(`[SERVICE] Filme ID: ${movieId} atualizado com sucesso.`);

  return movieInstance;
};

export const deleteMovie = async (movieId: number, userId: number): Promise<void> => {
  console.log(`[SERVICE] Tentando deletar filme ID: ${movieId} para utilizador ID: ${userId}`);
  await findMovieAndCheckOwnership(movieId, userId);

  const numberOfAffectedRows = await db.Movie.destroy({
    where: { id: movieId, userId: userId }
  });

  if (numberOfAffectedRows === 0) {
      console.error(`[SERVICE] Falha ao deletar filme ID: ${movieId}, nenhuma linha afetada após verificação.`);
      throw new Error('Falha ao deletar o filme.');
  }

  console.log(`[SERVICE] Filme ID: ${movieId} deletado com sucesso.`);
};

