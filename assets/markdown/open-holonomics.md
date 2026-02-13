---
title: Open Holonomics
thumbnail: /assets/images/OSH-thm.png
description: Open Source, omnidirectional robotic drive-base.
---
# Open Holonomics

> ℹ️ INFO
>
> Status: Ongoing\
> Project Type: Individual
> 
> Overview: An open-source swerve drivetrain project focused on compact
> mechanical design, ROS-based software, and end-to-end system integration.

## Context

In May 2025, I set out to design and build a drivetrain platform that could 
serve as a reusable foundation for future robotics projects. In the short term,
I planned to compete in the [Rival Robotics](https://rivalrobotics.co) 
competition, which defined the constraints for the first iteration:

- Fit within a one-foot square footprint
- Weigh less than 20 pounds
- Be highly maneuverable and robust under defensive play
- Minimize intrusion into the robot frame to allow space for other mechanisms

Because this was a self-funded project, cost was also a major consideration. A 
successful outcome would be a self-contained drivetrain that could “power on and
go,” with the only user interface being a Bluetooth Xbox controller.

Under these constraints, two drivetrain archetypes were viable: mecanum and 
swerve. While mecanum offered a simpler and lower-cost solution, I ultimately 
chose swerve for its superior motion precision and increased resistance to 
defensive interactions. Additionally, since this platform was intended to 
support future work, swerve provided a better foundation for experimenting with 
advanced techniques such as trajectory planning and autonomous control.

Later in the project, I added the goal of fully open-sourcing the design. I 
found that most educational resources for swerve drivetrains were tightly 
coupled to the FIRST Robotics ecosystem, with limited material focused on 
industry-standard tools and workflows. By documenting this project, I aimed to 
create a resource that could help students and hobbyists explore professional 
robotics development practices using a familiar and well-understood drivetrain 
architecture.

The project ultimately grew to encompass mechanical design, ROS-based software 
architecture, system integration, and technical documentation.

## Swerve Module Design

> The swerve modules were designed with compactness, symmetry, and manufacturability
> as primary constraints.

I began the design process by surveying existing swerve module architectures and
commercially available hardware. This research helped me quickly narrow the 
design space and become familiar with common packaging strategies, drivetrain 
layouts, and reduction methods. With this foundation, I moved into OnShape to 
begin blocking out early concepts.

<div class="image-caption">
<div class="image-grid">
<img src="/assets/images/open-holonomics/oh-2.png" alt="First prototype for the wheel assembly">
<img src="/assets/images/open-holonomics/oh-3.png" alt="Section view of wheel assembly">
</div>
<p>
The wheel assembly followed a conventional bevel-gear layout, <br>which proved 
reliable and remained largely unchanged across iterations.
</p>
</div>

During this phase, I noticed that most swerve module designs rely on belts to 
transmit motion for one, or sometimes both, axes. Following this convention, my 
initial design used belt-driven reductions for both steering and drive.

<div class="image-caption">
<img src="/assets/images/open-holonomics/oh-1.png" alt="First prototype with belt drives">
</div>
<br>

As I began sourcing components, however, I discovered that belts in the exact 
lengths I required were either unavailable or prohibitively expensive. At that 
point, I had two options: introduce belt tensioning idlers to absorb the excess 
length, or transition to a gear-driven solution. Because one of the primary 
goals of this project was to minimize module size, I chose to switch to gears 
in order to avoid additional bearing stacks, idlers, and mechanical complexity 
in an already constrained volume.

This decision led to a second-generation design that was more compact, easier to
mirror, and simpler to integrate into a larger drivetrain superstructure.

<div class="image-caption">
<img src="/assets/images/open-holonomics/oh-4.png" alt="Second iteration swerve module design">
</div>

<div class="image-caption">
<img src="/assets/images/open-holonomics/oh-5.png" alt="Full drivetrain CAD">
</div>&nbsp;

From there, the focus shifted to manufacturability. I went through multiple 
cycles of printing, test-fitting, adjusting, and reprinting components while 
tuning gear tooth tolerances, bearing press-fits, and print support strategies 
to achieve consistent dimensional accuracy. Eventually, I arrived at a process 
that produced parts reliably and resulted in smooth, repeatable motion.

<div style="display: flex; align-items: center; justify-content: center;">
<iframe 
width="560" 
height="315" 
src="https://www.youtube.com/embed/NfT4lxc39B0?si=qwqQh9YJnfCrkiHN" 
title="YouTube video player" 
allow="accelerometer; 
clipboard-write; 
encrypted-media; 
gyroscope; 
picture-in-picture; 
web-share" referrerpolicy="strict-origin-when-cross-origin" 
allowfullscreen></iframe>
</div>&nbsp;

This iteration was time well spent. Because the final drivetrain required four 
identical modules, it was critical to validate the design and manufacturing 
process before committing to longer print times and more expensive materials.

For future iterations, my primary objective would be to fit a larger wheel 
within the same general volume. A larger wheel would reduce top speed while 
increasing ground contact, allowing the motors to be geared lower and provide 
higher torque which would be an advantageous tradeoff for competitive play.

## Software Architecture & Learning ROS

> This section focuses on how I structured a ROS-based control stack and adapted
> from monolithic control loops to a modular, node-based architecture.

Having already developed a set of hardware interface packages for the motor 
controllers used in my <a href="/projects/project/?p=driver-interface" target="_blank">
Motor Driver Interface</a> project, the primary challenge here was designing the
high-level controllers and defining the data flow for the rest of the software 
stack.

I initially found this difficult, as I struggled to identify well-documented 
architectural patterns beyond what ros2_control explicitly expects from a 
controller implementation. Outside of that interface, there was relatively 
little guidance on how to structure larger systems. This lack of clear patterns 
was one of the motivations for eventually open-sourcing the project.

As I studied other open-source projects and community discussions, I gradually 
developed a clearer mental model of how a ROS-based system should be structured.
My previous experience with robot control software (largely shaped by FRC) 
resembled a single, sequential control loop where most logic lived in one place 
and data flowed linearly. As a result, my initial instinct with ROS was to 
replicate that approach by placing most functionality into a single node.

Over time, I came to understand how ROS encourages a more modular design, where 
task boundaries naturally map to node boundaries. Instead of one monolithic 
process, a network of smaller, specialized nodes proved to be far more robust, 
testable, and adaptable.

For example, rather than having the swerve controller read directly from the 
gamepad and compute module states end-to-end, intermediary nodes handle distinct
stages of processing. One node converts joystick input into a desired robot 
twist, while the swerve controller is responsible only for forward kinematics 
and command generation. This separation significantly simplifies debugging, as 
failures are easier to isolate when each node has a single, well-defined 
responsibility.

## Integration & Debugging

> This section highlights real integration failures and how architectural decisions
> simplified debugging across hardware and software boundaries.

Integration rarely goes as smoothly as expected, and that was certainly true
for this project. While the final system was intended to run on a Raspberry Pi 
mounted on the robot, initial bring-up was done using a single swerve module 
connected to my Linux desktop to simplify debugging.

The fall semester had started at this point, so the integration process was 
spread out over about 4 months. Making things move was actually pretty easy:

<div style="display: flex; align-items: center; justify-content: center;">
<iframe 
width="560" 
height="315" 
src="https://youtube.com/embed/QoqMaM0Ve_w?si=p0tJgWfkYEVmxnim" 
title="YouTube video player" 
allow="accelerometer; 
clipboard-write; 
encrypted-media; 
gyroscope; 
picture-in-picture; 
web-share" referrerpolicy="strict-origin-when-cross-origin" 
allowfullscreen></iframe>
</div>&nbsp;

Making them move to the right position, at the right time... that was the hard
part. Bugs existed at nearly every level of the software stack, and isolating 
them required careful, systematic debugging. 

One issue in particular highlights the importance of both software architecture 
and low-level protocol understanding.

> I noticed that the azimuth motors weren't tracking their target positions.
> They would track setpoints with a seemingly random offset.
>
> Because the system was implemented as a network of small, focused nodes, I could 
> easily inspect the messages between them and quickly rule out the high level 
> controllers. Not having found the bug, I then went the other direction. I 
> inspected the data coming into the motor drivers with the ODrive python tooling. 
>
> The drives were getting the correct setpoints, they just weren't following them.
> To rule out any firmware or hardware issues, I wrote a standalone python
> script that commanded the motor along a linear path, and that worked 
> flawlessly. This isolated the problem to my CAN protocol implementation.
> 
> Reviewing the ODrive CAN protocol documentation revealed the issue: the 
> position command message contains both a position setpoint and feedforward 
> terms packed into the same 8-byte payload. When I revisited my code, the bug 
> became immediately apparent:
>
> ```cpp
> std::optional<std::string> setInputPos(float pos) {
>        uint64_t data;
>
>        memcpy((uint8_t*) &data, &pos, sizeof(pos));
>        return writeFrame(data, CmdType::SET_INPUT_POS);
> }
> ```
> Only the first four bytes were being populated; the remaining bytes were left 
> uninitialized, causing the motor controller to interpret random feedforward 
> values. Initializing the payload and explicitly setting the feedforward terms 
> resolved the issue:
> ```cpp
> std::optional<std::string> setInputPos(float pos) {
>        uint64_t data = 0;
>
>        int16_t vel_ff = 0;
>        int16_t torque_ff = 0;
>
>        memcpy(((uint8_t*) &data) + 0, &pos, sizeof(pos));
>        memcpy(((uint8_t*) &data) + 4, &vel_ff, sizeof(vel_ff));
>        memcpy(((uint8_t*) &data) + 6, &torque_ff, sizeof(torque_ff));
>        return writeFrame(data, CmdType::SET_INPUT_POS);
> }
> 
> ```

The remainder of the integration process followed a similar pattern: observe 
incorrect behavior, isolate the affected layer, and validate assumptions with 
targeted tests. Over time, this approach led to a fully integrated drivetrain:

<div style="display: flex; align-items: center; justify-content: center;">
<iframe width="560" 
height="315" 
src="https://www.youtube.com/embed/rv_NAZlSw9c?si=hDltmt9kKDS8Ffoa" 
title="YouTube video player" 
allow="accelerometer;
clipboard-write; 
encrypted-media; 
gyroscope; 
picture-in-picture; 
web-share" referrerpolicy="strict-origin-when-cross-origin" 
allowfullscreen></iframe>
</div>

## Technical Writing & Documentation

Throughout the development of this project, I treated documentation as an 
integral part of the engineering process rather than a final deliverable. During
the fall semester, I took Prototyping for Concept Validation, which provided 
several opportunities to formally document design decisions, testing results, 
and iteration strategies directly related to this drivetrain.

In one prototype, I explored alternative materials and an updated mechanical 
design, focusing on validating part strength and performance tradeoffs. That 
report can be found <a href="/assets/pdf/oh-p-2.pdf" target="_blank">here</a>.

In another assignment, I worked with a team of three to develop and iteratively 
refine an instruction manual for the swerve module. The emphasis was on clarity,
assembly order, and error prevention for a first-time builder. That writeup is 
available <a href="/assets/pdf/oh-p-3.pdf" target="_blank">here</a>.

I also documented portions of the system integration process prior to a 
scrimmage event during the Rival Robotics season, focusing on startup and 
shutdown procedures as well as realtime performance. That document can be found
<a href="/assets/pdf/oh-p-4.pdf" target="_blank">here</a>.

While these documents represent meaningful progress, there is still work to be 
done before I would consider this project a complete learning resource for 
others. Some aspects, such as the CAD, are already well-documented, with 
descriptive feature naming used throughout the OnShape models to communicate 
design intent directly within the geometry.

Other areas, particularly lower-level software components like CAN frame 
handling, would benefit from more thorough documentation and cleanup. Similarly,
while a standalone swerve module assembly guide is a good starting point, a full
robot-level assembly and bring-up manual is a much larger undertaking.

I am committed to completing this documentation as the project continues to 
mature. Having learned extensively from open-source robotics projects myself, 
my goal is to make this system usable and understandable by others, and to treat 
its documentation as part of the system, not an afterthought.

## Reflection

This project was big, long, and at times arduous, which makes it difficult to 
reflect on as a single experience. At its core, it began as something I built 
for fun, but it quickly became a way to apply years of engineering theory in a 
real, consequential context.

More than any single technical challenge, this project taught me what it means 
to own a system end-to-end. Every design decision had downstream effects, every
shortcut resurfaced during integration, and every undocumented assumption 
eventually became a problem. Seeing those consequences firsthand fundamentally 
changed how I approach engineering work.

I now think less in terms of isolated components and more in terms of systems 
that must be built, debugged, maintained, and understood by others. That mindset,
of ownership, iteration, and responsibility, is the most valuable outcome of this 
project, and one I intend to carry into future work.