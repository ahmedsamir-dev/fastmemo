const { Router } = require('express');
const NoteController = require('../controllers/note.controllers');
const AuthorController = require('../controllers/auth.controllers');
const NoteValidationSchemas = require('../validationSchemas/noteValidationSchema');
const validateRequestBody = require('../middlewares/validateRequestBody');
const { uploadNoteImage } = require('../middlewares/uploadImage');

const router = Router();

/**
 * @swagger
 * components:
 *  schemas:
 *    Note:
 *      type: object
 *      properties:
 *        id:
 *          type: string
 *          description: The auto-generated id of the note.
 *        title:
 *          type: string
 *          description: The title of the note.
 *        description:
 *          type: string
 *          description: The description of the note.
 *        images:
 *          type: array
 *          description: all images of the the note.
 *        labels:
 *          type: string
 *          description: all labels (tags) of the the note.
 *        archive:
 *          type: boolean
 *          description: determine if note is archived or not.
 *        trash:
 *          type: boolean
 *          description: determine if note is trashed or not.
 *        user:
 *          type: string
 *          description: The user who owns the note.
 */

/**
 * @swagger
 * tags:
 *    name: Notes
 *    description: Tha Books Routes
 */

/**
 * @swagger
 * /api/v1/notes:
 *  get:
 *    summary: Get All notes of logged in user
 *    tags: [Notes]
 *    responses:
 *      200:
 *        description: The list of notes created by the logged in user.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              items:
 *                $ref: '#/components/schemas/Note'
 *      401:
 *        description: Unauthorized, you must login.
 *  post:
 *    summary: Create a new Note for a logged in user
 *    tags: [Notes]
 *    requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Note'
 *    responses:
 *      201:
 *        description: The note just created by the logged in user.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *            items:
 *            $ref: '#/components/schemas/Note'
 *      401:
 *        description: Unauthorized, you must login.
 */
router
  .route('/')
  .get(
    AuthorController.protect,
    NoteController.normalNotes,
    NoteController.getAllNotes
  )
  .post(
    AuthorController.protect,
    validateRequestBody(NoteValidationSchemas.createNoteSchema()),
    NoteController.createNote
  );

/**
 * @swagger
 * /api/v1/notes/archive/:
 *  get:
 *    summary: Get All archive notes of logged in user
 *    tags: [Notes]
 *    responses:
 *      200:
 *        description: The list of archived notes created by the logged in user.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              items:
 *                $ref: '#/components/schemas/Note'
 *      401:
 *        description: Unauthorized, you must login.
 */

router
  .route('/archive')
  .get(
    AuthorController.protect,
    NoteController.archivedNotes,
    NoteController.getAllNotes
  );

/**
 * @swagger
 * /api/v1/notes/trash/:
 *  get:
 *    summary: Get All trash notes of logged in user
 *    tags: [Notes]
 *    responses:
 *      200:
 *        description: The list of trashed notes created by the logged in user.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              items:
 *                $ref: '#/components/schemas/Note'
 *      401:
 *        description: Unauthorized, you must login.
 */

router
  .route('/trash')
  .get(
    AuthorController.protect,
    NoteController.trashedNotes,
    NoteController.getAllNotes
  );

/**
 * @swagger
 * /api/v1/notes/{id}:
 *  get:
 *    summary: Get a note of logged in user by id
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: string
 *    tags: [Notes]
 *    responses:
 *      200:
 *        description: The note of this id.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              items:
 *                $ref: '#/components/schemas/Note'
 *      404:
 *        description: The note not found, maybe id is not valid.
 *  patch:
 *    summary: Update a note of logged in user by id
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: string
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Note'
 *    tags: [Notes]
 *    responses:
 *      200:
 *        description: The updated note of this id.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              items:
 *                $ref: '#/components/schemas/Note'
 *      404:
 *        description: The note not found, maybe id is not valid.
 *  delete:
 *    summary: delete a note of logged in user by id
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: string
 *    tags: [Notes]
 *    responses:
 *      200:
 *        description:
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              items:
 *                $ref: '#/components/schemas/Note'
 *      404:
 *        description: The note not found, maybe id is not valid.
 */
