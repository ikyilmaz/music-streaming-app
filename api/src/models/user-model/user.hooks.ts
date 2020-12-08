import { Model, HookNextFunction } from 'mongoose';
import { UserSchema, UserDocument } from './user.model';
import * as bcrypt from 'bcryptjs';

// Kullanıcı kaydedilmeden önce çalışacak hook
UserSchema.pre<UserDocument>('save', async function (this, next) {
  // Fonksiyonu sadece şifre değiştirildiyse çalıştır
  if (!this.isModified('password')) return next();

  // 12'lik bir cost değeri ile şifreyi hash'liyoruz
  this.password = await bcrypt.hash(this.password, 12);

  // Bir sonraki middlewarein çalışması için
  next();
});

// İçinde find geçen bir method çalıştırılırsa bu hooka uğramadan gitmez!!
UserSchema.pre<Model<UserDocument>>(/^find/, function (next: HookNextFunction) {
  // Find query'lerinde aktif olmayan kullanıcıları getirmemesi için
  this.find({ active: { $ne: false } });

  // Bir sonraki middlewarein çalışması için
  next();
});
