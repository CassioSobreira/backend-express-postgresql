import User, { IUser } from '../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

/**
 * @param userData 
 * @returns 
 */
export const registerUser = async (userData: Pick<IUser, 'name' | 'email' | 'password'>): Promise<Omit<IUser, 'password'>> => {
  const { email } = userData;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('Este e-mail já está cadastrado.');
  }

  const user = new User(userData);
  await user.save();

  const userObject = user.toObject();
  delete userObject.password;

  return userObject;
};

/**
  @param credentials 
  @returns
 */
export const loginUser = async (credentials: Pick<IUser, 'email' | 'password'>): Promise<{ user: Omit<IUser, 'password'>; token: string }> => {
  const { email, password } = credentials;

  if (!password) {
    throw new Error('A senha não foi fornecida.');
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user || !user.password) {
    throw new Error('Credenciais inválidas.');
  }

  
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Credenciais inválidas.');
  }

  
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    console.error("ERRO: JWT_SECRET não definido no .env");
    throw new Error('Não foi possível gerar o token de autenticação.');
  }

  const token = jwt.sign({ id: user._id }, jwtSecret, {
    expiresIn: '1d', 
  });
  
  
  const userObject = user.toObject();
  delete userObject.password;

  return { user: userObject, token };
};
