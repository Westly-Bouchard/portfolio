---
title: Mosscap
thumbnail: /assets/images/mosscap-thm.png
description: A frictionless, Arduino-based robotics education tool.
---

<div style="display: flex; justify-content: center; align-items: center;">
<img class="banner" src="/assets/images/mosscap-banner.png" alt="Banner image">
</div>

# Mosscap

> ℹ️ INFO
>
> Status: Complete\
> Project Type: Individual
> 
> Overview: A tool for introductory robotics education that aims to remove
> barriers to entry by utilizing familiar programming paradigms and web-assembly.

> [Link to GitHub repo](https://github.com/Westly-Bouchard/Mosscap)

# Context

During the spring 2026 semester, I took the Intro. to Robotics class at Mines.
This class involved a series of labs where we worked to implement algorithms
like trajectory following with PID control, mapping, and path planning. We
completed these labs on small, Arduino-based robots off of Amazon.

Throughout the semester, I observed (and experienced) that many students were
struggling to implement this functionality. These struggles arose from two
specific factors:

1. Time constraints. We only had one, three-hour lab session per week which
limited physical access to the robots. Of course, students could come in for
support during office hours and work on code at home. But, with busy schedules
and many other classes, this simply wasn't feasible for many students.

2. Difficulty debugging. Students were struggling to debug their code. This stemmed
primarily from the fact that the Arduino serial interface is quite limiting and
was compounded by the relative unreliability of our hardware. It was both hard to
tell what the robot was doing and, at the same time, whether a given problem was
a software issue or a hardware issue.

Of course, the obvious solution to both of these issues is simulation. Being able
to simulate a system like this allows you to work away from the actual hardware
and to control the exact amount of unpredictability in the system itself. So,
a student could start with an ideal simulation to verify the correctness of their
algorithmic implementations, then slowly add back noise and friction to test the
stability of their system and tune their controllers.

A workflow like this would allow students to spend more time in lab fine-tuning
their code rather than running in circles trying to debug hardware and software
simultaneously.

This all sounds wonderful. But, there's a problem. How do you actually do that?
Additionally, how do you provide this tooling without getting in the way of
what students are actually trying to learn? There are many powerful robotic
simulation libraries and tools out there. But, they all require immense overhead
and fairly deep knowledge to set up and use.

This is also challenging because of the interdisciplinary nature of the class. There
are plenty of Computer Science and Electrical Engineering students who are
comfortable with programming. But, there are also lots of Mechanical Engineers
who haven't ever ventured outside of the Arduino IDE.

Taking all of this into consideration, it was clear to me that there was a need
that the current solutions couldn't fulfill. And so (as you may have already
guessed), I decided to build something myself.

The goal was to develop a tool that would allow students to simulate their existing
Arduino code (with minimal setup & intrusion) 

# Physics Simulation

I started with a blank C++ project with my first goal of building a minimal, but
extensible physics simulator. This simulator needed to provide a fairly accurate
model of how a tank drive robot would behave in the real world. This required
lots of reading, brushing up on my dynamics, and quite a bit of support from my
professor. Eventually, though, I had a basic simulator that could run in real time
and react to inputs from the keyboard.

# Arduino Runtime

While driving a little simulated robot around is really fun, to achieve the goal
I set out at the start of the project, the simulator needed an interface for
Arduino sketches.

This actually proved quite challenging, and was a good lesson in the types of
trade-offs and decisions that are made constantly across engineering. The most
robust way to implement this would have been to compile the user's sketch and
run the binary output through an Arduino emulator. This would ensure that the
user's code would behave the exact same way in the simulator and in the real
world.

However, this level of fidelity was simply not necessary for this project, and
would introduce an incredible amount of overhead that would provide no real gain.
For this application, we weren't concerned with manually writing code to handle
interrupts from encoders or the exact timing of a measurement from a time of flight
sensor.

