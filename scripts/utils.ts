import { cyan, green, red } from 'https://deno.land/std@0.224.0/fmt/colors.ts';
import { setupResults } from './result.ts';

export const readDirRecursive = async (dir: string): Promise<string[]> => {
  const result: string[] = [];
  for await (const file of Deno.readDir(dir)) {
    const path = `${dir}/${file.name}`;
    if (file.isDirectory) {
      result.push(...(await readDirRecursive(path)));
    } else {
      result.push(path);
    }
  }
  return result;
};

export const log = {
  start: (msg: string) =>
    console.log(`\n\nTASK [${msg}] ${'-'.repeat(80 - msg.length)}`),
  end: (msg: string) => console.log(`${green('[ok]')} ${msg}`),
  skip: (msg: string) => console.log(`${cyan('[skip]')} ${msg}`),
  error: (msg: string) => console.log(`${red('[error]')} ${msg}`),
};

export const block =
  (name: string) => async (install: () => Promise<unknown>, skip?: boolean) => {
    if (skip) {
      log.skip(`Skipping ${name}`);
      setupResults.push({ name, result: 'skip' });
      return 'skip';
    }

    try {
      log.start(`Setting up ${name}`);
      await install();
      log.end(`Successfully set up ${name}`);
      setupResults.push({ name, result: 'ok' });
      return 'ok';
    } catch (err) {
      log.error(`Something went wrong in setting up ${name}`);
      setupResults.push({ name, result: 'error' });
      console.error(err);
      return 'error';
    }
  };
