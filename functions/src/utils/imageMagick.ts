import { ImageMagickMetadata } from "../interfaces";

/**
 * Convert the output of ImageMagick's `identify -verbose` command to a JavaScript Object.
 */
const imageMagickOutputToObject = (input: string): ImageMagickMetadata | null => {
  let previousLineIndent = 0;
  const lines = input.match(/[^\r\n]+/g);
  if (lines) {
    lines.shift(); // Remove First line
    lines.forEach((line, index) => {
      const currentIdent = line.search(/\S/);
      line = line.trim();
      if (line.endsWith(':')) {
        lines[index] = makeKeyFirebaseCompatible(`"${line.replace(':', '":{')}`);
      }
      else {
        const split = line.replace('"', '\\"').split(': ');
        if (split.length > 2){
          // We have a rough entry
          while( split.length > 2 ){
          split[1] += split.pop()!.trim();
          }
        }
        split[0] = makeKeyFirebaseCompatible(split[0]);
        lines[index] = `"${split.join('":"')}",`;
      }
      if (currentIdent < previousLineIndent) {
        lines[index - 1] = lines[index - 1].substring(0, lines[index - 1].length - 1);
        lines[index] = new Array(1 + (previousLineIndent - currentIdent) / 2).join('}') + ',' + lines[index];
      }
      previousLineIndent = currentIdent;
    });
    let output: string = lines.join('');
    output = '{' + output.substring(0, output.length - 1) + '}'; // remove trailing comma.
    const parsed: ImageMagickMetadata = JSON.parse(output);
    return parsed;
  }
  return null;
}

/**
 * Makes sure the given string does not contain characters that can't be used as Firebase
 * Realtime Database keys such as '.' and replaces them by '*'.
 */
const makeKeyFirebaseCompatible = (key: string): string => {
  return key.replace(/\./g, '*');
}

export {
  makeKeyFirebaseCompatible,
  imageMagickOutputToObject,
}