router
  .route('/:id')
  .get(AuthorController.protect, NoteController.getNote)
  .patch(
    AuthorController.protect,
    validateRequestBody(NoteValidationSchemas.updateNoteSchema()),
    NoteController.updateNote
  )
  .delete(AuthorController.protect, NoteController.deleteNoteForEver);

/**
 * @swagger
 * /api/v1/notes/{id}/archive:
 *  get:
 *    summary: Archive a note of logged in user by id
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: string
 *    tags: [Notes]
 *    responses:
 *      200:
 *        description: The Archived Note.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              items:
 *                $ref: '#/components/schemas/Note'
 *      404:
 *        description: The note not found, maybe id is not valid.
 *      401:
 *        description: Unauthorized, you must login.
 */
router
  .route('/:id/archive')
  .patch(
    AuthorController.protect,
    NoteController.archiveNote,
    NoteController.updateNote
  );

/**
 * @swagger
 * /api/v1/notes/{id}/trash:
 *  get:
 *    summary: Trash a note of logged in user by id
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: string
 *    tags: [Notes]
 *    responses:
 *      200:
 *        description: The Archived Note..
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              items:
 *                $ref: '#/components/schemas/Note'
 *      404:
 *        description: The note not found, maybe id is not valid.
 *      401:
 *        description: Unauthorized, you must login.
 */
router
  .route('/:id/trash')
  .patch(
    AuthorController.protect,
    NoteController.trashNote,
    NoteController.updateNote
  );

/**
 * @swagger
 * /api/v1/notes/{id}/unarchive:
 *  get:
 *    summary: Unarchive a note of logged in user by id
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: string
 *    tags: [Notes]
 *    responses:
 *      200:
 *        description: The Unarchived Note.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              items:
 *                $ref: '#/components/schemas/Note'
 *      404:
 *        description: The note not found, maybe id is not valid.
 *      401:
 *        description: Unauthorized, you must login.
 */

router
  .route('/:id/unarchive')
  .patch(
    AuthorController.protect,
    NoteController.unArchiveNote,
    NoteController.updateNote
  );

/**
 * @swagger
 * /api/v1/notes/{id}/restore:
 *  get:
 *    summary: Restore a note of logged in user by id
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: string
 *    tags: [Notes]
 *    responses:
 *      200:
 *        description: The Restored Note.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              items:
 *                $ref: '#/components/schemas/Note'
 *      404:
 *        description: The note not found, maybe id is not valid.
 *      401:
 *        description: Unauthorized, you must login.
 */

router
  .route('/:id/restore')
  .patch(
    AuthorController.protect,
    NoteController.restoreNote,
    NoteController.updateNote
  );

/**
 * @swagger
 * components:
 *  schemas:
 *    Images:
 *      type: object
 *      properties:
 *        images:
 *          type: array
 *          items:
 *            type: string
 *          description: The array of images.
 */

/**
 * @swagger
 * /api/v1/notes/{id}/images:
 *  post:
 *    summary: Add images to a note
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        decription: the id of the note
 *        schema:
 *          type: string
 *    tags: [Notes]
 *    requestBody:
 *      required: true
 *      content:
 *        multipart/form-data:
 *          schema:
 *            type: string
 *            format: binary
 *            $ref: '#/components/schemas/Image'
 *    responses:
 *      201:
 *        description: The Note.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              items:
 *                $ref: '#/components/schemas/Note'
 *      404:
 *        description: The note not found, maybe.
 *      401:
 *        description: Unauthorized, you must login.
 *
 *  delete:
 *    summary: Add images to a note
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        decription: the id of the note
 *        schema:
 *          type: string
 *    tags: [Notes]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: string
 *            $ref: '#/components/schemas/Image'
 *    responses:
 *      204:
 *        description: The image deleted.
 *      404:
 *        description: The note not found, maybe.
 *      401:
 *        description: Unauthorized, you must login.
 */

router
  .route('/:id/images')
  .post(
    AuthorController.protect,
    uploadNoteImage.array('images'),
    NoteController.addImages
  )
  .delete(AuthorController.protect, NoteController.deleteImage);

router
  .route('/:id/labels')
  .post(AuthorController.protect, NoteController.addLabelsToNote);

router
  .route('/:id/labels')
  .delete(AuthorController.protect, NoteController.removeLabelsFromNote);

module.exports = router;
