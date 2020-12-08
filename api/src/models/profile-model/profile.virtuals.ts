import { modelRefs } from '../model-referances';
import { ProfileSchema } from './profile.model';
// Profilin sahibi
ProfileSchema.virtual('owner', {
  ref: modelRefs.user,
  localField: 'ownerId',
  foreignField: '_id',
  justOne: true,
});
