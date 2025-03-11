import jwt from 'jsonwebtoken';

export function generateAdminToken() {
    return jwt.sign(
        { isAdmin: true },
        process.env.JWT_SECRET || 'segredo123',
        { expiresIn: '1h' }
    );
}