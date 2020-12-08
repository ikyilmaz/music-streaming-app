import { modelRefs } from '../model-referances';
import { UserSchema } from './user.model';
// Kullanıcının profili
UserSchema.virtual('profile', {
  ref: modelRefs.profile,
  localField: '_id',
  foreignField: 'ownerId',
  justOne: true,
});
