# Flight Computer Testing

The main goal of testing the Flight Computer is ensuring that the board receives power and that the board is loaded with the correct firmware. Follow these steps to test the Flight Computer:

1. **Jump J? on the Flight Computer**
   - Jump J? on the top side of the Flight Computer to allow the board to be supplied power from the USB.

2. **Plug in the Micro USB**
   - Plug in the Micro USB end into the Flight Computer board and plug the USB-A end into a computer.

3. **Check the LED Indicator**
   - Ensure the LED on the bottom side of the board is illuminated. If it is not, then the board is not powered. Check the following:
     1. Ensure that J? is being jumped.
     2. Check the solder joints on the USB connector and reflow the solder joints if necessary.

4. **Verify Disk Drive Recognition**
   - If the board is powered, the Computer should identify a new disk drive called PYSQUARED. If the computer does not recognize the device or shows up with a different drive name, follow these steps:
     1. If the drive shows up as RP1-RP2, then the firmware needs to be reflashed.
     2. If the device is not detected on the computer, reflow the solder joints of the Micro USB connector on the board.
     3. If the device is detected but not recognized, try reinstalling the device driver.
     4. If the device is detected and recognized as a “USB-DRIVE”, then the microcontroller is broken and the board should be replaced.

5. **Open a Terminal**
   - Open a terminal on the computer at the COM port of the Flight Computer (found using the device manager).

6. **Interrupt Running Software**
   - In case software is running on the board, press Ctrl + C to interrupt the code and press enter to enter the REPL.

7. **Import Board in REPL**
   - Once in the REPL, type “import board” and press enter.

8. **Check Pin and Bus Definitions**
   - Type “dir(board)” to bring up all of the pin and bus definitions in the firmware.

9. **Verify Board Operation**
   - If you get all of the definitions, then the Flight Computer board is operating normally. If there are errors or nothing appears, troubleshoot as follows:
     1. Ensure the correct COMS port is selected.
     2. Ensure any code is interrupted and that the REPL has been entered.
     3. Ensure there are no typos in the commands.

10. **Disconnect the Flight Computer**
    - Disconnect the Micro USB end from the Flight Computer and disconnect the Jumper at J?.&#8203;``【oaicite:0】``&#8203;
