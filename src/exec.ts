import { handleErr } from './err';
import { writeFile } from 'fs';
import { getExecOutput } from '@actions/exec';
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

// getScriptOutput get the script output and trim.
export async function getScriptOutput(shell: string, script: string) {
  if (!shell || !script) throw new Error('getScriptOutput: No supplied shell or script.');

  debug(`Starting to get script output:
  shell: ${shell}
  script: ${script}`);

  const { stdout } = await getExecOutput(shell + ' ' + script);
  const output = stdout.trim();
  if (!output) throw new Error('Command output is empty.');
  debug(`output: ${output}`);
  return output;
}
