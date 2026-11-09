# Radio stick

The PROVES Radio Stick is a USB stick with the same LoRa radio module as the V5e flight controller board. It is the ground half of a radio link. On its own it has nothing to talk to, so this path assumes you also have a flight controller board or a kit, or that a teammate does.

By the end of this page the stick runs the Ground Radio Controller software, and your ground station sends commands over the air instead of over a USB cable.

Before you start, finish [Set up your development environment](../setup/dev-environment.md) and get a board or kit running the flight software ([Flight controller board](flight-controller.md) or [Full kit](full-kit.md)).

## What you need

- The radio stick with its SMA antenna screwed on. Never transmit without the antenna.
- A USB-C cable that carries data. The stick draws more than a basic USB 2.0 port supplies when it transmits at full power, so use a USB 3 port or a powered hub.
- A board or kit running the flight software, with its own antenna on.

!!! warning "Radio licensing"
    The kit transmits in the 70 cm amateur band at 437.4 MHz by default. In the United States you need an amateur radio license to transmit there, and other countries have their own rules. Keep transmit power at the minimum for bench tests and get the right license before you go outside.

## 1. Build the Ground Radio Controller software

The stick ships with no software. You load the **Ground Radio Controller** (GRC), an F Prime application that turns the stick into a LoRa modem for your computer. It lives in its own repository, with the same build tools as the flight software.

```sh
git clone https://github.com/Open-Source-Space-Foundation/ground-radio-controller.git
cd ground-radio-controller
```

The repository builds for its own ground radio controller board by default. Point it at the stick instead. Open `settings.ini` and change the `BOARD` line:

```diff
-                        BOARD=ground_radio_controller/rp2350a/m33
+                        BOARD=proves_radio_stick_v2/rp2350a/m33
```

The stick's radio chip needs one fix to the Zephyr driver that has not reached upstream yet. Apply it once, after the first `make build` has fetched the Zephyr submodule, then regenerate and build:

```sh
make build
cd lib/zephyr-workspace/zephyr
git apply ../../../patches/zephyr-sx126x-wakeup-busy-delay.patch
cd -
make generate
make build
```

Without the patch the radio sometimes ignores its first command after it wakes up, so retunes are lost and the link looks flaky for no visible reason. `patches/README.md` in the repository explains the fault.

The first `make build` downloads the Zephyr SDK and takes about as long as the flight software did. When it finishes, the file to load is `build-artifacts/zephyr.uf2`. The stick has no MCUboot, so this file is unsigned and that is correct here.

!!! note "Radio stick versions"
    The `proves_radio_stick_v2` board definition is for the stick with the EByte E22-400M30S module, the same module as the V5e. If your stick is a different revision, check the [ground-radio-controller](https://github.com/Open-Source-Space-Foundation/ground-radio-controller) README for the board name to use.

## 2. Load it

1. Hold **BOOT**, tap **RESET**, and release **BOOT**. The stick appears as a drive called `RP2350`.
2. Copy the build to the drive. Replace the path with where `RP2350` mounted.

    ```sh
    cp build-artifacts/zephyr.uf2 /media/$USER/RP2350/
    ```

The drive disappears and the stick reboots as a Ground Radio Controller. It presents two serial ports. On Linux, find them by name instead of guessing `ttyACM` numbers:

```sh
ls /dev/serial/by-id/usb-F_Prime_Ground_Radio_Controller_*
```

```
/dev/serial/by-id/usb-F_Prime_Ground_Radio_Controller_291E95CA969699F2-if00
/dev/serial/by-id/usb-F_Prime_Ground_Radio_Controller_291E95CA969699F2-if02
```

The long hexadecimal string is your stick's serial number. `-if00` is the **control port**, which commands the stick itself. `-if02` is the **data port**, which carries everything that goes over the air.

## 3. Point the ground station at the radio

Start the flight software's GDS on the **data port**, not the control port:

```sh
cd proves-core-reference
make gds UART_DEVICE=/dev/serial/by-id/usb-F_Prime_Ground_Radio_Controller_291E95CA969699F2-if02
```

Power on the flight controller board or kit nearby. The GDS connection mark flickers green each time the satellite's beacon arrives. Then sync the sequence number and send `CdhCore.cmdDisp.CMD_NO_OP`, as in [Run a ground station](../setup/ground-station.md).

Radio is slower than USB. A command and its answer can take a few seconds, and a full-size packet spends about a second on the air. Single commands are fine. File uplinks need a pause between packets, which the proves-core-reference README covers under over-the-air updates.

!!! tip "Do not `cat` the data port"
    If you want to watch raw bytes, use `socat OPEN:/dev/serial/by-id/...-if02,rawer -`. Plain `cat` leaves the terminal's echo on, and every byte you read goes straight back out over the radio.

## Changing the frequency

The stick and the flight software share the same LoRa settings, so a stock build talks to a stock kit. If your satellite is on a different frequency, the control port is where you change the stick. In the `ground-radio-controller` folder, write a file called `testconfig` that names your stick:

```
BOARD_ONE = "291E95CA969699F2"
```

Then `make gds` in that folder opens a second GDS, for the stick itself, and the command `SET_FREQ` retunes it. Close it before you start the flight software's GDS, because both open the same web address.

## Next step

- Walk the two ends apart and watch the signal strength in the telemetry. A real range test needs about a kilometre of clear line of sight between the two ends.
- When your satellite is a complete kit, continue with [Full kit](full-kit.md).
