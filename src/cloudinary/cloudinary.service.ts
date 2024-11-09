import { Injectable, Logger } from '@nestjs/common';
import { CloudinaryResponse } from './cloudinary-response';
import * as streamifier from 'streamifier';
import { v2 } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  protected readonly logger = new Logger(CloudinaryService.name);

  async uploadFile(
    file: Express.Multer.File,
    folder: string,
  ): Promise<CloudinaryResponse> {
    return new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream({ folder }, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
      streamifier.createReadStream(file.buffer).pipe(upload);
    });
  }
}
