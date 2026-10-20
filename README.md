# Markdown Slides

A simple web application to create and present slides using a Markdown file.
Built with **HTML, CSS and JavaScript** (no libraries or frameworks).

## Features

- Create and edit slides by writing Markdown
- Live preview of the current slide while typing
- Save slides in the browser's internal memory (localStorage)
- Slides stay saved even after the browser is closed and opened again
- Present slides in full screen mode
- Slide count shown at the bottom (e.g. `2 / 5`)

## How to Write Slides

All slides go in one Markdown text. Three dashes `---` separate one slide from the next.

    # This is Slide 01
    ## This is Heading 02 in slide 01

    This is your content on slide 01
    ---
    # This is Slide 02
    ## This is Heading 02 in slide 02

    This is your content on slide 02

## Controls

| Action | Button | Keyboard |
|---|---|---|
| Previous slide | Left | Left Arrow |
| Next slide | Right | Right Arrow |
| Full screen on / off | Full Screen | F11 |
| Save slides | Save | Ctrl + S |

- On the first slide, the Left button is disabled.
- On the last slide, the Right button is disabled.
- In presentation mode, the Full Screen button changes to Exit Full Screen.

## How to Run

1. Download or clone this repository.
2. Open `index.html` in any web browser.

## Project Files

- `index.html` - page structure
- `style.css` - styling
- `script.js` - slide logic, markdown conversion, saving and keyboard controls

## Author

Name: YOUR NAME
Roll No: YOUR ROLL NUMBER
BS Information Technology, University of the Punjab
