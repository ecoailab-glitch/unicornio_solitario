import express from 'express';
import {
  obtenerInforme,
  regenerarInforme
} from '../controllers/informe.controller.js';

const router = express.Router();

/**
 * @route   GET /api/informe/:id
 * @desc    Obtener el informe de análisis de un emprendedor
 * @access  Public
 */
router.get('/:id', obtenerInforme);

/**
 * @route   POST /api/informe/:id/regenerar
 * @desc    Regenerar el informe de análisis
 * @access  Public
 */
router.post('/:id/regenerar', regenerarInforme);

export default router;
