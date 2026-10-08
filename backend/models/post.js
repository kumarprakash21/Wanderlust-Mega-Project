import { Schema, model } from 'mongoose';

const postSchema = new Schema({
  authorName: { type: String, required: true, trim: true, maxlength: 100 },
  title: { type: String, required: true, trim: true, maxlength: 200 },
  imageLink: { type: String, required: true, trim: true, maxlength: 2048 },
  categories: { type: [String], required: true, validate: v => v.length <= 3 },
  description: { type: String, required: true, maxlength: 10000 },
  isFeaturedPost: { type: Boolean, default: false },
  timeOfPost: { type: Date, default: Date.now },
}, { timestamps: true, strict: true });

export default model('Post', postSchema);
