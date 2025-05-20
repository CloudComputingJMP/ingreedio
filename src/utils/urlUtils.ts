// This function removes uneccessary spaces from the input string
export const prettyString = (input: string): string =>
  input.trim().replace(/\s+/g, ' ');

// This function removes uneccessary spaces and replaces the rest of them with '%20'
export const stringToUrlString = (input: string): string =>
  prettyString(input).replace(/ /g, '%20');

// This function converts URL string to a regular string
export const urlStringToString = (input: string): string =>
  decodeURIComponent(input.replace(/%20/g, ' '));
