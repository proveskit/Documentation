# A CubeSat Quick Start Guide

<div class="grid cards" markdown>

-   :material-cube-send:{ .lg .middle } __CubeSat Context__

    ---

    Whether you're a new or veteran developer, it is always a good idea to stay up to date with the state of CubeSats. 

    [:octicons-arrow-right-24: CubeSat Fundamentals](cubesat_fundamentals.md)

-   :material-clock-fast:{ .lg .middle } __So you have a PROVES Kit__

    ---

    Four paths from the box to your first command, whether you have the software only, a flight controller board, a radio stick, or a whole kit.

    [:octicons-arrow-right-24: Getting started](proves_quick_start.md)

-   :material-format-font:{ .lg .middle } __Contribute to the Project!__

    ---

    Open source project rely on users like you contributing to the source! If you have some ideas about how things can be better join us!

    [:octicons-arrow-right-24: Becoming a Contributor](becoming_contributor.md)

-   :material-scale-balance:{ .lg .middle } __Simple, Open, and Accessible__

    ---

    We're dedicated to creating as much open access to space as possible! Check out our reasons for why here.

    [:octicons-arrow-right-24: Philosophy](../overview/design_philosophy.md)

</div>

# The PROVES Kit Version Explainer
Updated May 17, 2025

| | V1 | V1.5 | V2 | V3 (upcoming) |
| --- | --- | --- | --- | --- |
| **Released** | 2023 | Created 2024 | 2024 | Planned no later than August 2025 |
| **Status** | Support for existing users only. Not recommended for new missions | | Launched December 2024 on SpaceX Bandwagon-2 | In development |
| **Flight Controller Board** | V3 | V4c InspireFly Special | V4c Express | V5x |
| **XY Solar Panel Board** | V1 | V1 | V1 | V2 |
| **Z- Solar Panel Board** | V1 | V1 | Combi V1 | V2a |
| **Battery Board** | V2a | V2b | V3c | Battery Pack V2 |
| **Antenna Board** | | Custom, unreleased | V1 | V2 |
| **Other boards** | | | Mux Driver Board V1, Camera Driver Board V1 | |
| **Microcontroller** | RP2040 | RP2040 | RP2040 | RP2350 |
| **Radio** | UHF | UHF | UHF | UHF plus S-Band |
| **Known users** | Northeastern Project Horizon, UNLV RebelSat, Montgomery High School, St. Louis University, Harvard SEDS (custom version?), Arizona State University COCONUT (derivative architecture, the 6Py perhaps?) | Virginia Tech InspireFly (Content Cube, delivered for flight to the ISS, launching 2025) | Irvington High School (Pleiades - Orpheus), Texas State Space Lab | Bronco Space Lab (lead), Texas State Space Lab (primary software), UCSC SlugSat, Northeastern Project Horizon, Columbia Space Initiative, NASA JPL Small Scale Flight Software Team (evaluating boards, F Prime deployment planned for 2025) |
| **Known major issues** | Increased susceptibility to thermal shutdown and radiation upsets due to the V3 Flight Controller Board | Lack of stable and officially supported software | Lack of stable and officially supported software. Software bug held radio transmit power at 100mW instead of 1W EIRP (fix available), so the camera module could not be verified on orbit. Power budget is extremely poor due to the additional components and no proper load switching | |
| **Major improvements** | | V4 flight controller boards with a modified legacy battery board (V2b). First version with a significantly improved radiation tolerant watchdog circuit | Built for the Irvington High School Girls in STEM team. On-orbit performance was as expected aside from the radio power bug | RP2350 microcontroller, additional S-Band radio, proper load switching for peripheral power, dramatically overhauled software and developer tools |
