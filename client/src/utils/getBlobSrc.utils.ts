export const getImageSrc = (blob: Blob): Promise<string> => {
  const reader = new FileReader();
  return new Promise((resolve, reject) => {
   try{
      reader.onloadend = () => {
        if (reader.result) {
          resolve(reader.result as string);
        }
      }
      reader.readAsDataURL(blob);
    } catch(err) {
      reject(err);
    }
  });
}

export const getVideoSource = (video: Blob): Promise<string> => {
  return new Promise( ( resolve, reject ) => {
    try{
      resolve(URL.createObjectURL(video));
    } catch(err) {
      reject(err);
    }
  })
}
