import { User } from './User';
import { Memory, Category } from './Memory';
import { AuthToken } from './AuthToken';
import { UserCriteria, FilterCriteria } from './UserCriteria';
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
export interface GetMemoryByUserParams {
  uid: string,
  filterCriteria: FilterCriteria | null,
  limit?: number,
  startAt?: any,
  startAfter?: any,
  endAt?: any,
  endBefore?: any,
}
export {
    User,
    AuthToken,
    Memory,
    Category,
    UserCriteria,
    FilterCriteria
};
