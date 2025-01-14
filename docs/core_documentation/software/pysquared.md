# Overview
The PySquared class is the one primary hardware abstracton class for boards in the PROVES Kit that employ a microcontroller. It is intended that all of the hardware drivers are initialized and data calls are abstracted in this class. This way flight software that is developed across multiple versions of the PROVES Kit can be interchangable by just changing out which `pysquared.py` version they are calling. 

## Useful Shortcuts 
One of the most commonly used shortcuts while debugging in the REPL is: 
```py 
from pysquared import cubesat as c
```
This imports a `cubesat` object from the `pysquared` class and names it `c`, allow you call functions and parameters that are inside the pysquared class conveniently during testing. 

## Version History
!!! tip "Latest Version" 

    The latest version is `V2.0.0` which reimplements `main` to remove the use of `asyncio` and now uses a modifed version of the more generic `adafruit_rfm` library for the radio driver rather than the older library based on `adafruit_rfm9x`. 

Work in Progress.

Note: There were sigficant changes between the PySquared class used for the V3 and V4 flight controller boards. 

# Overall Structure
The PySquared class creats a CubeSat object that rolls up all of the major functionalities of the board that is housing it.

## Imports
```py
# Common CircuitPython Libs
import gc
import board, microcontroller
import busio, time, sys, traceback
from storage import mount, umount, VfsFat
import digitalio, sdcardio, pwmio
from os import listdir, stat, statvfs, mkdir, chdir
from bitflags import bitFlag, multiBitFlag, multiByte
from micropython import const
from debugcolor import co

# Hardware Specific Libs
import pysquared_rfm9x  # Radio
import neopixel  # RGB LED
from adafruit_lsm6ds.lsm6dsox import LSM6DSOX  # IMU
import adafruit_lis2mdl  # Magnetometer
import adafruit_tca9548a  # I2C Multiplexer

# CAN Bus Import
from adafruit_mcp2515 import MCP2515 as CAN
```
The `pysquared` class begins by importing all of the needed libaries to run the satellite. We choose to instantiate virtually all of the hardware elements of the satellite in this single class parimarily to simplify the process of testing and validation as much as possible. Because all of the hardware is assigned to a `Satellite` object, if we want to call the gyro rates, for example, we can do so with a single function call. 

## NVM (Non-Volatile Memory) Setup
Now inside the `Satellite` class, we first define all of the NVM (Non-Volatile Memory) mappings. These bits are set aside in the satellite's memory to be maintained across reboots, allowing us to track things like boot counts and operational modes. 

```py 
    """
    NVM (Non-Volatile Memory) Register Definitions
    """

    # General NVM counters
    c_boot = multiBitFlag(register=_BOOTCNT, lowest_bit=0, num_bits=8)
    c_vbusrst = multiBitFlag(register=_VBUSRST, lowest_bit=0, num_bits=8)
    c_state_err = multiBitFlag(register=_STATECNT, lowest_bit=0, num_bits=8)
    c_distance = multiBitFlag(register=_DIST, lowest_bit=0, num_bits=8)
    c_ichrg = multiBitFlag(register=_ICHRG, lowest_bit=0, num_bits=8)

    # Define NVM flags
    f_softboot = bitFlag(register=_FLAG, bit=0)
    f_solar = bitFlag(register=_FLAG, bit=1)
    f_burnarm = bitFlag(register=_FLAG, bit=2)
    f_brownout = bitFlag(register=_FLAG, bit=3)
    f_triedburn = bitFlag(register=_FLAG, bit=4)
    f_shtdwn = bitFlag(register=_FLAG, bit=5)
    f_burned = bitFlag(register=_FLAG, bit=6)
    f_fsk = bitFlag(register=_FLAG, bit=7)
```
## Debug Helper Functions
Before running the `__init__` function we also define two helper functions that do colorful print statements to the serial monitor. These helper functions will only print if the `self.debug` boolean is set to `True`, allowing you to either run a verbose or non-verbose satellite in the terminal. 

```py
    def debug_print(self, statement):
        if self.debug:
            print(co("[pysquared]" + str(statement), "green", "bold"))

    def error_print(self, statement):
        if self.debug:
            print(co("[pysquared]" + str(statement), "red", "bold"))
```
## The init Function
The code now arrives at the `__init__` function, which sets up all of the core functionalities of the `satellite` class. This function begins with a few variables that guide the behavior of the rest of the satellite functions. An example is a `self.debug` variable, which defines whether or not the code will run with a verbose output through the use of `debug_print` statements.
```py
    def __init__(self):
        """
        Big init routine as the whole board is brought up. Starting with config variables.
        """
        self.debug = True  # Define verbose output here. True or False
        self.legacy = False  # Define if the board is used with legacy or not
        self.heating = False  # Currently not used
        self.orpheus = True  # Define if the board is used with Orpheus or not
        self.is_licensed = True
```

After these variables are another set of variables used to define how the satellite should behave in a normal operating mode. This includes things like defining thresholds for normal voltages and temperatures as well as how often the satellite code should do a soft reboot on itself. These variables will soon be moved to a dedicated config file.
```py
        """
        Define the normal power modes
        """
        self.NORMAL_TEMP = 20
        self.NORMAL_BATT_TEMP = 1  # Set to 0 BEFORE FLIGHT!!!!!
        self.NORMAL_MICRO_TEMP = 20
        self.NORMAL_CHARGE_CURRENT = 0.5
        self.NORMAL_BATTERY_VOLTAGE = 6.9  # 6.9
        self.CRITICAL_BATTERY_VOLTAGE = 6.6  # 6.6
        self.vlowbatt = 6.0
        self.battery_voltage = 3.3  # default value for testing REPLACE WITH REAL VALUE
        self.current_draw = 255  # default value for testing REPLACE WITH REAL VALUE
        self.REBOOT_TIME = 3600  # 1 hour
        self.turbo_clock = False
```
