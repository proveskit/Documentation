# Radio stick

The PROVES Radio Stick is a USB stick with the same LoRa radio module as the V5e flight controller board. It is the ground half of a radio link. On its own it has nothing to talk to, so this path assumes you also have a flight controller board or a kit, or that a teammate does.

By the end of this page the stick acts as a radio passthrough, and your ground station sends commands over the air instead of over a USB cable.

Before you start, finish [Set up your development environment](../setup/dev-environment.md) and get a board or kit running the flight software ([Flight controller board](flight-controller.md) or [Full kit](full-kit.md)).

## What you need

- The radio stick with its SMA antenna screwed on. Never transmit without the antenna.
- A USB-C cable that carries data.
- A board or kit running the flight software, with its own antenna on.

!!! warning "Radio licensing"
    The kit transmits in the 70 cm amateur band at 437.4 MHz by default. In the United States you need an amateur radio license to transmit there, and other countries have their own rules. Keep transmit power at the minimum for bench tests and get the right license before you go outside.

## 1. Load the passthrough software

The stick runs CircuitPython with a small program that forwards radio packets to and from your computer. The program lives in the `circuit-python-passthrough` folder of `proves-core-reference`.

!!! warning "Check what shipped on your stick"
    The radio stick is new, and its software is still catching up with the hardware. Your stick may have arrived with the passthrough already installed. Plug it in first. If two serial ports appear and the first one prints `LoRa Receiver receiving packets`, skip to step 2. If not, the [proves-radio-stick repository](https://github.com/proveskit/proves-radio-stick) README says which CircuitPython build to use for your stick version.

1. Hold **BOOT**, tap **RESET**, and release **BOOT**. The stick appears as a drive called `RP2350`.
2. Copy the CircuitPython `.uf2` file for your stick to the drive. The stick reboots and reappears as a drive called `CIRCUITPY`.
3. Install the passthrough program. Replace the path with where `CIRCUITPY` mounted.

    ```sh
    cd proves-core-reference/circuit-python-passthrough
    make install lora BOARD_MOUNT_POINT=/media/$USER/CIRCUITPY
    ```

The stick restarts and now presents two serial ports. The first is a console where it prints what it hears. The second is the data port your ground station uses.

## 2. Watch it listen

Open the first serial port in a terminal program. On Linux:

```sh
screen /dev/ttyACM0 115200
```

You should see:

```
[INFO] LoRa Receiver receiving packets
[INFO] Packets received: 0
```

Power on the flight controller board or kit nearby. The packet count climbs every time the satellite sends a beacon. If it stays at zero after a minute, check that both antennas are on and that the board is running the flight software.

Leave this terminal open. Press ++ctrl+a++ then ++k++ to quit `screen` later.

## 3. Point the ground station at the radio

Start the GDS on the stick's **second** serial port, not the console:

```sh
cd proves-core-reference
make gds UART_DEVICE=/dev/ttyACM1
```

Then sync the sequence number and send `CdhCore.cmdDisp.CMD_NO_OP`, as in [Run a ground station](../setup/ground-station.md). The `[INFO] Packets received` count on the console ticks up when the satellite answers.

Radio is slower than USB. A command and its answer can take a few seconds, and the GDS connection mark flickers green with every packet.

## Next step

- Walk the two ends apart and watch the signal strength in the telemetry. A real range test needs about a kilometre of clear line of sight between the two ends.
- When your satellite is a complete kit, continue with [Full kit](full-kit.md).
