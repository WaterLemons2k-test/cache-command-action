import { appendFileSync, closeSync, openSync, unlinkSync } from 'node:fs';
import { EOL } from 'node:os';
import { v4 as uuidv4 } from 'uuid';

/**
 * Create a empty file
 * @param file File to be created
 */
export const createFile = (file: string) => {
  closeSync(openSync(file, 'w'));
};

/**
 * Delete a file
 * @param file File to be deleted
 */
export const deleteFile = (file: string) => {
  unlinkSync(file);
};

/**
 * Gets the input of an input.
 * Returns an empty string if the value is not defined.
 * @param name name of the input to get
 * @returns 
 */
export const getInput = (name: string): string => {
  const value: string = process.env[`INPUT_${name.toLocaleUpperCase()}`] || '';

  return value.trim();
};

/**
 * Sets the value of an output.
 * https://github.com/actions/toolkit/issues/1218#issuecomment-1288890856
 * @param key keys of the output to set
 * @param value value to store. Non-string values will be converted to a string via JSON.stringify
 */
export const setOutput = (key: string, value: unknown) => {
  const filePath = process.env['GITHUB_OUTPUT'] || '';

  if (filePath) {
    fileCommand('OUTPUT', prepareKeyValue(key, value));
  }
};

const fileCommand = (command: string, message: unknown): void => {
  const filePath = process.env[`GITHUB_${command}`];
  if (!filePath) {
    throw new Error(
      `Unable to find environment variable for file command ${command}`
    );
  }

  appendFileSync(filePath, `${toStringValue(message)}${EOL}`, {
    encoding: 'utf8'
  });
};

// https://github.com/actions/toolkit/blob/main/packages/core/src/file-command.ts#L27
const prepareKeyValue = (key: string, value: unknown): string => {
  const delimiter = `ghadelimiter_${uuidv4()}`;

  // Converted value to a string.
  const convertedValue = toStringValue(value);

  // These should realistically never happen, but just in case someone finds a
  // way to exploit uuid generation let's not allow keys or values that contain
  // the delimiter.
  if (key.includes(delimiter)) {
    throw new Error(
      `Unexpected input: name should not contain the delimiter "${delimiter}"`
    );
  }

  if (convertedValue.includes(delimiter)) {
    throw new Error(
      `Unexpected input: value should not contain the delimiter "${delimiter}"`
    );
  }

  return `${key}<<${delimiter}${EOL}${convertedValue}${EOL}${delimiter}`;
};

/**
 * Sanitizes an value into a string
 * https://github.com/actions/toolkit/blob/main/packages/core/src/utils.ts#L11
 * @param value value to sanitize into a string
 * @returns string sterilized
 */
const toStringValue = (value: unknown): string => {
  if (value === null || value === undefined) {
    return '';
  }

  if (typeof value === 'string' || value instanceof String) {
    return value as string;
  }

  return JSON.stringify(value);
};