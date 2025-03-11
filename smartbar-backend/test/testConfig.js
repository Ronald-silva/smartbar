import { expect } from 'chai';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config({ path: '.env.test' });

export function gerarTokenAdmin() {
    return jwt.sign(
        { isAdmin: true },
        process.env.JWT_SECRET || 'segredo123',
        { expiresIn: '1h' }
    );
}

// Global test setup
before(async () => {
    // Add any setup code here
});

// Global test teardown
after(async () => {
    // Add any cleanup code here
});

export { expect };