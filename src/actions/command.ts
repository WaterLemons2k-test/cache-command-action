import { getExecOutput } from '@actions/exec';

// getCommandOutput get the command output and trim.
export const getCommandOutput = async (command: string) => {
  const { stdout } = await getExecOutput(command);

  // Make sure the output has no white space.
  const output = stdout.trim();
  if (output.length === 0) {
    throw new Error(`The stdout of ${command} cannot be null or empty!`);
  }
  return output;
};