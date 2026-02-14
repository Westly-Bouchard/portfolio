---
title: Motor Driver Interface
thumbnail: /assets/images/Driver-thm.png
description: ROS2_Control interface for drives running legacy ODrive Firmware.
---

<div style="display: flex; justify-content: center; align-items: center;">
<img class="banner" src="/assets/images/driver-interface-banner.png" alt="Banner image">
</div>

# Motor Driver Interface

> ℹ️ INFO
>
> Status:  Ongoing\
> Project Type: Personal

## Context
ODrive robotics provides ROS packages that are designed to interface with their
newer generation, closed source drivers. Their older, open source designs are
not guaranteed to work with these packages.

This is unfortunate because many companies manufacture drives to the older
specifications, and they are significantly cheaper than the newer generation
drivers from ODrive.

This project implements a custom ROS2_Control hardware interface to support 
CAN-based motor drivers running legacy, open-source ODrive firmware.

My goals for this project were to:
- Communicate with the drives over a CAN bus
- Integrate cleanly with ROS2_Control
- Design for extensibility and modification

## The Magic of SocketCAN

CAN was a must-have for this project, as running a USB cable to each drive would
be cumbersome for larger projects. But, I was wary about the difficulty of 
adding dependencies to C++ **and** integrating them with `colcon`.

It turns out, however, that CAN support is just built straight into the Linux
kernel and can be accessed via a network socket with SocketCAN. All I needed
was a $10 CAN to USB adapter and I could communicate with as many drives as I
needed with less than 10 lines of code.

SocketCAN was a great fit for this project, and for me as:
- It's integrated at the kernel level which makes it robust.
- It provides file descriptor based abstraction, patterns I was already familiar
  with from university courses.
- It's designed for use with standard Linux patterns and system calls.
<br>
<div style="display: flex; align-items: center; justify-content: center;">
<iframe 
width="560" 
height="315" 
src="https://www.youtube.com/embed/2THLHzRO2Bs?si=QnZpSiW24cIfPknJ" 
title="YouTube video player" 
allow="accelerometer; 
clipboard-write; 
encrypted-media; 
gyroscope; 
picture-in-picture; 
web-share" referrerpolicy="strict-origin-when-cross-origin" 
allowfullscreen>
</iframe>
</div>

## Difficulties with Async IO

My initial prototype had just run everything out of a single thread in a ROS 
node. As I began to adapt my code for ROS2_Control, I knew that a proper 
implementation would split IO operations (sending and receiving CAN frames) into
a dedicated thread.

This doesn't sound too hard in theory, and the initial implementation wasn't.
But I kept running into the same problem. The only way I knew to read a frame
from the bus was with a blocking `read()` syscall. If I wanted writes to also
happen outside the main thread, then I could only write a frame when I read a
frame, in a 1:1 ratio.

For my current applications that most likely wouldn't have been an issue, but
in a more complex system, or in the general case, frame writes should not be
coupled to reads, they should happen completely asynchronously.

The only way I could think to solve this was to add a **third** thread to the
interface that would handle the writes. But, I knew this would need careful
handling to prevent race conditions. Additionally, when no frames were being
written to the bus there would be an entire thread spinning without doing
anything, which is hardly optimal in a resource-limited environment like a
microcontroller or Raspberry Pi.

I had seen other projects handle this with `asio` from `boost` but I was
reluctant to go down that path for fear that I wouldn't be able to properly
integrate the library with my current toolchain.

At this point I reached out for help from my systems programming professor who
suggested that I look at the `epoll()` syscall, to monitor
the file descriptor without performing a blocking read until there was data
ready. This way, I could write as many frames as I wanted in between reads.

With `epoll()` I could limit each interface's CPU footprint to just the ROS2 
thread and one IO thread and ensure that communication with drives happens 
deterministically, all while leveraging trusted, robust abstractions.

## An Opportunity for a Powerful Feature

While working on this project, and getting to know my hardware, I realized
something:
- The drivers I was using only supported one axis in hardware, but they were 
  still running the ODrive 3.x firmware, which supports two.

- At the same time, the drivers had multiple encoder ports for different types 
  of encoders.

- Finally, the <a href="/projects/project/?p=encoder-pcb">custom encoder</a> I 
  had designed to use with these drives supported multiple common encoder 
  interfaces.

I could leverage the other ports with an additional encoder, and publish 
readings from it to the bus. This would allow me to not just run my motors with 
encoders, but to use encoders to measure arbitrary angles or positions in my 
robotic system. Essentially, this allows for:

- Reduced wiring complexity
- Fewer microcontrollers and communication middlemen
- Better synchronization

With a couple of modifications to the ODrive firmware, and some restructuring, I
now had a powerful new feature at my fingertips.

## Reflection

This project taught me a lot about systems programming and the power of Linux
primitives over heavy abstractions and custom implementations. For future 
robotics software projects, I'll start with syscalls and man pages, rather than
suboptimal, bespoke solutions.

