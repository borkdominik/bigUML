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

- Implemented CRUD
  - Dependency
  - Package
  - Package Import
  - Package Merge

---

# Next Steps

- Implement remaining elements
  - Compartment display for packages
- Implement remaining features of current elements
  - URI label for packages
- Style the package element as a folder
- Add custom icon for package element in the palette toolbar

---

# Questions

- Should [**PackageableElement**](https://www.uml-diagrams.org/package-diagrams.html#packageable-element) be an abstract element, or should we implement all concrete subclasses?
- Should **Dependency** have a visibility?
