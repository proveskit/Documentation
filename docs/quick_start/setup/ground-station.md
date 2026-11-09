# Run a ground station

A ground station is the program on your computer that talks to the satellite. It shows telemetry, shows events, and sends commands. You can use either of two ground stations with the PROVES Kit:

- The **F Prime GDS**. It comes with F Prime, it needs no extra software, and it is what we use on the bench. Start here.
- **YAMCS**. A full mission control system with a web interface. Use it once you want to plan operations or look at trends over time.

Both read the same dictionary file from your build, so build first ([Set up your development environment](dev-environment.md)).

## Find the board's serial port

Plug in the board or kit with a USB cable. The flight software shows up as a USB serial device.

=== "Linux"

    ```sh
    ls -l /dev/serial/by-id/
    ```

    Look for the line that contains `PROVES_Flight_Control_Board`. It points at the port, for example `../../ttyACM0`. Use that `/dev/ttyACM` name in the commands below. If the folder is empty or has no PROVES line, the board is not running the flight software yet. Go back to your path and flash it.

=== "macOS"

    ```sh
    ls /dev/cu.usbmodem*
    ```

    The port looks like `/dev/cu.usbmodem1101`.

!!! tip
    A board in **bootloader mode** shows up as a USB drive called `RP2350`, not as a serial port. A board running the **flight software** shows up as a serial port, not as a drive. If you see the drive, the flight software is not running.

## Start the F Prime GDS

The first time only, install the framing plugin. It teaches the GDS how to sign commands with your authentication key.

```sh
make framer-plugin
```

Then start the GDS. Replace the port with yours.

```sh
make gds UART_DEVICE=/dev/ttyACM0
```

After a few seconds your browser opens `http://127.0.0.1:5000`. If it does not, open that address yourself. The connection mark in the top right corner is a red cross until the GDS hears from the board. Then it flickers green with every packet. The terminal that runs `make gds` fills with unreadable characters. That is the raw data from the board, and it is normal.

### Sync the sequence number

The satellite rejects any command whose sequence number it has already seen. This protects it from replayed radio traffic. Before your first command, and after every reflash, sync the counter. Leave the GDS running and open a second terminal:

```sh
cd proves-core-reference
make sync-sequence-number
```

It prints a short test report and ends with `1 passed`. If it ends with `1 error` or `1 failed`, the GDS is not connected to the board. Check the port and try again.

### Send your first commands

In the GDS, open the **Commanding** tab.

1. Send `CdhCore.cmdDisp.CMD_NO_OP`. It does nothing on purpose. In the **Events** tab you should see `OpCodeDispatched`, `NoOpReceived`, and `OpCodeCompleted` within a second. That proves the whole chain works: your key, the sequence number, the USB link, and the flight software.
2. Send `ReferenceDeployment.modeManager.GET_CURRENT_MODE`. The event tells you whether the board is in normal mode or safe mode.
3. Open the **Channels** tab and watch telemetry update. On a bare flight controller board many channels stay at zero because no sensors are connected. That is expected.

### Stop the GDS

Press ++ctrl+c++ in the terminal that runs `make gds`.

## Start YAMCS instead

YAMCS needs Java 11 or newer. Install it first:

=== "Linux"

    ```sh
    sudo apt install default-jre
    ```

=== "macOS"

    ```sh
    brew install openjdk
    ```

Then start YAMCS with your board's port:

```sh
make yamcs UART_DEVICE=/dev/ttyACM0
```

The first start takes a minute or two. Open `http://localhost:8090` in your browser. The `make yamcs` target starts three programs for you: the YAMCS server, a bridge that loads the F Prime events, and an adapter that reads the serial port.

To stop everything:

```sh
make yamcs-stop
```

If parameters do not appear or the port is busy, the [YAMCS section of the repository README](https://github.com/Open-Source-Space-Foundation/proves-core-reference#option-b-yamcs-alternative-mission-control-system) lists the fixes.

## Next step

Go back to your path:

- [Flight controller board](../paths/flight-controller.md)
- [Radio stick](../paths/radio-stick.md)
- [Full kit](../paths/full-kit.md)
