import express from 'express';
import runProblem from '../controller/controller.js';
const router = express.Router();
import sessions from '../middleware/sessions.js'

router.post('/', sessions, runProblem);

export default router;