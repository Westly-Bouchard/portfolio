---
title: Mash Language
thumbnail: /assets/images/mash.png
description: A simple, interpreted scripting language written in C++
---

<div style="display: flex; justify-content: center; align-items: center;">
<img class="banner" src="/assets/images/mash-banner.png" alt="Banner image">
</div>

# Mash (Mini-Bash)

> ℹ️ INFO
>
> Status: Completed on December 2, 2023\
> Associated Course: CSCI 200 | Foundational Programming Concepts & Design\
> Project Type: Individual

## Motivation

I had been reading [crafting interpreters](https://craftinginterpreters.com)
for fun during my first semester at Mines. And so, when it came time to propose
a final project for my introductory C++ course, I felt it was the perfect 
opportunity to give language and interpreter design a shot.

I designed a small language called Mash by defining its grammar, then I
implemented a recursive descent parser and tree-walk interpreter for it in C++.

<div class="link">
<a href="https://github.com/Westly-Bouchard/Mash" target="_blank">Github Repo</a>
</div>

<div class="link">
<a href="https://wcbouchard.notion.site/Mash-Mini-Bash-6ac7d512f7d44a979ff949cee4f2b052" target="_blank">Full Design Document</a>
</div>

## Grammar

This was an interesting experience for me because, even though I've been writing
code in some respect for almost a decade, I had never really stopped to think
about how the programming languages I used were designed. The exact syntax for
any given language had always just been an abstract set of rules I knew I needed
to follow.

Designing a language and writing its grammar gave me insight into how those 
rules are created and restricted by the structure of the programs that actually
run the code we write. Language design forced me to think carefully about things
such as:
- How expressions and statements are represented internally
- Why certain language constructs are easier to reason about than others
- How syntax choices affect parsing complexity and semantic clarity

I learned a lot about why mainstream languages make the design tradeoffs they do,
particularly around readability, ambiguity, and extensibility.

## The Visitor Pattern

This project exposed me to a powerful new design pattern: the visitor pattern.
Rather than embedding behavior directly into AST node classes, I used visitors
to separate syntax structure from execution semantics.

This made adding new operations (evaluation, debugging, etc.) much easier and
helped me understand why this pattern is so common in compilers and
interpreters.

It always helps to have a design pattern solve a real structural problem, it
makes it _click_ in a way that abstract examples just can't.

## Modern C++

Finally, this project gave me the opportunity to go beyond the C++ that we had
learned in class and explore variadic templates along with more modern features
like `std::optional` and smart pointers.

Smart pointers helped me enforce clear ownership semantics across the AST, and
Variadic templates were integral to my visitor pattern implementation.

Overall, I was able to significantly improve my confidence writing expressive,
safe C++, especially for complex object hierarchies.

## Reflections

Beyond language design and interpreter architecture, this project taught me that
complex technical topics are approachable with the right mindset.

Designing and implementing Mash helped me move from seeing programming languages
as opaque tools to understanding them as systems I could reason about and build 
myself. It solidified my confidence not just as someone who writes code, but as 
someone who can design and engineer complex software systems.

