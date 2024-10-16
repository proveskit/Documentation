# Overview
The PySquared class is the one primary hardware abstracton class for boards in the PROVES Kit that employ a microcontroller. It is intended that all of the hardware drivers are initialized and data calls are abstracted in this class. This way flight software that is developed across multiple versions of the PROVES Kit can be interchangable by just changing out which `pysquared.py` version they are calling. 

## Useful Shortcuts 
One of the most commonly used shortcuts while debugging in the REPL is: 
```py 
from pysquared import cubesat as c
```
This imports a `cubesat` object from the `pysquared` class and names it `c`, allow you call functions and parameters that are inside the pysquared class conveniently during testing. 

# Version History
Work in Progress.

Note: There were sigficant changes between the PySquared class used for the V3 and V4 flight controller boards. 

# Overall Structure
The PySquared class creats a CubeSat object that rolls up all of the major functionalities of the board that is housing it.

