import { getDatabase } from '../config/database.js';

const COLLECTION_NAME = 'emprendedor';

export const emprendedorSchema = {
  // Datos personales
  nombre: { type: String, required: true },
  apellidos: { type: String, required: true },
  correo: { type: String, required: true, unique: true },
  telefono: { type: String },
  pais: { type: String, required: true },
  ciudad: { type: String },
  
  // Usuario y seguridad
  usuario: { type: String, required: true, unique: true },
  contrasena: { type: String, required: true }, // Debe hashearse en producción
  
  // Proyecto
  proyecto: {
    nombre: { type: String, required: true },
    descripcion: { type: String, required: true },
    sector: { type: String, required: true },
    etapa: { type: String, required: true }, // idea, mvp, lanzamiento, crecimiento, escalado
    fechaInicio: { type: Date },
    problemaQueResuelve: { type: String },
    solucionPropuesta: { type: String },
    propuestaValor: { type: String },
    modeloNegocio: { type: String },
    competencia: { type: Array, default: [] },
    ventajasCompetitivas: { type: Array, default: [] }
  },
  
  // Mercado
  mercado: {
    tamano: { type: String }, // TAM, SAM, SOM
    segmentoObjetivo: { type: String },
    canalesDistribucion: { type: Array, default: [] },
    estrategiaMarketing: { type: String }
  },
  
  // Financiero
  financiero: {
    inversionNecesaria: { type: Number },
    inversionActual: { type: Number, default: 0 },
    ingresosActuales: { type: Number, default: 0 },
    proyeccionIngresos: { type: Array, default: [] },
    gastosOperativos: { type: Number, default: 0 },
    margenBruto: { type: Number },
    burn_rate: { type: Number }
  },
  
  // Equipo
  equipo: {
    fundadores: { type: Array, default: [] },
    empleados: { type: Number, default: 0 },
    asesores: { type: Array, default: [] },
    necesidadesContratacion: { type: Array, default: [] }
  },
  
  // Tecnología
  tecnologia: {
    stack: { type: Array, default: [] },
    propiedadIntelectual: { type: Boolean, default: false },
    patentes: { type: Array, default: [] },
    escalabilidad: { type: String }
  },
  
  // Tracción y métricas
  traccion: {
    usuarios: { type: Number, default: 0 },
    clientes: { type: Number, default: 0 },
    crecimientoMensual: { type: Number },
    retencion: { type: Number },
    nps: { type: Number },
    metricas: { type: Object, default: {} }
  },
  
  // INFORME DE IA (Se llena automáticamente)
  informe: {
    viabilidad: { type: Number }, // 0-100%
    valorMercado: { type: Number },
    proyectosSimilares: { type: Array, default: [] },
    recomendaciones: { type: Array, default: [] },
    pivotesSugeridos: { type: Array, default: [] },
    fortalezas: { type: Array, default: [] },
    debilidades: { type: Array, default: [] },
    oportunidades: { type: Array, default: [] },
    amenazas: { type: Array, default: [] },
    analisisCompleto: { type: String },
    fechaAnalisis: { type: Date },
    estado: { type: String, default: 'pendiente' } // pendiente, procesando, completado, error
  },
  
  // Meta información
  estado: { type: String, default: 'activo' }, // activo, inactivo, suspendido
  fechaRegistro: { type: Date, default: Date.now },
  ultimaActualizacion: { type: Date, default: Date.now }
};

export class EmprendedorModel {
  static async getCollection() {
    const db = getDatabase();
    return db.collection(COLLECTION_NAME);
  }

  static async crear(datos) {
    const collection = await this.getCollection();
    
    // Validaciones básicas
    if (!datos.correo || !datos.usuario || !datos.proyecto?.nombre) {
      throw new Error('Faltan campos requeridos: correo, usuario y nombre del proyecto');
    }
    
    // Verificar duplicados
    const existeCorreo = await collection.findOne({ correo: datos.correo });
    if (existeCorreo) {
      throw new Error('El correo ya está registrado');
    }
    
    const existeUsuario = await collection.findOne({ usuario: datos.usuario });
    if (existeUsuario) {
      throw new Error('El nombre de usuario ya está en uso');
    }
    
    // Crear documento
    const nuevoEmprendedor = {
      ...datos,
      fechaRegistro: new Date(),
      ultimaActualizacion: new Date(),
      informe: {
        estado: 'pendiente',
        ...datos.informe
      }
    };
    
    const resultado = await collection.insertOne(nuevoEmprendedor);
    return { _id: resultado.insertedId, ...nuevoEmprendedor };
  }

  static async buscarPorId(id) {
    const collection = await this.getCollection();
    const { ObjectId } = await import('mongodb');
    return await collection.findOne({ _id: new ObjectId(id) });
  }

  static async buscarPorCorreo(correo) {
    const collection = await this.getCollection();
    return await collection.findOne({ correo });
  }

  static async buscarPorUsuario(usuario) {
    const collection = await this.getCollection();
    return await collection.findOne({ usuario });
  }

  static async actualizar(id, datos) {
    const collection = await this.getCollection();
    const { ObjectId } = await import('mongodb');
    
    const datosActualizacion = {
      ...datos,
      ultimaActualizacion: new Date()
    };
    
    const resultado = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: datosActualizacion },
      { returnDocument: 'after' }
    );
    
    return resultado;
  }

  static async actualizarInforme(id, informe) {
    const collection = await this.getCollection();
    const { ObjectId } = await import('mongodb');
    
    const resultado = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          informe: {
            ...informe,
            fechaAnalisis: new Date(),
            estado: 'completado'
          },
          ultimaActualizacion: new Date()
        }
      },
      { returnDocument: 'after' }
    );
    
    return resultado;
  }

  static async listarTodos(filtros = {}, pagina = 1, limite = 10) {
    const collection = await this.getCollection();
    const skip = (pagina - 1) * limite;
    
    const emprendedores = await collection
      .find(filtros)
      .sort({ fechaRegistro: -1 })
      .skip(skip)
      .limit(limite)
      .toArray();
    
    const total = await collection.countDocuments(filtros);
    
    return {
      emprendedores,
      paginacion: {
        total,
        pagina,
        limite,
        totalPaginas: Math.ceil(total / limite)
      }
    };
  }

  static async eliminar(id) {
    const collection = await this.getCollection();
    const { ObjectId } = await import('mongodb');
    return await collection.deleteOne({ _id: new ObjectId(id) });
  }
}

export default EmprendedorModel;
