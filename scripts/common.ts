import $ from 'jsr:@david/dax';
import { green, red } from 'https://deno.land/std@0.224.0/fmt/colors.ts';
import { readDirRecursive } from './utils.ts';
import { join } from 'jsr:@std/path@0.221.0/join';

export const log = {
  start: (msg: string) =>
    console.log(`TASK [${msg}] ${'-'.repeat(80 - msg.length)}`),
  end: (msg: string) => console.log(`${green('[ok]')} ${msg}`),
  skip: (msg: string) => console.log(`${green('[skip]')} ${msg}`),
  error: (msg: string) => console.log(`${red('[error]')} ${msg}`),
};

export const which = async (cmd: string) => {
  try {
    return (await $`which ${cmd}`.quiet()).code === 0;
  } catch (_err) {
    return false;
  }
};

export const block =
  (name: string) => async (install: () => Promise<unknown>, skip?: boolean) => {
    if (skip) return log.skip(`Skipping ${name}`);

    try {
      log.start(`Setting up ${name}`);
      await install();
      log.end(`Successfully set up ${name}`);
    } catch (err) {
      log.error(`Something went wrong in setting up ${name}`);
      console.error(err);
    }
  };

const setupDir = async () => {
  await block('Directory')(async () => {
    await $`mkdir -p ~/ghq`;
  });
};

const setupPackages = async () => {
  await block('Package')(async () => {
    await $`sudo apt update`;
    await $`sudo apt upgrade -y`;
    await $`sudo apt install -y make sqlite3 jq git curl wget unzip zip tar`;
  });
};

const setupFish = async () => {
  await block('Fish shell')(async () => {
    await $`sudo apt-add-repository ppa:fish-shell/release-3 -y `;
    await $`sudo apt update`;
    await $`sudo apt install -y fish`;
  }, await which('fish'));

  await block('Fisher')(async () => {
    await $`curl -sL https://raw.githubusercontent.com/jorgebucaran/fisher/main/functions/fisher.fish | source && fisher install jorgebucaran/fisher`;
  }, await which('fisher'));

  await block('Fish plugins')(async () => {
    const plugins = [
      'jethrokuan/z',
      'jethrokuan/fzf',
      'oh-my-fish/theme-bobthefish',
    ];

    const installed = (await $`fisher list`.quiet().text()).split('\n');
    const notInstalled = plugins.filter(
      (plugin) => !installed.includes(plugin)
    );
    const remove = installed.filter((plugin) => !plugins.includes(plugin));
    if (notInstalled.length > 0) {
      await $`fisher install ${notInstalled}`;
    }
    if (remove.length > 0) {
      await $`fisher remove ${remove}`;
    }
  });

  await block('Default shell')(async () => {
    await $`chsh -s $(which fish)`;
  });
};

const setupAnsible = async () => {
  await block('Ansible')(async () => {
    await $`sudo apt update`;
    await $`sudo apt install software-properties-common`;
    await $`sudo apt-add-repository --yes --update ppa:ansible/ansible`;
    await $`sudo apt install -y ansible`;
  }, await which('ansible'));
};

const setupBrew = async () => {
  await block('Linuxbrew')(async () => {
    await $`/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"`;
  }, await which('brew'));

  await block('Brew packages')(async () => {
    const packages = ['ghq', 'gh', 'jnv', 'gcc', 'llvm', 'clang'];
    await $`brew install ${packages}`;
  });
};

const setupNode = async () => {
  await block('Node.js')(async () => {
    await $`sudo apt install -y nodejs npm`;
    await $`npm install -g n`;
    await $`n lts`;
    await $`sudo apt purge -y nodejs npm`;
    await $`sudo apt autoremove -y`;
  }, await which('node'));

  await block('Node packages')(async () => {
    const packages = ['@google/clasp', 'wrangler'];
    await $`npm install -g ${packages}`;
  });

  await block('Deno')(async () => {
    await $`curl -fsSL https://deno.land/install.sh | sh`;
  }, await which('deno'));

  await block('Bun')(async () => {
    await $`curl -fsSL https://bun.sh/install | bash`;
  }, await which('bun'));
};

const setupPython = async () => {
  await block('Python')(async () => {
    await $`sudo apt install -y python3 python3-pip`;
  }, await which('python3'));

  await block('Python packages')(async () => {
    const packages = [
      'black',
      'colorama',
      'Jinja2',
      'matplotlib',
      'modal-client',
      'numpy',
      'Pillow',
      'pip',
      'requests',
      'scikit-learn',
      'scipy',
      'sympy',
      'torch',
      'tqdm',
    ];
    await $`python3 -m pip3 install ${packages}`;
  });
};

const setupGo = async () => {
  await block('Go')(async () => {
    await $`sudo apt install -y golang-go`;
  }, await which('go'));
};

const setupSymlink = async () => {
  await block('Symlink')(async () => {
    const filesDirPath = join(import.meta.url, './files');
    const files = await readDirRecursive(filesDirPath);
    for (const file of files) {
      const path = join('~/', file.replace(filesDirPath, ''));
      await $`ln -s ${path} ${file}`;
    }
  });
};

export const setupCommon = async () => {
  await setupDir();
  await setupPackages();
  await setupFish();
  await setupAnsible();
  await setupBrew();
  await setupNode();
  await setupPython();
  await setupGo();
  await setupSymlink();
};
