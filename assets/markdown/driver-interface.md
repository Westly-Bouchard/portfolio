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

### Difficulties with Async IO

## An Opportunity for a Unique Feature
