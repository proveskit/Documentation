# Chapter 2: Face Assembly 
In this chapter the user will learn the steps to assemble the faces. There are 4 solar boards, that go to the side of the satellite and a Z- board that goes on the bottom of the satelite. The antenna goes on the top.

!!! Warning
    ***Before continuing:*** it is important to note that gloves should be worn prior to applying solder paste to avoid ingestion of a lead-based material.


**1.**  Plug in connectors to solar boards Then plug all the solar boards into the flight controller board


*<p align="center">**Figure 2.1:**</p>*
![Figure 2-1](images/2.1Solar%20Boards.png)

<p align="center">**Figure 2.1:**</p>*
![Figure 2-1](images/2.2SolarBConnectFC.png)

**2.** Now its time for the first test!

If the solar board LEDs are not on type:
>> 	all_faces_on()

You can type all_faces_off() to turn the faces off and all_faces_on() to turn them back on again. You should observe the lights turning on and off 


*<p align="center">**Figure 2.2:**</p>*
![Figure 2-2](images/Jumped_2position.PNG)


Now to check the data that you get from the Boards! 

Type

>> all_faces.face_test_all(). 

This returns an array of arrays. The first 4 are the face boards and the fifth is the Z- board. Each board contains two values [temperature, ambient light]. Shine a light on the different boards and run the commands again to see the numbers change and ensure the sensors are working.

!!! warning
      Test all sensors for full functionality prior to solar cell installation (see Chapter 7 that identifies the proper test to complete for the solar boards). If sensors are faulty and need to be reflowed or removed with a heat gun, the cells will be damaged in the process.

3. Now we will add the solar cells to the solar boards!

First, Check that the positive and negative terminals on the back side of the cells are matched with the plus and minus silk screened on the PCB.

   
   !!!WARNING
     You **cannot** tell the orientation of the cell from the top of the cell so make sure it is placed properly.


   **a.** Apply Low Temperature Solder Paste to the pads on the Solar Board as seen in Figure 3.3.
   *<p align="center">**Figure 3.3: Before and After Solder Paste Application**</p>*
   **b.** Check that the positive and negative terminals on the back side of the cells are matched with the plus and minus silk screened on the PCB

    For cells that are immediately next to each other, scoot them together so that the gap between them is as small as possible.

     !!!WARNING
     You **cannot** tell the orientation of the cell from the top of the cell so make sure it is placed properly.


**4.** Reflow on low heat (the low temperature for the solder that you use is recommended) and do not touch until completely cool.

!!! warning: Be very careful, it is easy to overheat the solar cells. Solar cells cant exceed 175 C for over 50 seconds

*<p align="center">**Figure 2.2:**</p>*
![Figure 2-3](images/2.3solarcellshalfone.png)

*<p align="center">**Figure 2.2:**</p>*
![Figure 2-4](images/2.4solarcellson.png)

**5** to test the connections use a voltmeter to ensure each cell is connected and charges under light