import { debug } from './actions';
import { EOL } from 'node:os';
import { getExecOutput } from '@actions/exec';

// getCommandOutput get the command output and trim.
export const getCommandOutput = async (command: string) => {
  const { stdout } = await getExecOutput(command);

  // Make sure the output has no white space.
  const output = stdout.trim();
  if (output.length === 0) throw new Error(`The stdout of ${command} is empty!`);

  // Ensure debug output to a new line.
  process.stdout.write(EOL);
  debug(`output: ${output}`);
  return output;
};