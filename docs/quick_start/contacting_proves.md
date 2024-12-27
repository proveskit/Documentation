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

### Tracking Orpheus 
You can view a live ground track of the Orpheus Satellite on its [TinyGS Page](https://tinygs.com/satellite/PLEIADES-ORPHEUS).

!!! tip "Latest TLE"

    We are currently following this predicted TLE for the satellite. As of December 25th we were still able to get packets on this TLE from both partner stations in Europe and our own operators in the US. 

    ```
    1 99999U 1800100  24356.55210831  .00000000  00000-0  54728-3 0  9999
    2 99999  44.9918   0.5192 0006321 333.9104 162.3426 15.19156729    15
    ```

    This TLE was generated using open-source [TLE Tailor Tool](https://github.com/dcajacob/tle-tailor).

Pleiades - Orpheus was launched on December 21, 2024 on SpaceX Bandwagon-2! This satellite is jointly built by Bronco Space at Cal Poly Pomona and the Irvington High School Girls in STEM Club. On launch the satellite will beacon appoximately every 40 seconds and listen for 10 seconds after every ping for commands from ground. 