import jwt from 'jsonwebtoken';
import InvariantError from '../exceptions/InvariantError';

export const TokenManager = {
    generateAccessToken: (payload: any) => {
        return jwt.sign(payload, process.env.ACCESS_TOKEN_KEY as string, { expiresIn: '3h'});
    },
    generateRefreshToken: (payload: any) => {
        return jwt.sign(payload, process.env.REFRESH_TOKEN_KEY as string);
    },
    verifyRefreshToken: (refreshToken:string) => {
        try {
            const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_KEY as string);
            return decoded
        } catch (error) {
            throw new InvariantError('Refresh token tidak valid');
        }
    }
}