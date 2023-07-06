import { closeSync, openSync, unlinkSync } from 'node:fs';

/**
 * Create a empty file
 * @param file File to be created
 */
export const createFile = (file: string) => {
  closeSync(openSync(file, 'w'));
};

/**
 * Delete a file
 * @param file File to be deleted
 */
export const deleteFile = (file: string) => {
  unlinkSync(file);
};
