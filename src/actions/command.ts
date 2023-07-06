import { debug } from './actions';
import { EOL } from 'node:os';
import { StringDecoder } from 'node:string_decoder';
import { exec } from '@actions/exec';

interface ExecListeners {
  stdout?: (data: Buffer) => void
}

interface ExecOutput {
  exitCode: number
  stdout: string
}

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

/**
 * Exec a command and get the output.
 * Output will be streamed to the live console.
 * Returns promise with the exit code and collected stdout
 * @param command command to execute (can include additional args). Must be correctly escaped.
 * @param options optional exec listeners. See ExecListeners
 * @returns Promise<ExecOutput> exit code and stdout
 */
const getExecOutput = async (command: string, options?: ExecListeners): Promise<ExecOutput> => {
  let stdout = '';

  //Using string decoder covers the case where a mult-byte character is split
  const stdoutDecoder = new StringDecoder('utf8');

  const stdOutListener = (data: Buffer): void => {
    stdout += stdoutDecoder.write(data);
  };

  const listeners: ExecListeners = {
    stdout: stdOutListener
  };

  // flush any remaining characters
  stdout += stdoutDecoder.end();

  const exitCode = await exec(command, [], { ...options, listeners });
  return {
    exitCode,
    stdout
  };
};