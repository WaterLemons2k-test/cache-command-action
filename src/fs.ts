import { handleErr } from './err';
import { writeFile } from 'fs';
import { debug } from '@actions/core';

// commandToScript write command to script.
export function commandToScript(command: string, script: string) {
    if (!command || !script) throw new Error('commandToScript: No supplied command or script.');
  
    debug(`Starting to write command to script:
    command: ${command}
    script: ${script}`);
  
    writeFile(script, command, err => {
      try {
        if (err) throw new Error(`Write command to script failed: ${err}`);
      } catch (err) {
        handleErr(err);
      }
    });
  }
