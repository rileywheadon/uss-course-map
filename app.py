from flask import Flask, render_template
import subprocess
import json

app = Flask(__name__)


# Check if a course code is a STAT course
def is_stat(code):
    return isinstance(code, str) and code.startswith('STAT')


# Recursively extract any course codes from a prereq/coreq node
def extract_codes(node, code_type, out=None):
    if out is None:
        out = set()
    
    if isinstance(node, list):
        for n in node:
            extract_codes(n, code_type, out)
        return out
    
    if isinstance(node, dict):
        if 'code' in node and is_stat(node['code']):
            out.add((node['code'], code_type))
        
        # Recurse into logical keys if present
        for k in ['any', 'all']:
            if k in node:
                extract_codes(node[k], code_type, out)
    
    return out


# Build links between courses based on prerequisites and corequisites
def build_links(courses):

    # Map of course codes to dependencies (prerequisites and corequisites)
    dependencies = {}
    for course in courses:
        deps = set()
        if 'prereqs' in course:
            deps = extract_codes(course['prereqs'], 'prereq', deps)
        if 'coreqs' in course:
            deps = extract_codes(course['coreqs'], 'coreq', deps)
        dependencies[course['code']] = deps
    
    # Build links: for each dependency create a dictionary
    links = []
    for code, deps in dependencies.items():
        for dep_code, dep_type in deps:
            links.append({
                'source': code,
                'target': dep_code,
                'type': dep_type
            })
    
    return links


def generateGraph(courseData):
    links = build_links(courseData)

    # Convert links to DOT format
    dot_links = []
    for link in links:
        source = f"{link['source'][:4]}\n{link['source'][4:]}"
        target = f"{link['target'][:4]}\n{link['target'][4:]}"
        if link['type'] == 'coreq':
            dot_links.append(f'"{target}" -> "{source}" [style=dashed color="gray95"]; ')
        else:
            dot_links.append(f'"{target}" -> "{source}" [color="gray95"]; ')

    links_str = '\n'.join(dot_links)

    return f"""digraph {{
        outputorder="edgesfirst";
        rankdir="BT";
        splines="line";
        node [style=filled fillcolor="#f2f2f2"];
        edge [penwidth=1];
        {links_str}
    }}
    """


def loadData(filename):
    with open(f'data/{filename}') as f:
        courses = json.load(f)

    return courses


@app.route('/')
def index():
    courseData = loadData("courses.json")
    courseGraph = generateGraph(courseData)
    courseMap = subprocess.check_output(['dot', '-Tsvg_inline'], input=courseGraph.encode()).decode('utf-8')
    return render_template("index.html", courseMap=courseMap, courseData=courseData)

if __name__ == '__main__':
    app.run(debug=True)