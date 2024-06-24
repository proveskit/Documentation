# Chapter 9: Final Check and Tests

NOTICE: not all tests are up to date. 

## Final Check for Electronics
The final check for the electronics in the integration process involves running the same flat sat test code to ensure everything is communicating with each other when stacked in the satellite. For guidance on how to do these tests refer to the quick start guide, particularly how to use Tabby.

A fully assembled structure is required for this test:

1. **Plug in the Micro USB Cable**

2. **Check Switch States**
    - Make sure the feet switches and RFB Switch are not depressed. The satellite should be on before continuing (this can be verified by probing the 3.3V pin on the top of the flight computer).

3. **Open a Serial Terminal Connection to the Satellite**

4. **Run Flat Sat Test**
    - Type the command: `import flatsattest`. (dont have this)

5. **Observe Results**
    - The following set of results should appear.




## Troubleshooting
If the expected results do not appear, here are some additional steps to flush out commmon issues. 
| Issue | Steps |
|-------|-------|
| **LED Driver Issues** | 1. Load the `I2Ctest.py` file into the “PYSQUARED” Directory. <br> 2. Type `import i2ctest` into the terminal. <br> 3. If the readout does not return an I2C address at 0x56, the LED Driver is not working, and the battery board should be replaced. |
| **I2C Multiplexer Issues** | 1. Repeat the steps for the LED Driver issue (1 to 3). <br> 2. If the readout does not return an I2C address at 0x72, the I2C multiplexer is not working, and the battery board should be replaced. |
| **Solar Board Sensor Issues** | 1. Load the `Solartest.py` file into the “PYSQUARED” Directory. <br> 2. Type `import solartest` into the terminal. <br> 3. Check I2C addresses for Temperature sensor, Light sensor, or Motor driver. <br> 4. If any sensors are not working, check the solder joints and reflow if necessary. <br> 5. If resoldering does not resolve the issue, the solar board may need to be replaced. |
| **Power Monitor Issues** | 1. Repeat the steps for the LED Driver issue (1 to 3). <br> 2. If the readout does not return I2C addresses at 0x40 and/or 0x4F, the power monitors are not working, and the battery board should be replaced. |

...


## One Final Jig Test
It is important that the satellite is as square as possible so that it will properly fit into its deployer. Just as before, slide the satellite through the Jig.

## Vibration Test
To qualify for space, the satellite will need to complete a random vibration test, so that it may ride on the rocket. Check with your flight provider for more information about vibration testing.

## Long Range Communications Test
To ensure the satellite is operating properly, it is important to see if the satellite can be heard from at distances greater than 50km.

## Thermal Vacuum Chamber Test
To obtain an accurate idea of how the satellite will perform in space, the satellite should be exposed to extreme temperature shifts and vacuum environments.

## Congratulations!
You have just completed the integration of your satellite!
