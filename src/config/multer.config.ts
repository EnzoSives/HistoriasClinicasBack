import { diskStorage } from 'multer';
import { randomBytes } from 'crypto';
import { HttpException, HttpStatus } from '@nestjs/common';

// Opciones de configuración para Multer
export const multerOptions = {
  // Limitar el tamaño del archivo a 5MB
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },

  // Filtrar archivos para aceptar solo imágenes
  fileFilter: (req, file, cb) => {
    if (['image/jpeg', 'image/png', 'image/gif', 'application/pdf'].includes(file.mimetype)) {
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
      const extension = {
        'image/jpeg': '.jpg',
        'image/png': '.png',
        'image/gif': '.gif',
        'application/pdf': '.pdf',
      }[file.mimetype];
      cb(null, `${randomBytes(16).toString('hex')}${extension}`);
    },
  }),
};
