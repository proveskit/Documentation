# Overview
The PROVES Kit Flight Controller is part of the PySquared architecture that harbors all of the satellites core operations
## Getting Started

## Utilized Parts
The Flight Controller:

### RP2040 Microcontroller
Programmed in CircuitPython.

### RFM98PW 433 MHZ LoRa Radio Module
To communicate between satellites or to ground stations.

### VL6180 LiDAR
To detect antenna deployment.

### MOLEX Micro SD Card Reader
To log additional data.

### MAX706RESA Watch Dog Timer
To ensure the Flight Controller stays operational.

### AZ1117CH 3.3V Linear Voltage Regulator
To power the Flight Controller without a Battery Board.


## Known Issues
- Microcontroller and radio possibility have a high suspectibility failure due to thermal and radiation effects. In a future version imrpoved placement and redundancy will be implemented to protect these core components from those effects.  
- Antennas are very annoying to install and may also be suceptible to failure due to thermal effects. 

## Troubleshooting
