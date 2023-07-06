import { debug, failed } from './log';
import { appendFileSync, closeSync, openSync, unlink } from 'node:fs';
import { EOL } from 'node:os';

/**
 * Create a empty file
 * @param file File to be created
 */
export const createFile = (file: string) => {
  debug(`Starting to create file:
  file: ${file}`);
  closeSync(openSync(file, 'w'));
};

/**
 * Delete a file
 * @param file File to be deleted
 */
export const deleteFile = (file: string) => {
  debug(`Starting to delete file:
  file: ${file}`);
  unlink(file, (err) => {
    if (err) failed(err);
  });
};

/**
 * Sets the value of an output.
 * https://github.com/actions/toolkit/issues/1218#issuecomment-1288890856
 * @param key keys of the output to set
 * @param value value to store. Non-string values will be converted to a string via JSON.stringify
 */
export const setOutput = (key: string, value: unknown) => {
  const filePath = process.env['GITHUB_OUTPUT'] || '';

  // Converted value to a string.
  value = toStringValue(value);

  if (filePath) {
    debug(`Set output: ${key}=${value}`);
    appendFileSync(filePath, `${key}=${value}${EOL}`, {
      encoding: 'utf8'
    });
  }
};

/**
 * Sanitizes an value into a string
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

  debug(`Converted value: ${value} to a string via JSON.stringify.`);
  return JSON.stringify(value);
};