On the other end of the complexity spectrum, the project could have just provided
pre-built objects for use in user-code. For example, a user could include the
`Encoder.h` file in their sketch, and use its provided functions to interface
with the simulator. This has a lot of upsides, in that its similar to how one would
use an encoder on an actual robot. No one is writing their own encoder handling
code. Most people just use the standard `Encoder` library from Arduino's ecosystem.

Of course, there were also downsides here. Abstracting all of the interfacing
functionality into pre-built objects is limiting. Specifically when thinking
about simpler hardware like buttons or potentiometers. Forcing the user to include
a `Button.h` header file when they're used to just being able to `digitalRead()`
a pin would break the goal of this simulator being minimally intrusive into users'
workflow.

As with many things in engineering, the solution I settled on was a compromise
between these two. It does make sense to provide ready-to-use objects like Encoders,
but you also need more granular simulation of individual pin states. The solution
here involved developing a `capability` interface that would represent some
functionality of a piece of hardware. For more abstracted hardware like motors
and encoders, the capability could represent the ability to set a PWM or read a
count. On the other hand, for a individual pin, the capability could represent
the ability to be set high or low.

Then a singleton `ArduinoRuntime` would aggregate these capabilities. So, an
`Encoder` object could access the runtime internally to read counts from
simulated hardware, and the simulator could provide the standard Arduino free
functions like `digitalRead()` which could also call into the runtime to read
and set the states of an individual pin.

# Usability

Naturally, the next question was: How will users actually set up these interfaces?
The mechanism for this is a single function `simInit()`. A user would add this
function to their sketch and define how the simulator should be set up:

```cpp
// In a .ino, or a .h file included in the base sketch
std::unique_ptr<SimulatorBase> simInit() {
    // Code to create simulated robot
    // Set parameters like mass and physical size

    // Register hardware like motors and encoders on specific pins

    // Register simpler hardware like buttons to pins through the runtime
}
```

Of course, in pursuit of ease of use, Mosscap also provides ready-to-use simulators
that provide sensible defaults to get users up and running fast. Rather than
implementing the `simInit()` function manually, users can just `#include <mosscap/defaultTank.h>`,
which provides a complete simulation environment with no setup required.

# Debugging Features

Because this simulator is virtual, it's not limited to just a serial port for
debugging information. In fact, I was able to build in some powerful debugging
features in the form of "overlays".

As I was writing this, I figured that: if the simulator already needed functionality
to draw things to the visualization window and to write telemetry to the
telemetry window, then I may as well extend these features to be usable from
the user's code as well.

To achieve this, I implemented a `Drawable` and a `TelemetryWriter` interface
that users can extend to render debug information to the simulator directly
from within their code.

For example, an `Odometry` class could render its estimated position to the
telemetry window, which could allow a user to compare the robot's estimated
position to the robot's simulated position. In this way, they could validate
that their pose-estimation functionality is working as they expect.

Another great example is mapping. Mosscap supports adding a time-of-flight sensor
to the simulated robot for mapping tasks. With overlays, it's possible to render
the robot's occupancy map on top of the simulated world to compare where the
robot thinks obstacles are and where they actually are.

# Accessibility

Mosscap is written in C++, which means that portability and ease of use are a
challenge. While it only has a couple of dependencies (Dear Imgui, GLFW, and
Boost), finding an easy way to install and use the simulator was paramount.

For this, I utilized webassembly. By compiling to wasm, the simulator can be
opened in any (modern) web browser and work just as if it were running on the
desktop. Of course, the compilation is still an issue. To solve this, I packaged
the entire simulator inside an extension for VS Code.

The extension handles installing the emscripten toolchain, and has actions
to start the simulator. This means that the simulator is one-click installable,
which is a huge win over forcing users to deal with manual toolchain management
and library installation.

# Expanding Access

Finally, I figured that this tool could have potential uses just beyond this
single class at Mines. So, I spent some time writing up a series of guided
programming exercises that walk learners through some similar introductory
robotics concepts from basic movement to mapping and path planning with A*.