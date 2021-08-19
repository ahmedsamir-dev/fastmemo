const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  title: {
    type: 'string',
    trim: true,
  },
  description: {
    type: 'string',
    trim: true,
    default: 'Empty Note',
  },
  images: {
    type: [String],
  },
  labels: {
    type: [String],
  },
  archive: {
    type: Boolean,
    default: false,
  },
  trash: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date().now,
  },
  updatedAt: {
    type: Date,
    default: Date().now,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
});

noteSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name photo email',
  });

  next();
});

// noteSchema.post('save', )

const Note = mongoose.model('Note', noteSchema);

module.exports = Note;
