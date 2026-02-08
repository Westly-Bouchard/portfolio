---
title: Encoder PCB
thumbnail: /assets/images/EncPCB-thm.png
description: Rotary magnetic position sensor for use in robotic actuators.
---

# Encoder PCB

## Motivation
After an unsuccessful search for a compact, inexpensive, and performant motor
encoder option for an upcoming robotics project, I decided to try my hand at PCB
design, and make one myself.

I wanted to base my encoder around the AS5047P magnetic position sensor IC, as
many motor drivers support its SPI communication protocol, and because it offers
a host of other communication interfaces including ABI, and UVW.

My goals were simple, I wanted a board that would break out all possible methods
of communication with the IC, while also allowing the user to supply either
3.3 or 5 volt power for the logic. Essentially, I wanted to support the maximum
possible number of use cases that someone could have for this IC.

## Version 1
As I had no experience with PCB design before starting this project, the focus
of my first iteration was to generate the simplest possible schematic and layout
for the IC to work.

I implemented the power circuitry straight from the suggested designs in the
datasheet and broke out all the pins onto JST connectors in accordance with the
different operating modes of the system.

I also added a solder jumper to the back of the board that would allow the user
to choose between 3.3 or 5 volt power. This was important because I had planned
to use these boards in systems with both 5 volt and 3.3 volt logic.

<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); grid-gap: 1rem;">
<img src="/assets/images/placeholder.png">
<img src="/assets/images/placeholder.png">
<img src="/assets/images/placeholder.png">
</div>

## Version 2




