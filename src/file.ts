import { debug, failed } from './log';
import { closeSync, openSync, unlink } from 'node:fs';

/**
 * Create a empty file
 * @param file File to be created
 */
export const createFile = (file: string) => {
  debug(`Starting to create file:
  file: ${file}`);
  closeSync(openSync(file, 'w'));
};

/**
 * Delete a file
 * @param file File to be deleted
 */
export const deleteFile = (file: string) => {
  debug(`Starting to delete file;
  file: ${file}`);
  unlink(file, (err) => {
    if (err) failed(err);
  });
};