# Quick Reference Links
This page contains links and context on a variety of useful tools and references for doing CubeSats! 

## Tools and Templates 

??? abstract "Jan King's Satellite Link Budget Spreadsheet" 

    This spreadsheet is absolutely legendary in the CubeSat community. Last updated in the mid 2000’s, it is the most comprehensive piece of freeware currently available for running the calculations on whether or not your satellite will be able to connect to your ground station. It is honestly overkill in many ways, but if you want to be walked through doing a deep dive on how that RF link forms this is the one stop shop. 

    One of these days we should have someone in the community modernize it as a web tool! 

    [Link to Download the Sheet](http://www.amsat.org/wordpress/xtra/AMSAT-IARU_Link_Model_Rev2.5.3.xls)

## Specifications and Standards
When you are able to say “our CubeSat is compliant with CDS Rev 14.1 and has passed the required testing per the December 2023 RPUG” anyone who is familiar with those standards can instantly know what your satellite’s compatibility is and what kind of launch vehicles it can go on without having to do a deep dive into how you’ve built your satellite. That is the power of specifications and standards. 

???+ info "The CubeSat Design Specification (CDS) Rev 14.1"

    The CubeSat Design Specification (also known as CDS) is the seminal document defining CubeSats. Published by the Cal Poly San Luis Obispo CubeSat Lab, this document is the closest that we have to the law of the land in CubeSats. This is a good place to start when trying to understand on a specific technical level "what is a CubeSat."
    
    [Link to the Spec](https://static1.squarespace.com/static/5418c831e4b0fa4ecac1bacd/t/62193b7fc9e72e0053f00910/1645820809779/CDS+REV14_1+2022-02-09.pdf)


???+ info "The SpaceX Rideshare Payload User's Guide Version 9"

    The SpaceX Rideshare Payload User’s Guide (RPUG) is the preeminent source of guidelines on the testing requirements to fly to space in the modern SmallSat industry. The overwhelming majority of launches from the US are SpaceX rockets, so if you are a US institution looking to go to space it is a good bet that you’ll want to design and test your satellite in a way that is compliant with SpaceX requirements. Make sure to read these guidelines carefully and also look at the design recommendation that they make as well. 

    [Link to the Spec](https://storage.googleapis.com/rideshare-static/Rideshare_Payload_Users_Guide.pdf)

??? info "NASA LSP-REQ-317.01"

    This requirements document is from the NASA Launch Services Program (LSP) at the Kennedy Space Center. These requirements generally summarize what the LSP program expects from CubeSats that fly in the CubeSat Launch Initiative (CSLI). Compliance with this standard will greatly expedite your process with getting manifested for a launch.

    It used to be that you wouldn’t get accepted at all to CSLI if you could not verify you were compliant with this document. Nowadays as long as you note in the application that you need a waiver (nominally for the use of propulsion systems in your CubeSat) you should still be able to get through. 

    [Link to the Standard](https://www.nasa.gov/wp-content/uploads/2018/01/627972main_lsp-req-317_01a.pdf?emrc=4e0f87)

??? info "NASA GEVS GSFC-STD-7000B"

    The NASA GEVS (General Environmental Verification Standard), developed by the Goddard Space Flight Center, is another great resource for guidance on conducting environmental tests for spacecraft. Although GEVS is not tailored specifically for CubeSats or a particular launch vehicle, it is generally accepted that testing to the GEVS is a solid starting point for most payloads.

    [Link to the Standard](https://standards.nasa.gov/sites/default/files/standards/GSFC/B/0/gsfc-std-7000b_signature_cycle_04_28_2021_fixed_links.pdf)

??? info "Air Force Space Command SMC-S-016"

    The SMC-S-016 from the Air Force Space command is rarely seen these days unless you’re flying with the DoD, but it can be useful to cruise through this document when designing your CubeSat as many test plans and other specifications are derived from it. 

    [Link to the Standard](https://explorers.larc.nasa.gov/2019APSMEX/MO/pdf_files/SMC-S-016_05SEP2014.pdf)

??? tip "A Tip on Requirements"

    One of the first things you should learn in engineering is how to understand and write good requirements for whatever system you are designing. Requirements are the measuring stick by which we can measure the success of our work and a guiding star for how to make out design decisions. The second thing you should learn in engineering is that requirement can, should, and will change throughout a project’s lifecycle. To assume that a project’s requirements will never undergo change presumes that the requirement writers at the beginning of the project had an absolutely perfect understanding of exactly what was needed, exactly what will meet that need, and exactly what it takes to accomplish the task at hand. 

    In the real world this is rarely, if ever, the case. We have a saying that the best and worst answer in engineering as always “it depends.” To that end, we encourage people to look towards standards and specifications not as an end all be all for how things should get done, but just as a set of guidelines that will make your life easier if you are able to follow them. If there is a good reason for deviation there is always a way to make it work, and sometimes that deviation leads to innovation that moves the whole industry forward. 