# How to Use the RFM9x With the PROVES Kit

The easiest way to test the radio on the PROVES Kit is to use the `radio_test.py` file that is located in the PROVES [tests_scripts repo](https://github.com/proveskit/test_scripts). Running `import radio_test` on a compatible Flight Controller Board will automagically get everything setup for a ping pong style radio test. 

The latest iteration of `radio_test.py` also has the option of automagically configuring the board it is deployed on to act as a client for sending commands to a remote node. 