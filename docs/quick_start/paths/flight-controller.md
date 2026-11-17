# Flight controller board

You have a V5e Flight Controller Board on its own, possibly fresh from the assembly house with no firmware at all. By the end of this page the board runs flight software you built, and you have sent it a command from a ground station on your computer.

!!! warning "JP6 (watchdog enable) is not soldered on the current board revision"
    On the current V5e revision the solder jumper **JP6** ships open, so the hardware watchdog cannot reset the board. Nothing on this page needs it. Bridge JP6 only when you want flight-like watchdog behavior, and read [About the watchdog](#about-the-watchdog) first.

| Step | What happens | Time |
|---|---|---|
| [1](#1-power-the-board-from-usb) | Power the board from USB | 1 min |
| [2](#2-put-the-board-into-bootloader-mode) | Enter bootloader mode (a blank board starts there on its own) | 1 min |
| [3](#3-install-the-bootloader-first-time-only) | Install MCUboot, once per board | 5 min |
| [4](#4-flash-the-flight-software) | Copy your signed `bootable.uf2` | 1 min |
| [5](#5-connect-a-ground-station) | Connect the GDS and send `CMD_NO_OP` | 5 min |
| [6](#6-check-the-board) | Sanity check | 2 min |

Before you start, finish [Set up your development environment](../setup/dev-environment.md).

<iframe src="../../../kit-viewer/viewer.html?part=flight-controller" title="Flight controller board in the PROVES Kit 3D viewer" style="width: 100%; height: 50vh; border: 0; border-radius: 8px;" loading="lazy" allow="fullscreen"></iframe>

## What you need

- The V5e flight controller board.
- A USB-C cable that carries data. A charge-only cable does not work.
- Your computer with the flight software built.

You do not need a battery board. The board runs from USB power on the bench.

## 1. Power the board from USB

Find the USB-C connector **J12** on the bottom side of the board and plug the board into your computer. An LED on the board turns on. The 5 V from the board's own USB port bypasses the power inhibits, so a bare board needs no battery and no switch. This is not true for an assembled kit, which the [Full kit](full-kit.md) page covers.

!!! danger "Antenna first, radio second"
    Never command the radio to transmit without an antenna or a dummy load on the UHF connector. The output stage can be damaged. On the bench, screw on the antenna that came with the board before you send any radio command.

## 2. Put the board into bootloader mode

!!! note "A blank board is already in bootloader mode"
    The RP2350's built-in bootloader starts on its own when the flash holds no program. A board with no firmware shows up as the `RP2350` drive as soon as you plug it in, so you can skip the buttons below.

The RP2350 has a bootloader built into the chip. In bootloader mode the board shows up on your computer as a USB drive called `RP2350`, and you load software by copying a file to it.

1. Find the two small buttons on the board, **BOOT** (SW1) and **RESET** (SW2).
2. Hold **BOOT**.
3. Tap **RESET**.
4. Release **BOOT**.

A drive called `RP2350` appears. Find its path:

=== "Linux"

    ```sh
    findmnt | grep RP2350
    ```

    The path is usually `/media/<your-user>/RP2350`. If nothing is mounted, for example over SSH, `picotool load -x bootable.uf2` loads a file without a mount and starts the board. On Raspberry Pi OS, `picotool` is installed with `sudo apt install picotool`.

=== "macOS"

    ```sh
    ls /Volumes
    ```

    The path is `/Volumes/RP2350`.

If the board already runs the flight software and you have a ground station connected, you can skip the buttons. Send `ReferenceDeployment.bootloaderTrigger.TRIGGER_BOOTLOADER` and the board reboots into bootloader mode on its own.

## 3. Install the bootloader (first time only)

A new board, or a board coming back from CircuitPython, needs MCUboot. MCUboot checks that the flight software is signed and lets the satellite update itself in orbit. You install it once.

| You run | You get | Role of the image signing key |
|---|---|---|
| `make build-mcuboot` | `mcuboot.uf2`, the bootloader | Holds the public half and checks every image |
| `make build` | `bootable.uf2`, the flight software | Signed with the private half, `keys/proves.pem` |

!!! info "Two keys, and which one you own"
    | Key | Where it lives | Made by | What it protects |
    |---|---|---|---|
    | Image signing key | `keys/proves.pem` | `make generate` copies MCUboot's sample RSA-2048 key | Which images MCUboot will boot |
    | Command authentication key | `AuthDefaultKey.h` | `make generate` makes a random key, once per clone | Which ground station can command the board |

    The sample signing key is public, which is fine on the bench. MCUboot and the flight software must use the same signing key. If you flash a bootloader built on another computer, copy that computer's `keys/proves.pem` too, or your images will not boot. The [proves-core-reference board list](https://open-source-space-foundation.github.io/proves-core-reference/additional-resources/board-list/) has the details and the SWD route.

```sh
make build-mcuboot
cp mcuboot.uf2 /media/$USER/RP2350/
```

Replace the path with the one you found. The drive disappears when the copy finishes. That means the board took the file and rebooted.

!!! tip "Save a button press"
    With `picotool`, you can load the bootloader and the flight software in one visit to bootloader mode. `picotool load mcuboot.uf2` writes the bootloader and leaves the board in bootloader mode. Then `picotool load -x bootable.uf2` writes the flight software and starts it.

## 4. Flash the flight software

Put the board into bootloader mode again (step 2). Then copy your build:

```sh
cp bootable.uf2 /media/$USER/RP2350/
```

The drive disappears again. A few seconds later the board shows up as a serial port instead. On Linux:

```sh
ls /dev/ttyACM*
```

If you see a port, the flight software is running.

!!! tip "No USB bootloader? Use SWD"
    With a debug probe on the SWD header, `make debug-install <file>` flashes through OpenOCD instead. The [proves-core-reference board list](https://open-source-space-foundation.github.io/proves-core-reference/additional-resources/board-list/) covers wiring and files.

!!! note "Copy `bootable.uf2`, not `zephyr.uf2`"
    The build folder also contains `build-artifacts/zephyr/zephyr.uf2`. That file is not signed and MCUboot will not start it. Always copy `bootable.uf2` from the top of the repository.

## 5. Connect a ground station

Follow [Run a ground station](../setup/ground-station.md). It walks you through starting the GDS, syncing the sequence number, and sending `CMD_NO_OP`.

On a bare board, expect these things:

- Many telemetry channels read zero. There are no solar faces, no battery, and no sensors connected.
- Events may report that a face or sensor did not respond. That is the software noticing that the hardware is missing.
- The board sits in safe mode because the battery voltage reads as zero without a battery board. `ReferenceDeployment.modeManager.EXIT_SAFE_MODE` takes it out for about 10 seconds, then the low battery reading puts it back and an event complains about a missing `/seq/enter_safe.bin`. On USB power that is normal, and commands and telemetry work in safe mode.

## 6. Check the board

| Check | Pass |
|---|---|
| Serial port | `/dev/ttyACM*` (Linux) or `/dev/cu.usbmodem*` (macOS) appears a few seconds after the copy |
| Ground station link | The GDS shows events arriving |
| Commanding | `CMD_NO_OP` shows a completed event |
| Bootloader round trip | `ReferenceDeployment.bootloaderTrigger.TRIGGER_BOOTLOADER` brings the `RP2350` drive back |

If any check fails, see [Troubleshooting](../setup/troubleshooting.md).

## 7. Change, build, flash, repeat

This is the development loop you will run hundreds of times:

1. Edit code.
2. `make build`
3. In the GDS, send `ReferenceDeployment.bootloaderTrigger.TRIGGER_BOOTLOADER`. Or hold **BOOT** and tap **RESET**.
4. `cp bootable.uf2 /media/$USER/RP2350/`
5. Restart the GDS and run `make sync-sequence-number`.

## About the watchdog

The V5e has a hardware watchdog that power-cycles the board if the flight software stops petting it for about 42 seconds. The solder jumper **JP6** connects the watchdog to the power supply.

| JP6 | Watchdog | Bootloader mode | When |
|---|---|---|---|
| Open (current revision default) | Cannot reset the board | Stays open until you copy a file | Bench development |
| Bridged | Power-cycles the board after ~42 s without a pet | Ends after ~42 s, so copy promptly | Flight-like testing and flight |

A shunt on **J4** (`WDT_DISABLE`) turns the watchdog off while JP6 is bridged. On a bare board J4 is two holes. Remove the shunt before flight.

## Next step

- Build a radio link with a [radio stick](radio-stick.md) or a second board.
- Read the component design documents linked from [Software only](software-only.md) to learn what the software does with the hardware you now have.
