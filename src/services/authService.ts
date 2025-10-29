import db from '../models'; 
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import 'dotenv/config';


export interface UserResponse { 
    id: number;
    name: string;
    email: string;
    createdAt?: Date;
    updatedAt?: Date;
}



export const registerUser = async (userData: any): Promise<UserResponse> => {
    console.log(`[SERVICE] Registando utilizador: ${userData.email}`);
    try {
        const newUser = await db.User.create(userData);

        
        const userResponse: UserResponse = {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            createdAt: newUser.createdAt,
            updatedAt: newUser.updatedAt
        };
        console.log(`[SERVICE] Utilizador ${newUser.email} registado com ID: ${newUser.id}`);
        return userResponse;
    } catch (error: any) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            console.warn(`[SERVICE] Tentativa de registo com e-mail duplicado: ${userData.email}`);
            const customError: any = new Error('Este e-mail já está registado.');
            customError.status = 409; 
            throw customError;
        }
        if (error.name === 'SequelizeValidationError') {
            console.warn(`[SERVICE] Erro de validação no registo: ${error.message}`);
             const customError: any = new Error(`Dados de registo inválidos: ${error.message}`);
            customError.status = 400; 
            throw customError;
        }
        console.error(`[SERVICE] Erro inesperado no registo: ${error.message}`);
        throw error;
    }
};


export const loginUser = async (credentials: any): Promise<{ user: UserResponse; token: string }> => {
    const { email, password } = credentials;
    console.log(`[SERVICE] Tentativa de login para: ${email}`);

    if (!email || !password) {
        const error: any = new Error('E-mail e palavra-passe são obrigatórios.');
        error.status = 400; // Bad Request
        throw error;
    }

    try {
        console.log(`>>> [SERVICE] Procurando utilizador ${email} (com password)...`);
        const user = await db.User.scope('withPassword').findOne({ where: { email } });

        if (!user || !user.id) { 
            console.warn(`[SERVICE] Tentativa de login falhada: Utilizador ${email} não encontrado.`);
            const error: any = new Error('Credenciais inválidas.');
            error.status = 401; 
            throw error;
        }
         console.log(`>>> [SERVICE] Utilizador ${email} encontrado. ID: ${user.id}`);

        console.log(`>>> [SERVICE] Comparando passwords para utilizador ID: ${user.id}...`);
        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            console.warn(`[SERVICE] Tentativa de login falhada: Password incorreta para ${email}.`);
            const error: any = new Error('Credenciais inválidas.');
            error.status = 401; // Unauthorized
            throw error;
        }
         console.log(`>>> [SERVICE] Passwords correspondem para utilizador ID: ${user.id}.`);

        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            console.error(">>> [SERVICE] ERRO GRAVE: A variável JWT_SECRET não está definida no .env");
            throw new Error('Erro na configuração do servidor.');
        }

        console.log(`>>> [SERVICE] Gerando token JWT para utilizador ID: ${user.id}...`);
        const token = jwt.sign({ id: user.id }, jwtSecret, { expiresIn: '1d' });
        console.log(`>>> [SERVICE] Token gerado com sucesso.`);

        const userResponse: UserResponse = {
            id: user.id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        };

        return { user: userResponse, token }; 

    } catch (error: any) {
        if (error.status) {
            throw error;
        }
        console.error(`[SERVICE] Erro inesperado no login: ${error.message}`);
        throw new Error('Erro interno do servidor durante o login.');
    }
};

