
import mongoose from 'mongoose';

const NoteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title.'],
    trim: true,
  },
  content: {
    type: String,
    required: [true, 'Please provide content.'],
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt fields
});

export default mongoose.models.Note || mongoose.model('Note', NoteSchema);
