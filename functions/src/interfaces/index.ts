import { User } from './User';
import { Memory, Category } from './Memory';
import { AuthToken } from './AuthToken';

export interface ImageMagickMetadata {
  Geometry: string,
  Properties: {
    'exif:GPSLatitude': string | undefined,
    'exif:GPSLatitudeRef': string | undefined,
    'exif:GPSLongitude': string | undefined,
    'exif:GPSLongitudeRef': string | undefined,
    'exif:DateTimeOriginal': string | undefined,
    'date:create': string | undefined
  }
}

export {
    User,
    AuthToken,
    Memory,
    Category
};
