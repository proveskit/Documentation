# Chapter 3: Solar Assembly

!!! note

    Before continuing it is important to note that gloves should be worn prior to applying solder paste to avoid ingestion of a lead-based material.


# Z Faces

4. ### **Z- Face Solar Boards**

   **a**. Install the Solar Cells (KXOB101K08F-TR) using low temperature solder paste and a reflow oven.
   **b.** Apply Low Temperature Solder Paste to the pads on the Solar Board as seen in Figure 3.4.
   <p align="center">Figure 3.1: Z-Face Solar Board Preparation</p>

   **c.** Check that the positive and negative terminals on the back side of the cells are matched with the plus and minus silk screened on the PCB.
   
   **d.** For cells that are immediately next to each other, scoot them together so that the gap between them is as small as possible.

   **e.** Reflow on low heat (the low temperature for the solder that you use is recommended) and do not touch until completely cool.


 ### **Soldering the pins to the board**
4.  Move heat shrink tubing up and use hot air to shrink tubing around heater leads
</div>

<div class="result" markdown>
1. Get five 5 pin connectors and align them onto the white imprints as seen in figure 3.2. Make sure they are aligned to the corresponding pins.
<p align="center">Figure 3.2: 
2. Tape down the connectors with a single piece of tape to ensure it does not move while you solder it on. Ensure that the picolock headers are flat on the board 
3. First solder on the connectors with the two metal pads and remove the tape.
4. Solder on the final five pins on the back of the connector. 
(note that not a lot of material is needed to soder these pieces/should be thin)
Include figure as an example 
5. Repeat till all 5 pin picolock headers are placed 
</div>

# XY Faces 
1. **Hand solder pico-lock connector following silkscreen and pad outlines.**
   a. Follow the silkscreen pattern on the board to place the components in the correct positions/orientations. For the pico-lock connectors line up the mounting pads when soldering connectors.

!!! warning
      Test all sensors for full functionality prior to solar cell installation (see Chapter 7 that identifies the proper test to complete for the solar boards). If sensors are faulty and need to be reflowed or removed with a heat gun, the cells will be damaged in the process.

2. **Install the Solar Cells (KXOB101K08F-TR) using low temperature solder paste and a reflow oven.**
   a. Apply Low Temperature Solder Paste to the pads on the Solar Board as seen in Figure 3.3.
   <p align="center">Figure 3.3: Before and After Solder Paste Application</p>
   b. Check that the positive and negative terminals on the back side of the cells are matched with the plus and minus silk screened on the PCB (Note: you cannot tell the orientation of the cell from the top of the cell so make sure it is placed properly).
   
   c. For cells that are immediately next to each other, scoot them together so that the gap between them is as small as possible. Otherwise, the fishing wire to stow the antenna may get caught in the cracks.

## Optional: Motor Driver Modification
3. **OPTIONAL: Remove 0 ohm resistor for motor driver as seen in Figure 3.4S**
   a. If the solar board has already been removed from the oven, the resistor can be removed by a fine tip soldering iron heating each pad simultaneously. If the board is still hot from the oven, tweezers can be used very swiftly to remove the resistor.
   <p align="center">Figure 3.4: Motor Driver Resistor Removal</p>

!!! note

      This step is completely optional as the magnetorquers can be deactivated in software. Only one X Magnetorquer and one perpendicular Y Magnetorquer need to remain active in order to detumble the satellite effectively. The Z- Solar board should let the magnetorquer coil remain active as this is the only coil on the Z faces.














  