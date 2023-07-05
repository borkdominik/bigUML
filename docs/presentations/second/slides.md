---
# try also 'default' to start simple
theme: 'default'
# random image from a curated Unsplash collection by Anthony
# like them? see https://unsplash.com/collections/94734566/slidev
background: ./img/example.png
# apply any windi css classes to the current slide
class: 'text-center'
# https://sli.dev/custom/highlighters.html
highlighter: shiki
# show line numbers in code blocks
lineNumbers: false
# persist drawings in exports and build
drawings:
  persist: false
# page transition
transition: slide-left
# use UnoCSS
css: unocss
---

# PackageDiagram

<style>
  h1 {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    inset: 0;
    backdrop-filter: blur(3px);
  }
</style>

---

# Current Progress

- Completed functionality
  - Element import relation
- Fixed bugs
- Removed unnecessary properties
- Styling packages as folders (WIP)

---

# Next Steps

- Finalize styling
  - If the package element has no childrens, show the name centered in the element body
- Replicate test models

---

# Questions

- Should the package element look like a folder or as a rectangular element? (styling issue with floating relations next to package header)
- Any desired additional functionality?