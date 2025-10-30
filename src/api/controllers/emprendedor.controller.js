import { EmprendedorModel } from '../models/Emprendedor.js';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const IA_ANALYZER_URL = process.env.IA_ANALYZER_URL || 'http://localhost:6000';

export const crearEmprendedor = async (req, res) => {
  try {
    console.log('📝 Creando nuevo emprendedor...');
    
    // Crear emprendedor en MongoDB
    const nuevoEmprendedor = await EmprendedorModel.crear(req.body);
    const emprendedorId = nuevoEmprendedor._id.toString();
    
    console.log(`✅ Emprendedor creado con ID: ${emprendedorId}`);
    
    // Responder inmediatamente al cliente
    res.status(201).json({
      success: true,
      message: 'Emprendedor creado exitosamente. El análisis de IA se está procesando.',
      data: nuevoEmprendedor
    });
    
    // Lanzar análisis de IA en segundo plano (sin await)
    lanzarAnalisisIA(emprendedorId);
    
  } catch (error) {
    console.error('❌ Error al crear emprendedor:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Función para lanzar el análisis de IA en segundo plano
const lanzarAnalisisIA = async (emprendedorId) => {
  try {
    console.log(`🤖 Lanzando análisis de IA para emprendedor ${emprendedorId}...`);
    
    // Actualizar estado del informe a "procesando"
    await EmprendedorModel.actualizar(emprendedorId, {
      'informe.estado': 'procesando'
    });
    
    // Llamar al microservicio de IA
    const response = await axios.post(`${IA_ANALYZER_URL}/analyze`, {
      emprendedorId
    }, {
      timeout: 120000 // 2 minutos de timeout
    });
    
    console.log(`✅ Análisis de IA completado para ${emprendedorId}`);
    
  } catch (error) {
    console.error(`❌ Error en análisis de IA para ${emprendedorId}:`, error.message);
    
    // Actualizar estado del informe a "error"
    await EmprendedorModel.actualizar(emprendedorId, {
      'informe.estado': 'error',
      'informe.error': error.message
    });
  }
};

export const obtenerEmprendedor = async (req, res) => {
  try {
    const { id } = req.params;
    const emprendedor = await EmprendedorModel.buscarPorId(id);
    
    if (!emprendedor) {
      return res.status(404).json({
        success: false,
        error: 'Emprendedor no encontrado'
      });
    }
    
    res.json({
      success: true,
      data: emprendedor
    });
  } catch (error) {
    console.error('❌ Error al obtener emprendedor:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

export const listarEmprendedores = async (req, res) => {
  try {
    const { pagina = 1, limite = 10, sector, etapa, pais } = req.query;
    
    // Construir filtros
    const filtros = {};
    if (sector) filtros['proyecto.sector'] = sector;
    if (etapa) filtros['proyecto.etapa'] = etapa;
    if (pais) filtros.pais = pais;
    
    const resultado = await EmprendedorModel.listarTodos(
      filtros,
      parseInt(pagina),
      parseInt(limite)
    );
    
    res.json({
      success: true,
      ...resultado
    });
  } catch (error) {
    console.error('❌ Error al listar emprendedores:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

export const actualizarEmprendedor = async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await EmprendedorModel.actualizar(id, req.body);
    
    if (!resultado) {
      return res.status(404).json({
        success: false,
        error: 'Emprendedor no encontrado'
      });
    }
    
    res.json({
      success: true,
      message: 'Emprendedor actualizado exitosamente',
      data: resultado
    });
  } catch (error) {
    console.error('❌ Error al actualizar emprendedor:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

export const eliminarEmprendedor = async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await EmprendedorModel.eliminar(id);
    
    if (resultado.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        error: 'Emprendedor no encontrado'
      });
    }
    
    res.json({
      success: true,
      message: 'Emprendedor eliminado exitosamente'
    });
  } catch (error) {
    console.error('❌ Error al eliminar emprendedor:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

export default {
  crearEmprendedor,
  obtenerEmprendedor,
  listarEmprendedores,
  actualizarEmprendedor,
  eliminarEmprendedor
};
