import { debug } from './log';
import { getExecOutput } from '@actions/exec';

// getCommandOutput get the command output and trim.
export const getCommandOutput = async (command: string) => {
  debug(`Starting to get command output:
  command: ${command}`);

  const { stdout } = await getExecOutput(command);

  // Make sure the output has no white space.
  const output = stdout.trim();
  if (!output) throw new Error(`The stdout of ${command} is empty!`);

  // Ensure debug output to a new line.
  debug(`\noutput: ${output}`);
  return output;
};