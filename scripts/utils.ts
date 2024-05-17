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
