const Note = require('../models/Note');

class LabelController {
  async getAllLabels(req, res, next) {
    try {
      const labels = await Note.distinct('labels');

      console.log(labels);

      res.status(200).json({
        status: 'success',
        data: {
          labels,
        },
      });
    } catch (err) {
      return next(err);
    }
  }
}

module.exports = new LabelController();
