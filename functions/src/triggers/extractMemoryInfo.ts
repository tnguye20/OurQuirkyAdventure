import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import * as crypto from 'crypto';
import { spawn } from 'child-process-promise';
import * as nodeGeocoder from 'node-geocoder';
// import { uuid } from 'uuidv4';

import { logger, RuntimeOptions, runWith } from 'firebase-functions';
import { storage } from '../libs';
import { MemoryDao } from '../daos';
import { 
  imageMagickOutputToObject,
  geoCalculate
} from '../utils';

let options: nodeGeocoder.Options = {
  provider: 'openstreetmap'
}
const runTimeOpts: RuntimeOptions = {
  timeoutSeconds: 540,
  memory: '2GB'
}
let geoCoder = nodeGeocoder(options);

const extractMemoryInfo = runWith(runTimeOpts).storage.object().onFinalize(async (object) => {
  logger.info('>>>Enter extractMemoryInfo');

  try {
    const filePath = object.name!;
    logger.info(filePath);
    const filename = filePath.split("/").pop();

    if (filename && object.name && object.contentType) {

      // Create random filename with same extension as uploaded file.
      const randomFileName = crypto.randomBytes(20).toString('hex') + path.extname(filePath);
      const tempLocalFile = path.join(os.tmpdir(), randomFileName);

      logger.info(filename, randomFileName, tempLocalFile);

      if (object.contentType.startsWith('image/')) {
        logger.info(`${filename} is an image`)
        await storage.file(filePath).download({ destination: tempLocalFile });
        const result = await spawn('identify', ['-verbose', tempLocalFile], { capture: ['stdout', 'stderr'] });

        const metadata = imageMagickOutputToObject(result.stdout);
        if (metadata) {
          // let width = 0;
          // let height = 0;
          // const geometryPattern = /^(\d+)x(\d+).*$/;
          // const match = geometryPattern.exec(metadata.Geometry.trim());
          // if( Array.isArray(match) ){
          //   if ( match.length === 3 ){
          //     width = Number(match[1]);
          //     height = Number(match[2]);
          //   }
          // }
          let updatedMetadata = {};

          let latitude = metadata.Properties["exif:GPSLatitude"];
          let latRef = metadata.Properties["exif:GPSLatitudeRef"];
          let longitude = metadata.Properties["exif:GPSLongitude"];
          let longRef = metadata.Properties["exif:GPSLongitudeRef"];
          let originalDate = metadata.Properties["exif:DateTimeOriginal"];
          let dateCreate = metadata.Properties["date:create"];

          let takenDate: string | undefined = originalDate
            ? originalDate
            : (dateCreate !== undefined)
              ? dateCreate
              : undefined;
          if (takenDate) {
            const d = new Date(takenDate.trim().replace(/(\d+):(\d+):(\d+) /, "$1/$2/$3 "));
            const takenYear = `${d.getFullYear()}`;
            const takenMonth = `${d.getMonth() + 1}`;
            updatedMetadata = { takenDate: d, takenYear, takenMonth };
            logger.info(`takenDate for ${filename} is ${takenDate.toString()}`);
          }
          else {
            logger.info(`takenDate for ${filename} can't be extracted`);
          }

          if (latitude && latRef && longitude && longRef) {
            const lat = geoCalculate(latitude, latRef);
            const lon = geoCalculate(longitude, longRef);
            const locations = await geoCoder.reverse({ lat, lon });
            const location: nodeGeocoder.Entry = locations[0];
            const gpsInfo: Record<string, any> = {};
            Object.entries(location).forEach((item) => {
              let [key, value] = item;
              gpsInfo[key] = (value === undefined || value === null) ? "" : value;
            });

            Object.assign(updatedMetadata, gpsInfo);
          }
          logger.info(updatedMetadata);
          
          const memoryDao = new MemoryDao();
          await memoryDao.updateByFileName(filename, updatedMetadata);
          
          fs.unlinkSync(tempLocalFile);
        }
      }
    }
  }
  catch (error) {
    logger.error(error);
  }
  finally {
    logger.info('<<<Exit extractMemoryInfo');
  }
});

export default extractMemoryInfo;