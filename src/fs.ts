import { debug } from './log';
import { closeSync, openSync } from 'fs';

/**
 * Create a empty file
 * @param file File to be created
 */
export const createFile = (file: string) => {
  debug(`Starting to create file:
  file: ${file}`);
  closeSync(openSync(file, 'w'));
};