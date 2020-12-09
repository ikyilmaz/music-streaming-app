import { modelRefs } from "../model-referances";
import { TrackSchema } from "./track.model";

TrackSchema.virtual('owner', {
    ref: modelRefs.user,
    localField: 'ownerId',
    foreignField: '_id',
    justOne: true,
})