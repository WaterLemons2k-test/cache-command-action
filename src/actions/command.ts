import { getExecOutput } from '@actions/exec';

/**
 * Exec a command and gets the output.
 * Output will be streamed to the live console.
 * Returns promise with the stdout
 * @param command command to execute (can include additional args). 
 * Must be correctly escaped.
 * @returns Promise<string> stdout
 */
export const getCommandOutput = async (command: string): Promise<string> => {
  const { stdout } = await getExecOutput(command);

  // Make sure the output has no white space.
  const output = stdout.trim();
  if (output.length === 0) {
    throw new Error(`The stdout of ${command} cannot be null or empty!`);
  }
  return output;
};