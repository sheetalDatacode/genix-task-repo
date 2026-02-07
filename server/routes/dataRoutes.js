import express from 'express';
import { getData, processData } from '../controllers/dataController.js';
import validateData from '../middleware/validateData.js';

const router = express.Router();

router.get('/data', getData);
router.post('/process', validateData, processData);

export default router;
