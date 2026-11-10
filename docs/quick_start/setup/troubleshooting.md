# When things go wrong

Read the error message first. The useful line is usually the first line that says `Error` or `error:`, not the last one. Then look for it here. If it is not here, paste the whole output into an AI agent or ask in our Discord.

## Build problems

| Symptom | Cause | Fix |
| ------- | ----- | --- |
| `make: command not found` | System tools are missing | Install them in step 1 of [Set up your development environment](dev-environment.md) |
| `No such file or directory: bootable.uf2` | The build did not finish | Scroll up to the first error and fix that. Then run `make build` again |
| The Zephyr SDK download fails or hangs | Slow connection. The download is about 65 MB | Run `make zephyr-sdk` again. It retries three times. A slow connection can need more than one run |
| `Unable to apply VEML6031 data-ready timeout patch` | A submodule is dirty or on the wrong commit | Run `make submodules` again. If it still fails, run `git submodule update --init --recursive --force` |
| The build runs out of memory on a Raspberry Pi | Too many parallel jobs | Close the browser and other programs, or export `CMAKE_BUILD_PARALLEL_LEVEL=2` and run `make build` |

## Board problems

| Symptom | Cause | Fix |
| ------- | ----- | --- |
| No `RP2350` drive appears | The board is not in bootloader mode, or the cable only carries power | Hold **BOOT**, tap **RESET**, release **BOOT**. Try another USB cable |
| `picotool reboot -f -u` says `No accessible RP-series device in BOOTSEL mode` | Expected. The flight software does not expose the reset interface picotool uses | Use the **BOOT** and **RESET** buttons, the antenna board jumpers, or the `TRIGGER_BOOTLOADER` command. `picotool` still works once the board is in bootloader mode, for example `picotool load -x bootable.uf2` |
| The board is in bootloader mode but nothing mounts | On Linux, the desktop mounts the drive only for the user logged in at the screen. Over SSH, or on a Pi with no desktop, nothing mounts it | Mount it yourself, or use `picotool load -x bootable.uf2` to load the file without a mount. The `-x` starts the board after the copy. Check that the board is listed with `picotool info` |
| The board shows up as a drive called `CIRCUITPY` | The board runs CircuitPython, not the flight software | Follow the first-time steps in [Flight controller board](../paths/flight-controller.md) to install MCUboot and the flight software |
| I copied `bootable.uf2` but no serial port appears | The bootloader rejected the image. Either MCUboot is not installed yet, or your `keys/proves.pem` does not match the bootloader on the board | Install MCUboot with `make build-mcuboot`, then copy `bootable.uf2` again |
| `Permission denied` on `/dev/ttyACM0` | Your Linux user is not in the `dialout` group | Add yourself to `dialout` and log out and back in. The command is in [Set up your development environment](dev-environment.md) |
| The board resets about every 42 seconds | The hardware watchdog is enabled and the flight software is not petting it, or the board is in a boot loop | Look at the events in the GDS. On a bare board, a shunt on **J4** (`WDT_DISABLE`) disables the watchdog for bench work |
| The `RP2350` drive disappears after about 42 seconds | The hardware watchdog ended bootloader mode, because nothing pets it there | Enter bootloader mode again and copy the file sooner. See the watchdog note in [Full kit](../paths/full-kit.md#3-put-the-kit-into-bootloader-mode) |

## Ground station problems

| Symptom | Cause | Fix |
| ------- | ----- | --- |
| The GDS connection mark stays a red cross | Wrong port, or another program holds the port. Only one program can open it | Check the port with `ls /dev/ttyACM*` and restart `make gds` with the right `UART_DEVICE`. Stop YAMCS with `make yamcs-stop` if it is running |
| Commands are sent but nothing happens | The sequence number is out of sync, or your authentication key does not match the board | Run `make sync-sequence-number`. If that passes and commands still do nothing, reflash the board with `bootable.uf2` from the same clone that runs the GDS |
| `make sync-sequence-number` fails | The GDS is not running, or it is not connected to the board | Start it first and wait for the mark to flicker green |

## Windows and WSL2 problems

| Symptom | Cause | Fix |
| ------- | ----- | --- |
| WSL2 does not see the board | WSL2 has no USB by default | Install usbipd-win and attach the board. Our [WSL notes](https://open-source-space-foundation.github.io/proves-core-reference/additional-resources/wsl-notes/) have the commands. Attach the board again every time you unplug it or reboot |

## Still stuck?

- Ask in the PROVES Kit [Discord](https://discord.gg/3qQdtMMxV).
- Open an issue on the [proves-core-reference](https://github.com/Open-Source-Space-Foundation/proves-core-reference/issues) repository. Include your operating system, the command you ran, and the full output.
