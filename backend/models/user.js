import { Schema, model } from 'mongoose';

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, 'User name is required.'],
    trim: true,
    maxlength: 100,
  },
  email: {
    type: String,
    required: [true, 'Email is required.'],
    lowercase: true,
    trim: true,
    maxlength: 254,
  },
  password: {
    type: String,
    required: false,
  },
  avatar: {
    type: String,
    required: false,
  },
  role: {
    type: String,
    default: 'user',
    enum: ['user', 'admin'],
  },
  createdPosts: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
}, { timestamps: true, strict: true });

userSchema.index({ email: 1 }, { unique: true });

export default model('User', userSchema);
