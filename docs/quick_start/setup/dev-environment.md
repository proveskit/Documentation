# Set up your development environment

This page gets the flight software building on your computer. Every path in the quick start guide starts here. The first run takes about 10 minutes on a Raspberry Pi 500 or a recent laptop with a fast connection. On a slow connection, plan for an hour.

At the end you will have a folder called `proves-core-reference` with a file in it called `bootable.uf2`. That file is the flight software, built on your machine.

## 1. Install the system tools

Pick your operating system.

=== "Linux (Ubuntu, Debian, Raspberry Pi OS)"

    Open a terminal and install the packages that F Prime and Zephyr need:

    ```sh
    sudo apt update
    sudo apt install --no-install-recommends git cmake ninja-build gperf ccache \
        dfu-util device-tree-compiler wget curl python3-dev python3-venv python3-pip \
        python3-setuptools python3-tk python3-wheel xz-utils file make gcc g++ \
        libsdl2-dev libmagic1 libmbedtls-dev
    ```

    Add yourself to the `dialout` and `plugdev` groups so you can open the board's USB serial port and talk to it with `picotool` without `sudo`. Then log out and back in.

    ```sh
    sudo usermod -aG dialout,plugdev $USER
    ```

    !!! note "On a shared lab computer"
        The `apt` and `usermod` commands need `sudo`. If your account cannot use `sudo`, ask whoever set up the computer to run this step once. Everything after it works from a normal account.

    !!! tip "Raspberry Pi 500"
        Use the 64-bit Raspberry Pi OS. The list above is the full list for a Pi. Do not add `gcc-multilib`, which Zephyr's own guide lists for Intel machines. It does not exist on a Pi and the install fails.

=== "macOS"

    Install [Homebrew](https://brew.sh) if you do not have it. Then install the tools:

    ```sh
    brew install cmake ninja gperf python3 ccache qemu dtc libmagic wget git mbedtls
    ```

    When you plug in a board, macOS asks whether to allow the accessory to connect. Click **Allow**.

=== "Windows (WSL2, at your own risk)"

    F Prime does not officially support Windows. The path that works is Windows Subsystem for Linux.

    1. Open PowerShell as administrator and install Ubuntu:

        ```powershell
        wsl --install -d Ubuntu
        ```

    2. Restart, open the **Ubuntu** app, and create a user.
    3. Inside Ubuntu, follow the **Linux** tab on this page from the top.
    4. To reach a USB board from inside WSL2, install [usbipd-win](https://github.com/dorssel/usbipd-win) and attach the board each time you plug it in. Our [WSL notes](https://open-source-space-foundation.github.io/proves-core-reference/additional-resources/wsl-notes/) have the exact commands.

    Keep your clone inside the Linux file system (for example `~/proves-core-reference`), not under `/mnt/c`. Builds on `/mnt/c` are slow and sometimes fail.

## 2. Clone the flight software

```sh
git clone https://github.com/Open-Source-Space-Foundation/proves-core-reference.git
cd proves-core-reference
```

## 3. Run `make`

```sh
make
```

This one command does five things, in order. You can also run them one at a time if you want to watch each step.

| Step | Command | What it does | First run |
| ---- | ------- | ------------ | --------- |
| 1 | `make submodules` | Downloads F Prime, Zephyr, and the other libraries the project depends on | 1 to 5 minutes |
| 2 | `make fprime-venv` | Creates a Python environment with the F Prime tools. The project downloads its own copy of `uv` and Python 3.13, so you do not need to install them | 2 minutes |
| 3 | `make zephyr` | Downloads the Zephyr modules and the ARM compiler | 5 to 15 minutes |
| 4 | `make generate` | Prepares the build folder and creates your `AuthDefaultKey.h` (see below) | 1 minute |
| 5 | `make build` | Compiles the flight software into `bootable.uf2` | 2 to 10 minutes |

When `make` finishes, check for the result:

```sh
ls -lh bootable.uf2
```

You should see a file of about 1.4 MB. If you see `No such file or directory`, scroll up to the first line that says `Error` and read the [troubleshooting](troubleshooting.md) page.

!!! info "Your build made two keys"
    `make generate` created two files that are not in Git:

    - `PROVESFlightControllerReference/Components/TcSecurityDeframer/AuthDefaultKey.h` holds a random **authentication key**. The satellite only accepts commands signed with this key, and your ground station signs with the same file. Keep it. If you delete it, rebuild and reflash, or the board will ignore your commands.
    - `keys/proves.pem` is the **signing key** for the bootloader. By default it is a copy of the sample key that ships with MCUboot. That key is public knowledge, so it offers no security, but it is fine for the bench, and every kit ships with a bootloader that accepts it.

## 4. Build again after a change

Every time you change code, run:

```sh
make build
```

Only run `make generate` again if you changed a `.fpp` file or a `CMakeLists.txt` file. The build tells you if you need to.

## Next step

- No hardware yet? Continue with [Software only](../paths/software-only.md).
- Have a board or a kit? Continue with [Run a ground station](ground-station.md), then your path.
