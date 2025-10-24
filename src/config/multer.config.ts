import { diskStorage } from 'multer';
import { extname } from 'path';
import { HttpException, HttpStatus } from '@nestjs/common';

// Opciones de configuración para Multer
export const multerOptions = {
  // Limitar el tamaño del archivo a 5MB
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },

  // Filtrar archivos para aceptar solo imágenes
  fileFilter: (req, file, cb) => {
    if (file.mimetype.match(/\/(jpg|jpeg|png|gif|pdf)$/)) {
      // Aceptar el archivo
      cb(null, true);
    } else {
      // Rechazar el archivo
      cb(new HttpException(`El archivo ${file.originalname} no es una imagen válida.`, HttpStatus.BAD_REQUEST), false);
    }
  },

  // Configuración de almacenamiento
  storage: diskStorage({
    // Directorio de destino para los archivos
    destination: './uploads',
    // Generar un nombre de archivo único
    filename: (req, file, cb) => {
      const randomName = Array(32)
        .fill(null)
        .map(() => Math.round(Math.random() * 16).toString(16))
        .join('');
      cb(null, `${randomName}${extname(file.originalname)}`);
    },
  }),
};
