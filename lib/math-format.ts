const superscripts: Record<string, string> = {
  '0': '\u2070',
  '1': '\u00b9',
  '2': '\u00b2',
  '3': '\u00b3',
  '4': '\u2074',
  '5': '\u2075',
  '6': '\u2076',
  '7': '\u2077',
  '8': '\u2078',
  '9': '\u2079',
  '+': '\u207a',
  '-': '\u207b',
};

const subscripts: Record<string, string> = {
  '0': '\u2080',
  '1': '\u2081',
  '2': '\u2082',
  '3': '\u2083',
  '4': '\u2084',
  '5': '\u2085',
  '6': '\u2086',
  '7': '\u2087',
  '8': '\u2088',
  '9': '\u2089',
  '+': '\u208a',
  '-': '\u208b',
};

function toScript(value: string, map: Record<string, string>) {
  return value
    .split('')
    .map((char) => map[char] ?? char)
    .join('');
}

function normalizeUnicodeScripts(value: string) {
  return value
    .replace(/\u2070/g, '^0')
    .replace(/\u00b9/g, '^1')
    .replace(/\u00b2/g, '^2')
    .replace(/\u00b3/g, '^3')
    .replace(/\u2074/g, '^4')
    .replace(/\u2075/g, '^5')
    .replace(/\u2076/g, '^6')
    .replace(/\u2077/g, '^7')
    .replace(/\u2078/g, '^8')
    .replace(/\u2079/g, '^9')
    .replace(/\u2080/g, '_0')
    .replace(/\u2081/g, '_1')
    .replace(/\u2082/g, '_2')
    .replace(/\u2083/g, '_3')
    .replace(/\u2084/g, '_4')
    .replace(/\u2085/g, '_5')
    .replace(/\u2086/g, '_6')
    .replace(/\u2087/g, '_7')
    .replace(/\u2088/g, '_8')
    .replace(/\u2089/g, '_9');
}

function formatExpression(value: string) {
  return normalizeUnicodeScripts(value)
    .replace(/\\int\b/g, '\u222b')
    .replace(/\bintegral\b/gi, '\u222b')
    .replace(/\\sqrt\{([^}]+)\}/g, '\u221a($1)')
    .replace(/\u221a\s*\(([^)]+)\)/g, '\u221a($1)')
    .replace(/\bconstant\b/gi, 'C')
    .replace(/\\pi\b|\bpi\b/gi, '\u03c0')
    .replace(/\\infty\b|\binfinity\b/gi, '\u221e')
    .replace(/\\pm|\+-/g, '\u00b1')
    .replace(/\\cdot|\*/g, '\u00b7')
    .replace(/\\(sin|cos|tan|sec|csc|cot|ln|log)\b/g, '$1')
    .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '$1\u2044$2')
    .replace(/\^\\?\{([^}]+)\}/g, (_match, power) => toScript(power, superscripts))
    .replace(/_\\?\{([^}]+)\}/g, (_match, subscript) => toScript(subscript, subscripts))
    .replace(/\^([+-]?\d+)/g, (_match, power) => toScript(power, superscripts))
    .replace(/_([+-]?\d+)/g, (_match, subscript) => toScript(subscript, subscripts))
    .replace(/\s*;\s*/g, '\n')
    .replace(/\s+/g, ' ')
    .replace(/\n /g, '\n')
    .trim();
}

export function toMathLines(value: string) {
  return formatExpression(value)
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}
