import { logger, firestore } from 'firebase-functions';
import { storage } from '../libs';

const removeMemory = firestore.document('/memories/{id}').onDelete(async (snapshot, context) => {
  try {
    // const id: string = context.params.id;
    const deleteValue = snapshot.data();
    const { user, category, name } = deleteValue;
    const fullPath = `${user}/${category}/${name}`;

    logger.info(`Deleting ${fullPath}`);

    await storage.file(fullPath).delete();
  } catch(error) {
    logger.error(error);
  }
});

export default removeMemory;