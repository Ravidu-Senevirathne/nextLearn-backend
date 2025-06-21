import { diskStorage } from 'multer';
import { extname } from 'path';

export const fileStorageConfig = {
  storage: diskStorage({
    destination: './uploads/assignments',
    filename: (req, file, callback) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = extname(file.originalname);
      callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
    },
  }),
  fileFilter: (req, file, callback) => {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/png',
    ];
    if (allowedTypes.includes(file.mimetype)) {
      callback(null, true);
    } else {
      callback(new Error('Invalid file type'), false);
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
};