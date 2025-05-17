# A CubeSat Quick Start Guide

<div class="grid cards" markdown>

-   :material-cube-send:{ .lg .middle } __CubeSat Context__

    ---

    Whether you're a new or veteran developer, it is always a good idea to stay up to date with the state of CubeSats. 

    [:octicons-arrow-right-24: CubeSat Fundementals](https://docs.proveskit.space/en/latest/quick_start/cubesat_fundamentals/)

-   :material-clock-fast:{ .lg .middle } __Set up in 5 minutes__

    ---

    It is quick and easy to get started interacting with the PROVES Kit! Check out the quick start guide here.

    [:octicons-arrow-right-24: Getting started](https://docs.proveskit.space/en/latest/quick_start/proves_quick_start/)

-   :material-format-font:{ .lg .middle } __Contribute to the Project!__

    ---

    Open source project rely on users like you contributing to the source! If you have some ideas about how things can be better join us!

    [:octicons-arrow-right-24: Becoming a Contributor](https://docs.proveskit.space/en/latest/quick_start/becoming_contributor/)

-   :material-scale-balance:{ .lg .middle } __Simple, Open, and Accessible__

    ---

    We're dedicated to creating as much open access to space as possible! Check out our reasons for why here.

    [:octicons-arrow-right-24: Philosophy](https://docs.proveskit.space/en/latest/design_philosophy/)

</div>

# The PROVES Kit Version Explainer
Updated May 17, 2025

## V1 PROVES Kit: Released in 2023
The was the initial version of the PROVES Kit based on the Yearling generation of satellites. Support for these versions is only available to existing users and they are not recommended for new missions.

Known Users:
- Northeastern Project Horizon
- UNLV RebelSat
- Montogomery High School 
- St. Louis University
- Harvard SEDS (custom version?)
- Arizona State University COCONUT (created derivative architecture - the 6Py perhaps?)

Board Versions:
- Flight Controller Board V3
- XY Solar Panel Board V1
- Z- Solar Panel Board V1
- Battery Board V2a

Known Major Issues:
- Increased suspectability to thermal shutdown and radiation upsets due to the V3 Flight Controller Board

## V1.5 PROVES Kit: Created in 2024
This version of the PROVES kit is a combination of significant improvements made in V4 flight controller boards along with a modified legacy battery board configuration (V2b). The VT InspireFly team will be flying this version of the kit on their Content Cube mission (already delivered for flight to the ISS!) in 2025 and we eagerly await their inflight results. This was also the first version to include a significantly improved radiation tolerant watchdog circuit. 

Known Users:
- Virginia Tech InspireFly (Launching to the ISS in 2025!)

Board Versions:
- Flight Controller Board V4c InspireFly Special
- XY Solar Panel Board V1
- Z- Solar Panel Board V1
- Battery Board V2b
- Custom unreleased antenna board

Known Major Issues:
- Lack of stable and officially supported software

## V2 PROVES Kit: Released in 2024
V2 of the PROVES Kit was developed for the Irvington High School Girls in STEM team to fly on the Orpheus satellite. This version of the kit was successfully launched in December 2024 on the SpaceX Bandwagon - 2 mission. On orbit performance was as expected aside from a major software error that caused the radio transmit power to be stuck at 100mW instead of 1W EIRP. As a result, the camera module included in this version of the kit could not be verified on orbit due to link budget issues. 

Known Users:
- Irvington High School (Launched on Pleiades - Orpheus satellite!) 
- Texas State Space Lab

Board Versions:
- Flight Controller Board V4c Express
- XY Solar Panel Board V1
- Z- Solar Panel Board Combi V1
- Mux Driver Board V1
- Camera Driver Board V1
- Battery Board V3c
- Antenna Board V1

Known Major Issues:
- Lack of stable and officially supported software
- Major software bug severely limiting radio transmit power (fix available)
- Power budget is extremely poor due to all of the additional components and no proper load switching circuits

## Upcoming V3 PROVES Kit: Planned Release No Later Than August 2025
Known Developers:
- Bronco Space Lab (Lead Developer)
- Texas State Space Lab (Primary Software Development Team)
- UCSC SlugSat
- Northeastern Project Horizon
- Columbia Space Initiative 
- NASA JPL Small Scale Flight Software Team (possesses Flight Controller Boards for evaluation - development of an F Prime PROVES deployment is planned for 2025)

Board Versions:
- Flight Controller Board V5x
- XY Solar Panel Board V2
- Z- Solar Panel Board V2a
- Battery Pack V2
- Antenna Board V2

Major Improvements
- Upgrade to RP2350 Microcontroller
- Additional S-Band Radio 
- Proper load switching circuitry to manage the power used by peripherals
- Dramatically overhauled software and developer tools