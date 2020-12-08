import { UserSchema } from './user.model';
import * as bcrypt from 'bcryptjs';

// Şifreyi döküman üzerinden hashleyebilmek için bir fonksiyon
UserSchema.methods.hashPassword = (password: string): Promise<string> => bcrypt.hash(password, 12);

// Verilen şifre ile hash'i karşılaştıran fonksiyon
UserSchema.methods.comparePasswords = (candidatePassword: string, hashedPassword: string): Promise<boolean> =>
	bcrypt.compare(candidatePassword, hashedPassword);

// Şifre değiştirilmeden önce alınan bir token mi değil mi?
UserSchema.methods.changedPasswordAfter = function (JWTTimestamp: string | number): boolean {
	if (this.passwordChangedAt) {
		const changedTimestamp = parseInt((this.passwordChangedAt.getTime() / 1000).toString(), 10);
		return +JWTTimestamp < changedTimestamp;
	}

	return false;
};
