# Full kit

You have a fully assembled 1U PROVES Kit. Flight software is already on board, with a bootloader, no startup sequence, and a safe-mode latch. By the end of this page you have powered it on, listened to it, and loaded your own build with your own authentication key so that you, and only you, can command it.

Before you start, finish [Set up your development environment](../setup/dev-environment.md).

<iframe src="../../../kit-viewer/viewer.html?part=antenna-board" title="Antenna board in the PROVES Kit 3D viewer" style="width: 100%; height: 50vh; border: 0; border-radius: 8px;" loading="lazy" allow="fullscreen"></iframe>

Everything you touch on an assembled kit is on the **antenna board**, the top face with the two tape-measure antennas. Press **Build** in the viewer to see how the kit goes together, or open the [build guide](../../kit-viewer/viewer.html?step=1) full screen.

## Meet the top face

Look at the antenna board. You will use these features, and the silkscreen labels them:

| Label | What it is | What you do with it |
| ----- | ---------- | ------------------- |
| **Remove Before Flight Pin Port** | The RBF pin. While the pin is in, the batteries are disconnected | Pull it to power on. Put it back to power off |
| **FC USB** | A USB-C port wired to the flight controller for data only. It does not power the kit | Connect your computer here |
| **FC Jumpers: BOOT SELECT** | A 2-pin header wired to the flight controller's BOOT button | Short it to enter bootloader mode |
| **FC Jumpers: RESET** | A 2-pin header wired to the flight controller's RESET button | Short it to reset |
| **FC Jumpers: WDT DISABLE** | A 2-pin header that turns off the hardware watchdog | Leave it alone unless you know why |

The feet have deployment switches. In the deployer those switches hold the satellite off, and they do the same on your desk. Stand the kit so that no foot switch is pressed, for example on its side on a soft pad, before you expect it to power on.

## 1. Power on and listen

1. Screw both antennas on if they are not already fitted. Never let the radio transmit into nothing.
2. Stand the kit so that no foot switch is pressed.
3. Connect a USB-C cable from **FC USB** to your computer.
4. Pull the RBF pin.

The kit boots on battery power. The **FC USB** port on the antenna board carries data only, so the kit does not run from USB the way a bare board does. If the batteries are flat, charge them under a bright light or take one solar face off to reach the flight controller's own USB-C port, which does power the board.

Within a few seconds a serial port appears on your computer (`ls /dev/ttyACM*` on Linux). Start the GDS on it:

```sh
cd proves-core-reference
make gds UART_DEVICE=/dev/ttyACM0
```

The connection mark flickers green and the **Channels** tab fills with real numbers: battery voltage, face temperatures, light levels, and the board's own temperature. You are listening to a satellite.

You cannot command it yet. The software on board was built in our lab with a random authentication key that you do not have. Telemetry flows down without a key. Commands need one. The next steps give the kit your key.

!!! info "Shipped in safe mode"
    Every kit ships with the flight software's safe-mode latch set. Safe mode keeps the radio and the faces powered down until a ground station says otherwise. Once your own build is on board you will exit it with a command.

## 2. Build your flight software

If you followed the setup page, you already have `bootable.uf2`, and your clone has its own `AuthDefaultKey.h`. That file is your kit's key from now on. Back it up somewhere safe and never commit it to a public repository.

If you have not built yet:

```sh
cd proves-core-reference
make
```

## 3. Put the kit into bootloader mode

With the kit powered on and connected:

1. Put a jumper block across the **BOOT SELECT** header.
2. Touch a second jumper block across the **RESET** header for a moment, or tap the pins with a bent paper clip.
3. Remove the jumper from **BOOT SELECT**.

A drive called `RP2350` appears on your computer. The flight controller inside is now in bootloader mode.

!!! tip "The command-line way, once the kit is yours"
    After your own build is on board, the GDS command `ReferenceDeployment.bootloaderTrigger.TRIGGER_BOOTLOADER` reboots the kit into bootloader mode without touching the jumpers. Raspberry Pi's `picotool reboot -f -u` does not work on a kit running the flight software, because the flight software does not expose the reset interface picotool looks for. Use the jumpers the first time.

## 4. Load your build

Copy your build to the drive. Replace the path with where `RP2350` mounted.

```sh
cp bootable.uf2 /media/$USER/RP2350/
```

The drive disappears and the kit reboots into your software. The bootloader on board accepts your build because both use the same signing key, so you do not install MCUboot again.

## 5. Take command

Start the GDS and sync the sequence number:

```sh
make gds UART_DEVICE=/dev/ttyACM0
```

In a second terminal:

```sh
make sync-sequence-number
```

Now send commands from the **Commanding** tab:

1. `CdhCore.cmdDisp.CMD_NO_OP`. The events `OpCodeDispatched` and `NoOpReceived` appear. Your key works.
2. `ReferenceDeployment.modeManager.GET_CURRENT_MODE`. It reports safe mode.
3. `ReferenceDeployment.modeManager.EXIT_SAFE_MODE`. The faces power up and more telemetry channels come alive.

From here the kit is yours. The [radio stick](radio-stick.md) path puts the same commands over the air.

## Power off and handling

- To power off, put the RBF pin back in. Unplug USB after that, not before, if you want the board to go dark at once.
- Put the RBF pin in and disconnect the batteries before you unplug any solar face.
- The kit charges its batteries from the solar faces under bright light. Indoor light is not enough to matter.
- Keep the **WDT DISABLE** header open unless the flight software is not running. The flight software pets the hardware watchdog for you.

## Next step

- Read the [ModeManager](https://open-source-space-foundation.github.io/proves-core-reference/) design document to learn what safe mode protects.
- Read the [assembly guide](../../assembly_guide/introduction.md) to learn what is inside, even if you never open it.
- Plan your first range test with the [radio stick](radio-stick.md).
