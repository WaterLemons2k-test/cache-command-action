import { debug } from './log';
import { closeSync, openSync } from 'node:fs';

export const createFile = (file: string) => {
  debug(`Starting to create file:
  file: ${file}`);
  closeSync(openSync(file, 'w'));
};