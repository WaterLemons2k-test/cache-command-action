// replaceLF replace Line feed to an URL encoded character.
// https://www.eso.org/~ndelmott/url_encode.html
const replaceLF = (s: string) => {
  return s.replace(/\n/g, '%0A');
};

/**
 * Writing logs with a command
 * https://docs.github.com/en/actions/using-workflows/workflow-commands-for-github-actions
 * @param command Command of the message
 * @param message The message that will replace Line feed
 * @param options optional command options. See commandOptions
 */
export const logCommand = (command: string, message: string) => {
  command = `::${command}::`;

  console.log(command + replaceLF(message));
};