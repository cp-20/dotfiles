# dotfiles

## WSL

```sh
# 1. Install dependencies with apt
sudo apt update
sudo apt upgrade -y
sudo apt install -y curl wget unzip git

# 2. Clone the dotfiles repository (update if exists)
if [ -d "$HOME/ghq/github.com/cp-20/dotfiles" ]; then
  cd ~/ghq/github.com/cp-20/dotfiles
  git pull
  cd ~
else
  git clone https://github.com/cp-20/dotfiles.git ~/ghq/github.com/cp-20/dotfiles # or preferred directory
fi

# 3. Install Deno temporally for the initial setup
# TODO: setup with compiled binary, without Deno directly
curl -fsSL https://deno.land/install.sh | DENO_INSTALL=/tmp/.deno sh

# 4. Run the initial setup
/tmp/.deno/bin/deno run -A ~/ghq/github.com/cp-20/dotfiles/scripts/wsl.ts

# 5. update shell variables
source ~/.bashrc

# 5. Clean up
rm -rf /tmp/.deno
```
