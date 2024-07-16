# Overview
![Figure 1](images/fc_internal_1a.jpg)
<p align="center">Figure 1: The Internal Flight Controller Board</p>

The PROVES Kit Flight Controller is part of the PySquared architecture that harbors all of the satellites core operations. There are two variants of the Flight Controller, an internal variant and an external variant.

| Version | Flights | Status |
| ----------- | ----------- | ----------- |
| V0 | Unflown | Not Supported |
| V1 | Pleiades - Yearling, Pleiades - Squared | Legacy Support |
| V2 | Unflown | Unsupported |
| V3 | Unflown | Legacy Support |
| V4a (aka V1a Internal) | Unflown | Supported |

#### V4b Schematic
![V4b Schematic](images/fc_sch.png)

#### V4b Layout
![V4b Schematic](images/fc_lay.png)

## Getting Started

###  Internal FC Boards 

1. If you do not plan on connecting a battery board, ensure that the ```JP1``` solder jumper is connected to enable powering the board via USB.
2. Solder on the Radio Module and an antenna or SMA connect as needed.
3. Plug in a USB Cable!
4. If a CircuitPython file system does not appear, you may have to flash the board with firmware. This firmware can be found [here](https://github.com/proveskit/flight_controller_board/tree/main/Firmware).
5. Continue to the [PROVES Quick Start Guide](https://docs.proveskit.space/en/latest/quick_start/proves_quick_start/) for more!
> Note: If you are using USB power for the radio it may not perform as expected due to a lack of 5V power. 

## Utilized Parts
The Flight Controller:

### RP2040 Microcontroller
Programmed in CircuitPython or PicoSDK. 

### RFM98PW 433 MHZ Radio Module
To communicate between satellites or to ground stations. This module was selected based on its flight heritage on the PyCubed lineage of CubeSats. The RFM98 specifically supports the 435Mhz - 438Mhz range that is allocated to amateur radio satellites. The footprint on the board is a hybrid footprint that also allows the mounting of an RFM95 radio module that can operate in the ISM 915Mhz band as well. 

### VL6180 LiDAR
To detect antenna deployment.

### MOLEX Micro SD Card Reader
Any SD Card up to 16Gb is supported by CircuitPython. We recommend using [Sandisk Industrial SD Cards](https://www.mouser.com/datasheet/2/669/SanDisk_Industrial%20Grade%20SD%20%20MicroSD%20Product%20Brief-805940.pdf) for flight, but any SD card will do for ground testing. 

### MAX706RESA Watch Dog Timer
To ensure the Flight Controller stays operational, this is a component that is borrowed from the PyCubed. 

### AZ1117CH 3.3V Linear Voltage Regulator
To power the Flight Controller without a Battery Board. This linear regulator uses the 5V V_Bus line from the USB port and supplies 3.3V when the JP1 solder jumper is connected.


## Known Issues
- Microcontroller and radio possibility have a high suspectibility failure due to thermal and radiation effects. In a future version imrpoved placement and redundancy will be implemented to protect these core components from those effects.  
- Antennas are very annoying to install and may also be suceptible to failure due to thermal effects. 

## Troubleshooting
