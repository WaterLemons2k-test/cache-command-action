import { debug } from '@actions/core';
import { getExecOutput } from '@actions/exec';

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
