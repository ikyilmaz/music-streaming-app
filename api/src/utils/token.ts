import * as jwt from 'jsonwebtoken';

export async function generateJWTToken(id: string | number, secret: string, expiresIn: string | number) {
	return new Promise((resolve, reject) => {
		jwt.sign({ id }, secret, { expiresIn }, (err, token) => {
			if (err) return reject(err);
			resolve(token);
		});
	});
}

export async function verifyJWTToken(token: string, secret: string) {
	return new Promise<{ id: string; iat: string }>((resolve, reject) => {
		jwt.verify(token, secret, {}, (err, decoded) => {
			if (err) return reject(err);
			resolve(decoded as { id: string; iat: string });
		});
	});
}
