# Solar Board Testing

To test the solar panels on the satellite, a voltmeter is used to measure the voltage across all the cells. Each board that houses the six solar cells has two bare metal pads, one labeled VSOLAR and the other labeled GND. The testing steps are as follows:

1. Bring the Solar board into direct sunlight.
>**NOTE:** If direct sunlight is unavailable, a bright light from a car’s high beams may suffice for testing, but may return a lower-than-normal voltage reading and may leave the test results inconclusive.

2. Without placing a shadow on any of the cells, place the positive probe of the voltmeter on the VSOLAR pad and the negative probe on the GND pad.

3. Ensure the voltage being read is above 10V.
   - If the reading is 10V or above, the test is complete, and the cells on the solar board are functioning properly.
   - If the reading is significantly less than 10V, continue to the following steps for troubleshooting:
     a. Ensure cells are unobscured from sunlight.
     b. Ensure proper contact of probes to bare test pads.
     c. Testing the voltage across individual cells may become necessary:
        i. Identify the pads above and below each cell.
        ii. Place each probe on each pad.
        iii. If voltage reads close to 0 in direct sunlight, then the probe may not be in contact with the pad, or the cell is broken and the board must be replaced. (NOTE: Replacing the cell may be possible but is not advised as re-exposing the other cells to the reflow oven temperatures may cause unintended damage).

4. Repeat steps 1 through 3 for each solar board.
