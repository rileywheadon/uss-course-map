# Course Map Design

Details: https://en.wikipedia.org/wiki/Layered_graph_drawing

## Architecture

Web server: Flask

General idea:

- User loads home page, sends HTTP request to Flask web server.
- `/` endpoint makes the following calls: 
  - `generateGraph` which generates a graphviz dot file using `buildLinks`
  - `buildLinks`, which generates a list of links (source, target, type)
  - `getDependencies` is used by `buildLinks` to get dependencies from `courses.json`
  - Then, it executes `dot -Tsvg` and injects the resulting SVG into the response
- We need a Javascript file `main.js` that does the following:
  - On click, highlights the selected node and all prerequisite edges/nodes
  - Also fades out all other nodes to make it easier to focus
  - Unhides the sidebar and unhides the details for the selected course
  - When the user clicks off the course, it should go back to the default view
- Also add a CSS file `styles.css`: 
  - For basic hover effects in the SVG
  - For styling the sidebar containing course details

## Link-Building Algorithm 

- Load the `courses.json` file.
- Flatten the prerequisites/corequisites for each course in `getDependencies`.
  - For now, only include any courses that start with the four characters `"STAT"`.
  - Maintain information about whether the dependency is a prerequisite or corequisite.
- Create a list of links between courses (2-course tuples, prerequisite goes first).

Example: 

```js
links = [
  {"source": "STAT200", "target": "STAT305", "type": "prereq"}, 
  {"source": "STAT201", "target": "STAT301", "type": "prereq"}
  {"source": "STAT305", "target": "STAT321", "type": "coreq"}
  ...
]
```
