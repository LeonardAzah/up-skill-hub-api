import { diskStorage } from 'multer';
import { extname } from 'path';

export const multerOptions = {
  storage: diskStorage({
    destination: './uploads',
    filename: (req, file, callback) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const fileExtName = extname(file.originalname);
      const fileName = `${file.fieldname}-${uniqueSuffix}${fileExtName}`;
      callback(null, fileName);
    },
  }),
};
