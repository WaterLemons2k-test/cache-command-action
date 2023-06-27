// import { debug } from './log';
import { debug } from '@actions/core';
import { getExecOutput } from '@actions/exec';

// getCommandOutput get the command output and trim.
export const getCommandOutput = async (command: string) => {
  debug(`Starting to get command output:
  command: ${command}`);

  const { stdout } = await getExecOutput(command);
  const output = stdout.trim();
  if (!output) throw new Error(`The stdout of ${command} is empty!`);
  debug(`output: ${output}`);
  return output;
};