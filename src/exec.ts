import { debug } from './log';
import { getExecOutput } from '@actions/exec';

// getScriptOutput get the script output and trim.
export const getScriptOutput = async (shell: string, script: string) => {
  debug(`Starting to get script output:
  shell: ${shell}
  script: ${script}`);

  const { stdout } = await getExecOutput(shell, [script], { silent: true });
  const output = stdout.trim();
  if (!output) throw new Error(`The stdout of ${script} is empty!`);
  debug(`output: ${output}`);
  return output;
};