# Testing a FlatSat Functions Using the REPL
So, you just got all the parts for a PROVES Kit! What now?

!!! info "Guide Version Control"

    Version Number: V0
    Written By: Michael Pham
    Published May 14, 2025
    
    Dev Enviroment Used:
    - MacOS
    - Tabby Terminal Software
    - `pysquared v2.0.0-alpha-25w20`
    - Flight Controller Board V5a
    - XY Solar Panel V2

The good news is that it is easier than ever to get things running and code tested. This guide presumes that you have already setup a developer enviroment on your computer and have a built engineering unit or "FlatSat" wired up in front of you. That should look something like the attatched **Figure X**.

## Step 1: Connecting to the Flight Controller Board
There should just be a single USB-C for you to plug into with your computer. From here openning a serial terminal using your preferred software will get you hooked up with the board's CircuitPython Enviroment. This process should look like what you see in **Figure X**. 

The baud rate doesn't really matter just choose something bigger than 9600.

!!! bug "Time Sensitive Serial Connection with RP2350"

    If you are using a V5a+ board, you'll need to open this serial connection within about 13s of board power up. The reason for this is explained in the following GitHub issue:

    [[BUG] Use of PySquared safe_sleep Disables USB Connections #4](https://github.com/proveskit/CircuitPython_RP2350_v5a/issues/4)

Once you are connected to the Flight Controller Board try using ++ctrl+c++ to interupt the code and then hit ++enter++ to go into the `REPL`.

??? note "No Big Logger Output?"

    Logs will appear by default in a `json` format when our CircuitPython Flight Software is installed. If you don't see logs appear make sure you have actually installed software onto the board using your computer's development terminal!

    
