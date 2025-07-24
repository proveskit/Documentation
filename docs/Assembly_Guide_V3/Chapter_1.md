# Chapter 1: Flight Controller Board 
In this chapter, the user will learn the proper steps to assemble an Flight Controller Board. 

!!!Warning
    ***Before continuing:** it is important to note that gloves should be worn when soldering and it should be done in a well-ventilated area to avoid the harmful fumes.*</span>


## Soldering the Radio Component
**1.** Place a piece of kapton tape between the radio and the flight controller board. This will optimize the surface area on the board
**1.** When soldering the radio, the exposed metal part on the underside of the module should be taped up with Kapton Tape in order to avoid contact with the copper pads on the HopeRF footprint of the FC Board.
*<p align="center"> **Figure 4.1a: Taped Section of Radio Module**</p>*
![Figure 4-2](images/radiota.jpeg)

**2.** Align the radio module to the white rectangular outline. Refer to Figure 4-1b. 
*<p align="center">**Figure 4.1b: Radio Module Footprint**</p>*

![Figure 4.1b](images/Radio_Module.jpeg)

  
 

**3.** On the radio module, there is a dot on the metal side which should be next to the C15 connection.
![Figure 4-3](images/radioc15.png) 
 *<p align="center">**Figure 4.2: Front Side of Radio Module** </p>*

**4.** Tape down the radio module to ensure that it stays in place while soldering the pins of the radio module to the copper pads of the footprint on the FC Board.

**5.** Once the radio module is aligned and secured, begin soldering.

**6.** Once radio module is properly soldered, it should the same as Figure 4.4.

*<p align="center">**Figure 4.3: FC Board with Soldered Radio Module**</p>*
![Figure 4-4](images/radiofc.jpeg)


**7.** Solder the copper pads of **JP6** together to make a connection for the radio module.

**2.** Locate the pads circled on figure 1.1. You want to solder together the two pads located next to the 5V label in order to turn on the radio. Make sure to not put solder on the third pad.
 

 [Figure 1-1](images/1.1FCBOARD.png)
   *<p align="center">**Figure 1.1: Flight Controller Board** </p>*


**3.** Make sure to turn on the board switch! An LED should be on on the other side of the switch. Plug in the flight controller board with a USBC, and flip on the switch. the flight controller board has a LED that turns.


**4.** Next follow the steps in the [Software Setup Guide](https://proveskit.github.io/pysquared/getting-started/). This will help you test the boards in the future steps

The rest of the tutorial is structured by showing you how to solder or assemble a board and then connect it to the flight controller board and test that it works. You will have to come back to the software so keep it open (and you can keep the flight controller connected) or remember how to connect for the next time. You can also do all the builds and come back and do all the tests, but this will help you catch errors in assembly quicker.

