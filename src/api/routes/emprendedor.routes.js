import express from 'express';
import {
  crearEmprendedor,
  obtenerEmprendedor,
  listarEmprendedores,
  actualizarEmprendedor,
  eliminarEmprendedor
} from '../controllers/emprendedor.controller.js';

const router = express.Router();

/**
 * @route   POST /api/emprendedor
 * @desc    Crear nuevo emprendedor y lanzar análisis de IA
 * @access  Public
 */
router.post('/', crearEmprendedor);

/**
 * @route   GET /api/emprendedor
 * @desc    Listar todos los emprendedores con filtros y paginación
 * @access  Public
 */
router.get('/', listarEmprendedores);

/**
 * @route   GET /api/emprendedor/:id
 * @desc    Obtener un emprendedor por ID
 * @access  Public
 */
router.get('/:id', obtenerEmprendedor);

/**
 * @route   PUT /api/emprendedor/:id
 * @desc    Actualizar datos de un emprendedor
 * @access  Public
 */
router.put('/:id', actualizarEmprendedor);

/**
 * @route   DELETE /api/emprendedor/:id
 * @desc    Eliminar un emprendedor
 * @access  Public
 */
router.delete('/:id', eliminarEmprendedor);

export default router;
