# When things go wrong

Read the error message first. The useful line is usually the first line that says `Error` or `error:`, not the last one. Then look for it here. If it is not here, paste the whole output into an AI agent or ask in our Discord.

## Build problems

`make: command not found`
:   Install the system tools in step 1 of [Set up your development environment](dev-environment.md).

`No such file or directory: bootable.uf2`
:   The build did not finish. Scroll up to the first error and fix that. Then run `make build` again.

The Zephyr SDK download fails or hangs
:   Run `make zephyr-sdk` again. It retries three times. A slow connection can need more than one run. The download is about 65 MB.

`Unable to apply VEML6031 data-ready timeout patch`
:   A submodule is dirty or on the wrong commit. Run `make submodules` again. If it still fails, run `git submodule update --init --recursive --force`.

The build runs out of memory on a Raspberry Pi
:   Close the browser and other programs, or build with fewer parallel jobs by running `make build` after exporting `CMAKE_BUILD_PARALLEL_LEVEL=2`.

## Board problems

No `RP2350` drive appears
:   The board is not in bootloader mode. Hold **BOOT**, tap **RESET**, release **BOOT**. Try another USB cable. Some cables only carry power.

`picotool reboot -f -u` says `No accessible RP-series device in BOOTSEL mode`
:   Expected. The flight software does not expose the reset interface picotool uses. Use the **BOOT** and **RESET** buttons, the antenna board jumpers, or the `TRIGGER_BOOTLOADER` command. `picotool` still works once the board is in bootloader mode, for example `picotool load -x bootable.uf2`.

The board is in bootloader mode but nothing mounts
:   On Linux, the desktop mounts the drive only for the user logged in at the screen. Over SSH, or on a Pi with no desktop, mount it yourself or use `picotool load -x bootable.uf2` to load the file without a mount. The `-x` starts the board after the copy. Check that the board is listed with `picotool info`.

The board shows up as a drive called `CIRCUITPY`
:   The board runs CircuitPython, not the flight software. Follow the first-time steps in [Flight controller board](../paths/flight-controller.md) to install MCUboot and the flight software.

I copied `bootable.uf2` but no serial port appears
:   The bootloader rejected the image. Either MCUboot is not installed yet, or your `keys/proves.pem` does not match the bootloader on the board. Install MCUboot with `make build-mcuboot`, then copy `bootable.uf2` again.

`Permission denied` on `/dev/ttyACM0`
:   On Linux, add yourself to the `dialout` group and log out and back in. The command is in [Set up your development environment](dev-environment.md).

The board resets every 20 to 30 seconds
:   The hardware watchdog is enabled and the flight software is not petting it, or the board is in a boot loop. Look at the events in the GDS. On a bare board, a shunt on the **J4** header disables the watchdog for bench work.

## Ground station problems

The GDS connection mark stays a red cross
:   Check the port with `ls /dev/ttyACM*` and restart `make gds` with the right `UART_DEVICE`. Only one program can open the port. Stop YAMCS with `make yamcs-stop` if it is running.

Commands are sent but nothing happens
:   Run `make sync-sequence-number`. If that passes and commands still do nothing, your authentication key does not match the board. Reflash the board with `bootable.uf2` from the same clone that runs the GDS.

`make sync-sequence-number` fails
:   The GDS is not running, or it is not connected to the board. Start it first and wait for the mark to flicker green.

## Windows and WSL2 problems

WSL2 does not see the board
:   WSL2 has no USB by default. Install usbipd-win and attach the board. Our [WSL notes](https://open-source-space-foundation.github.io/proves-core-reference/additional-resources/wsl-notes/) have the commands. Attach the board again every time you unplug it or reboot.

## Still stuck?

- Ask in the PROVES Kit [Discord](https://discord.gg/3qQdtMMxV).
- Open an issue on the [proves-core-reference](https://github.com/Open-Source-Space-Foundation/proves-core-reference/issues) repository. Include your operating system, the command you ran, and the full output.
