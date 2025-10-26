import mongoose, { Document, Schema } from 'mongoose';

export interface IMovie extends Document {
  title: string;
  director?: string;
  year?: number;
  genre?: string;
  rating?: number;
  user: mongoose.Schema.Types.ObjectId; 
}

const MovieSchema: Schema = new Schema({
  title: {
    type: String,
    required: [true, 'O título é obrigatório.'],
    trim: true, 
  },
  director: {
    type: String,
    trim: true,
  },
  year: {
    type: Number,
  },
  genre: {
    type: String,
    trim: true,
  },
  rating: {
    type: Number,
    min: [1, 'A avaliação deve ser no mínimo 1.'],
    max: [10, 'A avaliação deve ser no máximo 10.'],
  },
 
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true,
    index: true, 
  },
}, {
  timestamps: true 
});

MovieSchema.index({ user: 1, title: 1 });

export default mongoose.model<IMovie>('Movie', MovieSchema);

