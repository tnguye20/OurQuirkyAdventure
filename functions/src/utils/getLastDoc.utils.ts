import { MemoryDao } from "../daos";

const getLastDoc = async(id: string) => {
  const ref = new MemoryDao(id);
  const lastDoc = await ref.memoryRef!.get();
  return lastDoc;
}

export default getLastDoc;