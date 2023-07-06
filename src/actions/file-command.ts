import { appendFileSync } from 'node:fs';
import { EOL } from 'node:os';
import { v4 as uuidv4 } from 'uuid';

export const fileCommand = (command: string, message: unknown): void => {
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
export const prepareKeyValue = (key: string, value: unknown): string => {
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