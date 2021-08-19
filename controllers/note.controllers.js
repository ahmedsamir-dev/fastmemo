const Note = require('../models/Note');
const AppError = require('../error/AppError');

class NoteController {
  normalNotes(req, res, next) {
    req.query = { trash: false, archive: false };

    next();
  }

  trashedNotes(req, res, next) {
    req.query = { trash: true, archive: false };

    next();
  }

  archivedNotes(req, res, next) {
    req.query = { archive: true, trash: false };

    next();
  }

  getNotesByLable(req, res, next) {
    if (req.params.label) {
      req.query['labels'] = `${req.params.label}`;
    }

    next();
  }

  async getAllNotes(req, res, next) {
    try {
      const query = req.query;
      query['user'] = req.user._id || req.query.user;

      console.log(query);

      const notes = await Note.find(query);

      res.status(200).json({
        status: 'success',
        results: notes.length,
        data: {
          notes,
        },
      });
    } catch (err) {
      console.log(err);

      return next(err);
    }
  }

  async getNote(req, res, next) {
    try {
      const { id } = req.params;
      const query = { ...req.query };

      const user = String(req.user._id || req.query.user);

      const note = await Note.findById(id);

      console.log(note);

      if (!note || note.user._id != user)
        return next(new AppError(404, 'No note found with that ID'));

      res.status(200).json({
        status: 'success',
        data: {
          note,
        },
      });
    } catch (err) {
      console.log(err);

      return next(err);
    }
  }

  async createNote(req, res, next) {
    try {
      const body = req.body;
      if (!req.body.user) req.body.user = req.user._id;
      const newNote = await Note.create(body);

      res.status(201).json({
        status: 'success',
        data: {
          note: newNote,
        },
      });
    } catch (err) {
      console.log(err);

      return next(err);
    }
  }

  async updateNote(req, res, next) {
    try {
      const { id } = req.params;
      const body = req.body;

      const note = await Note.findByIdAndUpdate(id, body, {
        new: true,
        runValidators: true,
      });

      if (!note) return next(new AppError(404, 'No note found with that ID'));

      const data = {};
      data.note = req.body.archive || req.body.trash ? undefined : note;

      res.status(200).json({
        status: 'success',
        data,
      });
    } catch (err) {
      console.log(err);

      return next(err);
    }
  }

  async addImages(req, res, next) {
    try {
      const { id } = req.params;

      let files;
      if (req.files) {
        files = req.files.map((file) => file.filename);
      }

      console.log(files);

      const note = await Note.findByIdAndUpdate(
        id,
        {
          $addToSet: { images: files },
        },
        {
          new: true,
          runValidators: true,
        }
      );

      if (!note) return next(new AppError(404, 'No note found with that ID'));
      res.status(201).json({
        status: 'success',
        data: { note },
      });
    } catch (err) {
      console.log(err);

      return next(err);
    }
  }

  async deleteImage(req, res, next) {
    try {
      const { id } = req.params;

      const note = await Note.findByIdAndUpdate(
        id,
        {
          $pull: { images: { $in: req.body.image } },
        },
        {
          new: true,
          runValidators: true,
        }
      );

      if (!note) return next(new AppError(404, 'No note found with that ID'));
      res.status(204).json({
        status: 'success',
        data: { note },
      });
    } catch (err) {
      console.log(err);

      return next(err);
    }
  }

  async deleteNoteForEver(req, res, next) {
    try {
      const { id } = req.params;
      const note = await Note.findOneAndDelete({ _id: id, trash: true });

      if (!note)
        return next(new AppError(404, 'No trashed note found with that ID'));

      console.log('Note is deleted', note);

      res.status(204).json({ status: 'success' });
    } catch (err) {
      console.log(err);

      return next(err);
    }
  }

  trashNote(req, res, next) {
    req.body.trash = true;
    next();
  }

  archiveNote(req, res, next) {
    req.body.archive = true;
    next();
  }

  restoreNote(req, res, next) {
    req.body.trash = false;
    next();
  }

  unArchiveNote(req, res, next) {
    req.body.archive = false;
    next();
  }

  async addLabelsToNote(req, res, next) {
    try {
      const { id } = req.params;
      const body = req.body;

      console.log(body);
      const note = await Note.findByIdAndUpdate(
        id,
        { $addToSet: { labels: { $each: body.labels } } },
        {
          new: true,
          runValidators: true,
        }
      );

      if (!note) return next(new AppError(404, 'No note found with that ID'));

      res.status(200).json({
        status: 'success',
        data: { note },
      });
    } catch (err) {
      console.log(err);

      return next(err);
    }
  }

  async removeLabelsFromNote(req, res, next) {
    try {
      const { id } = req.params;
      const body = req.body;

      console.log(body);
      const note = await Note.findByIdAndUpdate(
        id,
        { $pull: { labels: { $in: body.labels } } },
        {
          new: true,
          runValidators: true,
        }
      );

      if (!note) return next(new AppError(404, 'No note found with that ID'));

      res.status(200).json({
        status: 'success',
        data: { note },
      });
    } catch (err) {
      console.log(err);

      return next(err);
    }
  }
}

module.exports = new NoteController();
