import { cyan, green, red } from 'https://deno.land/std@0.224.0/fmt/colors.ts';

type Result = 'ok' | 'skip' | 'error';
type SetupResult = {
  name: string;
  result: Result;
};

const resultWithColor = (result: Result) => {
  switch (result) {
    case 'ok':
      return green('[ok]');
    case 'skip':
      return cyan('[skip]');
    case 'error':
      return red('[error]');
  }
};

export const setupResults: SetupResult[] = [];

export const printResults = () => {
  console.log('\n\nResult Summary:');
  for (const { name, result } of setupResults) {
    console.log(`${resultWithColor(result)} ${name}`);
  }
};
