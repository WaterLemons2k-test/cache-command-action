import { setErr } from './err';
import { writeFile } from 'fs';
import { debug } from '@actions/core';

// commandToScript write command to script.
export function writeFileWithCallback(path: string, data: string) {
  if (!path || !data) throw new Error('No supplied path and/or data.');

  debug(`Starting to write file:
  path: ${path}
  data: ${data}`);

  writeFile(path, data, err => {
    try {
      if (err) throw new Error(`Write ${data} to ${path} failed: ${err}`);
    } catch (err) {
      setErr(err);
    }
  });
  }
