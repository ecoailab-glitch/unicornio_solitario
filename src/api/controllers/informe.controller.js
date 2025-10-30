import { EmprendedorModel } from '../models/Emprendedor.js';

export const obtenerInforme = async (req, res) => {
  try {
    const { id } = req.params;
    
    const emprendedor = await EmprendedorModel.buscarPorId(id);
    
    if (!emprendedor) {
      return res.status(404).json({
        success: false,
        error: 'Emprendedor no encontrado'
      });
    }
    
    if (!emprendedor.informe || emprendedor.informe.estado === 'pendiente') {
      return res.status(202).json({
        success: true,
        message: 'El informe aún se está procesando',
        estado: 'pendiente'
      });
    }
    
    if (emprendedor.informe.estado === 'procesando') {
      return res.status(202).json({
        success: true,
        message: 'El análisis está en progreso',
        estado: 'procesando'
      });
    }
    
    if (emprendedor.informe.estado === 'error') {
      return res.status(500).json({
        success: false,
        error: 'Error al generar el informe',
        detalles: emprendedor.informe.error
      });
    }
    
    // Informe completado
    res.json({
      success: true,
      data: {
        emprendedor: {
          id: emprendedor._id,
          nombre: emprendedor.nombre,
          proyecto: emprendedor.proyecto?.nombre,
          sector: emprendedor.proyecto?.sector
        },
        informe: emprendedor.informe
      }
    });
    
  } catch (error) {
    console.error('❌ Error al obtener informe:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

export const regenerarInforme = async (req, res) => {
  try {
    const { id } = req.params;
    
    const emprendedor = await EmprendedorModel.buscarPorId(id);
    
    if (!emprendedor) {
      return res.status(404).json({
        success: false,
        error: 'Emprendedor no encontrado'
      });
    }
    
    // Actualizar estado a "procesando"
    await EmprendedorModel.actualizar(id, {
      'informe.estado': 'procesando',
      'informe.error': null
    });
    
    // Llamar al microservicio de IA
    const axios = (await import('axios')).default;
    const IA_ANALYZER_URL = process.env.IA_ANALYZER_URL || 'http://localhost:6000';
    
    axios.post(`${IA_ANALYZER_URL}/analyze`, { emprendedorId: id })
      .catch(error => console.error('Error al regenerar informe:', error.message));
    
    res.json({
      success: true,
      message: 'Regeneración de informe iniciada',
      estado: 'procesando'
    });
    
  } catch (error) {
    console.error('❌ Error al regenerar informe:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

export default {
  obtenerInforme,
  regenerarInforme
};
