# Battery Board Testing

### Information about Healthy Batteries

| Voltage Range | Status      |
|---------------|-------------|
| 3 - 3.2V      | Danger Zone |
| 3.2 - 3.4V    | Low         |
| 3.4 - 3.7V    | Normal      |
| 3.7 - 4V      | High        |
| 4 - 4.2V      | Danger Zone |

The cells may end up in the danger zone for one of two reasons:
- **Undervoltage:** Concern for the health of the battery but not a safety concern.
- **Overvoltage:** Concern for the health of the battery and the safety of the people around the battery. Overcharging can cause the battery to explode.

>**CAUTION:** Before proceeding with this test, ensure the batteries you utilize all have a voltage of 3.4V and above and are balanced (each cell within +- 0.05V from each other).


The main objectives in testing the battery board are to verify that the battery protection network and voltage regulation are functioning properly. Follow these steps:

1. **Insert Batteries into the Holders**
   - Insert batteries into the battery holders on the bottom side of the board, starting on the right and moving towards the left. Follow the posted polarity on the board.

2. **Check Battery Connection**
   - Flip the board over and observe the various test points.
   - Use a voltmeter to test the pack voltage. Place the positive probe into the PACK+ test point and the negative probe into the B- test point. The voltage should be greater than 6V.
   - If the pack voltage is below 6V, follow troubleshooting steps:
     - If voltage is below 6V but not 0V, recharge the cells.
     - If voltage is at 0V, check battery polarity and solder joint connections.
     - Test voltages across each cell; replace any cell sitting at 0V.

3. **Battery Protection Check**
   - Test the pack voltage against ground. Place the positive probe into the PACK+ test point and the negative probe into the GND test point. The voltage should match the pack voltage.
   - If the voltage differs, check for overcharge or over discharge protections.

4. **Jump J18 for Power**
   - Jump J18 on the top side of the board with a jumper to bypass the feet switches and RBF switch.

5. **Voltage Regulation Test**
   - Test the 3.3V on the board. Place the positive probe into the 3.3V test point and the negative probe into the GND test point.
   - If 3.3V is not generated, troubleshoot by ensuring battery protection hasn't triggered and that the pack voltage is passing through.

6. **Functionality Test of Feet Switches and RBF Switch (Optional)**
   - Remove J18 jumper and connect the switches.
   - Test all points against GND, then depress the RBF switch and retest.
   - Replace switches if they do not function properly.

7. **Final Steps**
   - Remove the J18 Jumper (or switches if used) and remove the batteries, starting on the left and moving to the right.
