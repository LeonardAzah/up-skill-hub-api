import { FileValidator } from '@nestjs/common';
import { IFile } from '@nestjs/common/pipes/file/interfaces';
import magicBytes from 'magic-bytes.js';

export class FileSignatureValidator extends FileValidator {
  constructor() {
    super({});
  }
  buildErrorMessage(file: any): string {
    return 'Validation failed (file type does not match file signature)';
  }

  isValid(file: Express.Multer.File) {
    const fileSignatires = magicBytes(file.buffer).map((file) => file.mime);
    if (!fileSignatires.length) return false;

    const isMatch = fileSignatires.includes(file.mimetype);
    if (!isMatch) return false;

    return true;
  }
}
