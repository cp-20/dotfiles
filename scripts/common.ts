import $ from 'jsr:@david/dax';
import { block, readDirRecursive } from './utils.ts';
import { join } from 'jsr:@std/path@0.221.0/join';

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
  }, await $.commandExists('fish'));

  await block('Fisher')(async () => {
    await $`fish -c "curl -sL https://raw.githubusercontent.com/jorgebucaran/fisher/main/functions/fisher.fish | source && fisher install jorgebucaran/fisher"`;
  }, await $.commandExists('fisher'));

  await block('Fish plugins')(async () => {
    const plugins = [
      'jethrokuan/z',
      'jethrokuan/fzf',
      'oh-my-fish/theme-bobthefish',
    ];

    const installed = (await $`fish -c "fisher list"`.quiet().text()).split(
      '\n'
    );
    const notInstalled = plugins.filter(
      (plugin) => !installed.includes(plugin)
    );
    const remove = installed.filter((plugin) => !plugins.includes(plugin));
    if (notInstalled.length > 0) {
      await $`fish -c "fisher install ${notInstalled}"`;
    }
    if (remove.length > 0) {
      await $`fish -c "fisher remove ${remove}"`;
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
  }, await $.commandExists('ansible'));
};

const setupBrew = async () => {
  const result = await block('Linuxbrew')(async () => {
    await $`/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"`;
  }, await $.commandExists('brew'));

  await block('Brew packages')(async () => {
    const packages = ['ghq', 'gh', 'jnv', 'gcc', 'llvm', 'clang'];
    await $`brew install ${packages}`;
  }, result === 'ok' || result === 'skip');
};

const setupNode = async () => {
  const result = await block('Node.js')(async () => {
    await $`sudo apt install -y nodejs npm`;
    await $`sudo chmod 777 /usr/local/lib`;
    await $`sudo chmod 777 /usr/local/bin`;
    await $`sudo chmod 777 /usr/local/include`;
    await $`npm install -g n`;
    await $`n lts`;
    await $`sudo apt purge -y nodejs npm`;
    await $`sudo apt autoremove -y`;
  }, await $.commandExists('node'));

  await block('Node packages')(async () => {
    const packages = ['@google/clasp', 'wrangler'];
    await $`npm install -g ${packages}`;
  }, result === 'ok' || result === 'skip');

  await block('Deno')(async () => {
    await $`curl -fsSL https://deno.land/install.sh | sh`;
  }, await $.commandExists('deno'));

  await block('Bun')(async () => {
    await $`curl -fsSL https://bun.sh/install | bash`;
  }, await $.commandExists('bun'));
};

const setupPython = async () => {
  const result = await block('Python')(async () => {
    await $`sudo apt install -y python3 python3-pip`;
  }, await $.commandExists('python3'));

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
  }, result === 'ok' || result === 'skip');
};

const setupGo = async () => {
  await block('Go')(async () => {
    await $`sudo apt install -y golang-go`;
  }, await $.commandExists('go'));
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
  await setupPackages();
  await setupFish();
  await setupAnsible();
  await setupBrew();
  await setupNode();
  await setupPython();
  await setupGo();
  await setupSymlink();
};
