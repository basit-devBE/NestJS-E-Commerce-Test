import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

/**
 * Generates a JWT token with the given payload and expiration time.
 * @param {Object} payload - The payload to include in the token.
 * @param {string} expiresIn - The expiration time for the token (e.g., '1h', '2d').
 * @returns {string} The generated JWT token.
 */
export const generateAccessToken = (payload:object, expiresIn: string):Promise<string> =>{
    return new Promise((resolve, reject) => {
        jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn }, (err, token) => {
            if (err) {
                console.error('Error generating JWT token:', err);
                reject(err);
            } else {
                resolve(token as string);
            }
        });
    });
}


export const generateRefreshToken = (payload:object, expiresIn: string):Promise<string> =>{
    return new Promise((resolve, reject) => {
        jwt.sign(payload, process.env.JWT_REFRESH_SECRET as string, { expiresIn }, (err, token) => {
            if (err) {
                console.error('Error generating refresh JWT token:', err);
                reject(err);
            } else {
                resolve(token as string);
            }
        });
    });
}