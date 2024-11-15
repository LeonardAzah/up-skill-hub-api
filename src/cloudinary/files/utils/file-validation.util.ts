import {
  FileTypeValidator,
  FileValidator,
  HttpStatus,
  MaxFileSizeValidator,
  ParseFilePipe,
} from '@nestjs/common';
import { NonEmptyArray } from 'common';
import * as bytes from 'bytes';
import { lookup } from 'mime-types';
import { FileSignatureValidator } from 'cloudinary/files/validators/file-signature.validator';

type FileSize = `${number}${'KB' | 'MB' | 'GB'}`;
type FileType = 'png' | 'jpeg';

type ContentFileType =
  | 'pdf'
  | 'mp4'
  | 'mkv'
  | 'mov'
  | 'wmv'
  | 'flv'
  | 'avi'
  | 'webm';

const createFileTypeRegex = (fileTypes: FileType[] | ContentFileType[]) => {
  const mediaTypes = fileTypes.map((type) => lookup(type));
  return new RegExp(mediaTypes.join('|'));
};

export const createFileValidators = (
  maxSize: FileSize,
  fileTypes: FileType[] | ContentFileType[],
): FileValidator[] => {
  const fileTypeRegex = createFileTypeRegex(fileTypes);

  return [
    new MaxFileSizeValidator({ maxSize: bytes(maxSize) }),
    new FileTypeValidator({ fileType: fileTypeRegex }),
    new FileSignatureValidator(),
  ];
};
export const createVideoFileValidators = (
  maxSize: FileSize,
  fileTypes: ContentFileType[],
): FileValidator[] => {
  const fileTypeRegex = createFileTypeRegex(fileTypes);

  return [
    new MaxFileSizeValidator({ maxSize: bytes(maxSize) }),
    new FileTypeValidator({ fileType: fileTypeRegex }),
  ];
};

export const createParseFilePipe = (
  maxSize: FileSize,
  ...fileTypes: NonEmptyArray<FileType>
) =>
  new ParseFilePipe({
    validators: createFileValidators(maxSize, fileTypes),
    errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
  });

export const createContentParseFilePipe = (
  maxSize: FileSize,
  ...fileTypes: NonEmptyArray<ContentFileType>
) =>
  new ParseFilePipe({
    validators: createVideoFileValidators(maxSize, fileTypes),
    errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
  });
