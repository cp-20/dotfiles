if status is-interactive
    # Commands to run in interactive sessions can go here

    # for linuxbrew
    test -d ~/.linuxbrew && eval "$(~/.linuxbrew/bin/brew shellenv)"
    test -d /home/linuxbrew/.linuxbrew && eval "$(/home/linuxbrew/.linuxbrew/bin/brew shellenv)"
    eval "/home/linuxbrew/.linuxbrew/bin/brew shellenv"
end

# view
set -g theme_display_date yes
set -g theme_date_format "+%F %H:%M"
set -g theme_display_git_default_branch yes
set -g theme_color_scheme dark

# key bindings
function fish_user_key_bindings
    bind \c] fzf_ghq # Ctrl-]
    bind \cr fzf_history # Ctrl-r
    bind \cj fzf_z # Ctrl-j
    bind \co fzf_file # Ctrl-o
end

# abbr
abbr -a fc "code ~/.config/fish/config.fish"
abbr -a gg "ghq get"
abbr -a pp pnpm

# alias
alias python=python3
alias pip=pip3

# for ansible
export EDITOR="code --wait"

# fix date
sudo hwclock -s

# Deno
export DENO_INSTALL="$HOME/.deno"
fish_add_path $DENO_INSTALL/bin

# pnpm
export PNPM_HOME="$HOME/.local/share/pnpm"
fish_add_path $PNPM_HOME

# Go
fish_add_path /usr/local/go/bin
export GOROOT=$(go env GOROOT)
fish_add_path $GOROOT/bin
fish_add_path $(go env GOPATH)/bin

# Cuda
fish_add_path /usr/local/cuda/bin

# Bun
export BUN_INSTALL="$HOME/.bun"
fish_add_path $BUN_INSTALL/bin

# Windows
fish_add_path /c/Windows/System32
fish_add_path /c/Windows/SysWOW64

# Local
fish_add_path $HOME/.local/bin
