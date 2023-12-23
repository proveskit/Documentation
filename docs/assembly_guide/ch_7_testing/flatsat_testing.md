# Flat Sat Testing

The main objective of this test is to connect all the electronics outside of the structure, ensuring that everything is operating normally before integration. This tests the ability to power all components and get a read from all sensors. These steps assume that previous tests have been successful and that the antennas have been soldered to the Flight Computer. If these steps are not completed, please complete them before proceeding:

1. **Insert Batteries**
    - Insert all the batteries into the battery board starting on the right and moving to the left.

2. **Jump J18 on Battery Board**
    - Jump J18 on the battery board to bypass the need for inserting all the switches. Alternatively, insert the switches if they are to be included in the test (do not jump J18 in this case).

3. **Confirm 3.3V Regulation**
    - Probe the 3.3V test point and confirm that the board is regulating the 3.3V bus.

4. **Connect Battery Board to Flight Computer**
    - Plug the 12 position Molex Pico-Lock into the board and the other end into the Flight Computer Board. The Blue LED on the bottom of the Flight Computer should illuminate.

5. **Connect Solar Boards**
    - Plug in all the 5 position Molex Pico-Lock connectors into the battery board. Then plug the other ends into the solar boards. Ensure the correct connection of the connectors to the respective faces.

6. **Connect to a Desktop**
    - Connect the Flight computer to a desktop using a Micro USB cable. The filesystem should appear.

7. **Load Testing File**
    - Load the “FlatSatTest.py” file into the directory “PYSQUARED”.

8. **Open a Terminal**
    - Open a terminal for the COM port connected to the satellite.

9. **Run Test Command**
    - Type the command: `import flatsattest`.

10. **Observe Results**
    - Check for the expected set of results.

11. **Troubleshooting**
    - If results are not successful, follow these steps:
        a. LED Driver issues: If initializing the LED Driver fails, check the I2C address at 0x56.
        b. I2C Multiplexer issues: If initializing the I2C multiplexer fails, check the I2C address at 0x72.
        c. Solar board sensor issues: If initializing sensors fails, check the I2C addresses and solder joints.
        d. Power monitor issues: If initializing power monitors fails, check the I2C addresses at 0x40 and/or 0x4F.

> **NOTE:** Remember to follow each step carefully and troubleshoot as necessary based on the specific component that may not be functioning properly.
