const { Router } = require('express');
const LabelController = require('../controllers/label.controllers');
const AuthController = require('../controllers/auth.controllers');
const NoteController = require('../controllers/note.controllers');

const router = Router();

/**
 * @swagger
 * components:
 *  schemas:
 *    Label:
 *      properties:
 *        labels:
 *          type: array
 *          items:
 *            type: string
 *          description: all labels (tags) of the the note.
 */

/**
 * @swagger
 * /api/v1/labels:
 *  get:
 *    summary: Get All labels in the notes of logged in user
 *    tags: [Labels]
 *    responses:
 *      200:
 *        description: The list of labels in the notes created by the logged in user.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              items:
 *                $ref: '#/components/schemas/Labels'
 *      401:
 *        description: Unauthorized, you must login.
 */

/**
 * @swagger
 * /api/v1/labels/{label}:
 *  get:
 *    summary: Get All notes by label of logged in user
 *    parameters:
 *      - in: path
 *        required: true
 *        name: label
 *        type: string
 *    tags: [Labels]
 *    responses:
 *      200:
 *        description: The list of notes by label created by the logged in user.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              items:
 *                $ref: '#/components/schemas/Notes'
 *      401:
 *        description: Unauthorized, you must login.
 */

router.route('/').get(AuthController.protect, LabelController.getAllLabels);
router
  .route('/:label')
  .get(
    AuthController.protect,
    NoteController.normalNotes,
    NoteController.getNotesByLable,
    NoteController.getAllNotes
  );

module.exports = router;
