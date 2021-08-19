const yup = require('yup');

class NoteValidationSchemas {
  createNoteSchema() {
    return yup.object().shape({
      title: yup.string(),
      description: yup.string(),
      images: yup.array(yup.string()),
      reminders: yup.date(),
      labels: yup.array(yup.string()),
      collaborators: yup.array(yup.string()),
      archive: yup.boolean(),
      trash: yup.boolean(),
      user: yup.string().optional(),
    });
  }

  updateNoteSchema() {
    return yup.object().shape({
      title: yup.string(),
      description: yup.string(),
      images: yup.array(yup.string()),
      reminders: yup.date(),
      labels: yup.array(yup.string()),
      collaborators: yup.array(yup.string()),
      archive: yup.boolean(),
      trash: yup.boolean(),
      user: yup.string().optional(),
    });
  }
}

module.exports = new NoteValidationSchemas();
