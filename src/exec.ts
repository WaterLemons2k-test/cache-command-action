import { debug } from '@actions/core';
import { getExecOutput } from '@actions/exec';

// getScriptOutput get the script output and trim.
export const getScriptOutput = async(shell: string, script: string) => {
  if (!shell || !script) throw new Error('No supplied shell and/or script.');

  debug(`Starting to get script output:
  shell: ${shell}
  script: ${script}`);

  const { stdout } = await getExecOutput(shell + ' ' + script);
  const output = stdout.trim();
  if (!output) throw new Error(`The stdout of ${script} is empty!`);
  debug(`output: ${output}`);
  return output;
};
