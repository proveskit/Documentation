## The Yearling Software Sword

This is a bit of an interesting one! We recently were trying to figure out what the best way of describing what the flight software stack looks like and a sword is what it eneded up being! 

![Figure 1](images/sword.png)
<p align="center">Figure 1: The Software Sword for Pleiades - Yearling 1</p>

This diagram expresses the overall class structure of the Yearling Flight Software from the baremetal firmware all the way at the bottom up to the highest level ```cody.py``` at the top. We generally recommend that the end user only goes down to the ```functions.py``` level when defining their own software, unless they are added their own custom hardware to the stack! 
