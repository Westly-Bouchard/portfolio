---
title: Motor Driver Interface
thumbnail: /assets/images/Driver-thm.png
description: ROS2_Control interface for drives running legacy ODrive Firmware.
---
# Motor Driver Interface

> ℹ️ INFO
>
> Date completed: Ongoing\
> Associated Course: N/A\
> Project Type: Personal

## Context
ODrive robotics provides ROS packages that are designed to interface with their
newer generation, closed source drivers. Their older, open source designs are
not guaranteed to work with these packages.

This is unfortunate because many companies manufacture drives to the older
specifications, and they are significantly cheaper than the newer generation
drivers from ODrive.

My goals for this project were to:
- Communicate with the drives over a CAN bus
- Integrate into ROS2_Control ecosystem
- Design a package that is easy to extend & modify

## The Magic of SocketCAN

Going into this project, I knew that my hardware supported communication over 
CAN, but I wasn't exactly sure how to talk to it from my computer. I really
wanted to avoid running a USB cable to the drive as this would get very 
cumbersome for larger projects with many axes.

I was also weary because I knew that managing dependencies in C++ can be a real
hassle, and that would be exacerbated because I would be using the ROS2 `colcon`
build system and not just plain CMake.

It turns out, however, that CAN support is just built straight into the Linux
kernel and can be accessed via a network socket with SocketCAN. All I needed
was a $10 CAN to USB adapter and I could communicate with as many drives as I
needed with less than 10 lines of code.

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

My initial prototype had just run everything out of a single thread in a plain 
old ROS node. As I began to implement a hardware interface for ROS2_Control, I 
knew that a proper implementation would split IO operations (sending and 
receiving CAN frames) into a dedicated thread.

This doesn't sound too hard in theory, and the initial implementation wasn't;
but I kept running into the same problem. 

## An Opportunity for a Unique Feature
