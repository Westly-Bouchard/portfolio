---
title: Encoder PCB
thumbnail: /assets/images/EncPCB-thm.png
description: Rotary magnetic position sensor for use in robotic actuators.
---

# Encoder PCB

> ❗️Update
> 
> This project has been sponsored by PCBWay, They've generously provided PCB
> prototyping and assembly services for version 2 of the board!

> ℹ️ INFO
> 
> Date completed: August 29, 2025\
> Associated Course: N/A\
> Project Type: Personal

## Motivation
After an unsuccessful search for a compact, inexpensive, and performant encoder
for an upcoming robotics project, I decided to try my hand at PCB
design, and make one myself.

I wanted to base my encoder around the **AS5047P** magnetic position sensor IC, as
many motor drivers support its SPI communication protocol, and because it offers
a host of other interfaces including ABI, and UVW.

My primary goals were to:
- Break out *all* supported communication interfaces
- Support both 5 and 3.3 volt power
- Create a design that can be easily integrated into a variety of actuators

### Open Source
I've learned so much from open source projects and freely available online
resources. Because of this, I dedicate my work to the public good, in the hope
that others may learn from me as I have learned from them.

As such, this project is licensed under CERN-OHL-W-2.0

I strive to thoroughly document my projects, and to structure information such
that anyone can learn from my work, be they beginners or professionals.

<div class="link">
<a href="https://github.com/Westly-Bouchard/AS5047P-Board">GitHub Repo</a>
</div>

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

<div class="image-grid">
<img src="/assets/images/encoder-board/encoder-board-schematic.jpeg" alt="KiCad schematic">
<img src="/assets/images/encoder-board/encoder-board-layout.jpeg" alt="KiCad layout">
<img src="/assets/images/encoder-board/encoder-board-v1-render.jpeg" alt="KiCad render">
</div>
<br>

When the first batch of boards arrived, they worked exactly as intended on the
first power-up. This was a satisfying and delightful result for a first PCB
project.

<div style="display: flex; align-items: center; justify-content: center;">
<iframe width="560" height="315" 
src="https://www.youtube.com/embed/UyNPEtmxsPw?si=MmFI58tKpCxggzwO" 
title="YouTube video player" 
allow="accelerometer; 
autoplay; 
clipboard-write; 
encrypted-media; 
gyroscope; 
picture-in-picture; 
web-share" referrerpolicy="strict-origin-when-cross-origin" 
allowfullscreen></iframe>
</div>

## Version 2

My initial testing had focused on the SPI interface, which proved to work
reliably. However, when I attempted to use the ABI outputs I discovered that 
they (along with the other two output modes) were nonfunctional.

After some troubleshooting, and a re-read of the datasheet, I found that the SPI
pins required defined logic levels when not in use. In the original design
they were left floating, which prevented the other interfaces from working
properly.

To fix this, I added the appropriate pull-up and pull-down resistors to the SPI 
pins. Around this time, PCBWay reached out and offered to sponsor fabrication
and assembly for the updated design. This allowed me to quickly validate the
fix at scale.

The final design achieves my initial goals and is ready for integration into
future robotic systems.

<div style="display: flex; align-items: center; justify-content: center;">
<img style="width: 400px;" src="/assets/images/EncPCB-thm.png" alt="a KiCad render of version 2">
</div>