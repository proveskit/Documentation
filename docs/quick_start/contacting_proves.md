# How to Contact an Orbiting PROVES Satellite
Unfortunately none of the flown PROVES Kit based satellites are currently known to be operational. Instructions will be provided here regardless in case anyone wants to try, and when new PROVES Kit satellites are launched this page will be updated to reflect that! 

## Pleiades - Yearling 2
| Parameter | Value |
| -------- | -------- |
| Operational?   | No   |
| Frequency   | 437.4 Mhz   |
| Modulation   | LoRa   |
| Spreading Factor   | 8   |
| Callsign   | KN6NAQ   |

## Pleiades - Squared
| Parameter | Value |
| -------- | -------- |
| Operational?   | No   |
| Frequency   | 437.4 Mhz   |
| Modulation   | LoRa & FSK  |
| Spreading Factor   | 8   |
| Callsign   | KN6NAT   |

## Pleiades - Orpheus
| Parameter | Value |
| -------- | -------- |
| Operational?   | Launch Planned Q4 2024   |
| Frequency   | 437.4 Mhz   |
| Modulation   | LoRa & FSK  |
| Spreading Factor   | 8   |
| Callsign   |  K06AZM  |

### Orpheus Radio Config Settings
These are the radio configuration settings defined in the `pysquared.py` file for the Orpheus satellite. Although it is possible to change these settings in flight, whenever the satellite reboots it will default back to these settings. 
```py
        self.radio_cfg = {
            "id": 0xFB,
            "gs": 0xFA,
            "freq": 437.4,
            "sf": 8,
            "bw": 125,
            "cr": 8,
            "pwr": 23,
            "st": 80000,
        }
```

!!! tip "Latest TLE"

    Once the satellite is launched, the latest TLE (Two Line Element) will be posted here! 

Pleiades - Orpheus will be launched in Q4 of 2024 on SpaceX Bandwagon-2! This satellite is jointly built by Bronco Space at Cal Poly Pomona and the Irvington High School Girls in STEM Club. On launch the satellite will beacon appoximately every 40 seconds and listen for 10 seconds after every ping for commands from ground. 