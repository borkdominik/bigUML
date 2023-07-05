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

# Feedback

- No major bugs found
- Minor rendering discrepancies
  - Font style
  - Relations rendering - the relations should be created as directional (instead of S-shape)
- Outline is useful

---

# Open Issues

- No known issues
  - Except minor rendering discrepancies

---

# Further Improvements & Ideas

- Package rendering
  - Blocked by edge routing
  - Hidden behind flag(s)
- Generalize outline icon configuration
- Cherry-pick further concrete PackageableElements

---

# Reflection

- Too many files need to change to add a new element/relation
  - It could be simplified by generalizing CRUD actions for any element and having a concept of element registration (define element graphical representation, assignment of attributes, attribute types, etc.)
  - Designing an element on server and client (SVG) seems like a double work - it could be maybe simplified by providing higher level APIs
- Number of abstractions made it hard to get started
  - But also easy to extend
- Implementing the outline was challenging
  - But also a great learning experience
