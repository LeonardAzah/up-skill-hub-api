import {
  FileTypeValidator,
  FileValidator,
  MaxFileSizeValidator,
} from '@nestjs/common';
import { NonEmptyArray } from 'common';
import * as bytes from 'bytes';

type FileSize = `${number}${'KB' | 'MB' | 'GB'}`;
type FileType = 'png' | 'jpeg' | 'pdf';

export const createFileValidators = (
  maxSize: FileSize,
  fileTypes: NonEmptyArray<FileType>,
): FileValidator[] => {
  const fileTypeRegex = createFileTypeRegex(fileTypes);

  return [
    new MaxFileSizeValidator({ maxSize: bytes(maxSize) }),
    new FileTypeValidator({ fileType: fileTypeRegex }),
    new FileSignatureValidator(),
  ];
};
