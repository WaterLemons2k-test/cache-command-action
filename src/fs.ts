import { failed } from './log';
import { writeFile as _writeFile } from 'fs';
import { debug } from '@actions/core';

// writeFile write data to file.
export function writeFile(path: string, data: string) {
  debug(`Starting to write file:
  path: ${path}
  data: ${data}`);

  _writeFile(path, data, err => {
    try {
      if (err) throw new Error(`Write ${data} to ${path} failed: ${err}`);
    } catch (err) {
      failed(err);
    }
  });
}