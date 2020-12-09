import { modelRefs } from '../model-referances';
import { AlbumSchema } from './album.model';

// Albümün Sahibi
AlbumSchema.virtual('owner', {
  ref: modelRefs.user,
  localField: 'ownerId',
  foreignField: '_id',
  justOne: true,
});
