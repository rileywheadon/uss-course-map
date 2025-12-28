function setActiveNode(nodes, node) {
    document.getElementById("viewing-title")?.style.setProperty("display", "none");

    // Get the course code from the node's title element
    const titleElement = node.querySelector('title');

    // Extract course code (remove newlines and spaces)
    let courseCode = titleElement.textContent.replace(/\s+/g, '');
    
    // Hide all course details first
    const allCourseDetails = document.querySelectorAll('.course-details');
    allCourseDetails.forEach(detail => {
        detail.style.display = 'none';
    });
    
    // Show the clicked course's details
    const courseDetail = document.getElementById(courseCode);
    if (courseDetail) {
        courseDetail.style.display = 'block';
    }

    // Reset all nodes and edges to default colors
    nodes.forEach(otherNode => {
        otherNode.querySelector('ellipse').setAttribute('fill', '#f2f2f2');
    });
    
    // Reset all edges to default color
    const allEdges = document.querySelectorAll('.edge path');
    allEdges.forEach(edge => {
        edge.setAttribute('stroke', 'gray85');
    });

    // Make the selected node green
    node.querySelector('ellipse').setAttribute('fill', 'lightgreen');

    // Highlight incoming edges (arrows pointing TO this node)
    const edges = document.querySelectorAll('.edge');
    edges.forEach(edge => {

        const edgeTitle = edge.querySelector('title');
        const edgeText = edgeTitle.textContent.replace(/\s+/g, '');
                
        const edgePath = edge.querySelector('path');
        const edgePolygon = edge.querySelector('polygon'); 

        // Get edges that point TO our selected node
        if (edgeText.slice(-7) === courseCode) {
            edgePath.setAttribute('stroke', 'black');
            edgePolygon.setAttribute('stroke', 'black');
            edgePolygon.setAttribute('fill', 'black');
        } else {
            edgePath.setAttribute('stroke', '#f2f2f2');
            edgePolygon.setAttribute('stroke', '#f2f2f2');
            edgePolygon.setAttribute('fill', '#f2f2f2');    
        }
    });

}

function highlightPrerequisites(node, codeSet) {
    const titleElement = node.querySelector('title');

    // Extract course code (remove newlines and spaces)
    let courseCode = titleElement.textContent.replace(/\s+/g, '');

    // Make the selected node blue
    node.querySelector('ellipse').setAttribute('fill', '#bfdbfe');

    // Highlight incoming edges (arrows pointing TO this node)
    const edges = document.querySelectorAll('.edge');
    edges.forEach(edge => {
        const edgeTitle = edge.querySelector('title');
        const edgeText = edgeTitle.textContent.replace(/\s+/g, '');
                
        const edgePath = edge.querySelector('path');
        const edgePolygon = edge.querySelector('polygon'); 
        const parts = edgeText.split("->");

        const src = parts[0]; 
        const dst = parts[1];  

        // Get edges that point TO our selected node AND are a prerequisite
        if (dst === courseCode && codeSet.has(src)) {
            edgePath.setAttribute('stroke', 'black');
            edgePolygon.setAttribute('stroke', 'black');
            edgePolygon.setAttribute('fill', 'black');
        }     
    });

}

document.querySelectorAll(".program-button").forEach(btn => {
    btn.addEventListener("click", () => {
        const programName = btn.dataset.program;
        const nodes = document.querySelectorAll('.node');

        // Reset all edges to default color
        const allEdges = document.querySelectorAll('g.edge');
            allEdges.forEach(edge => {
            const edgePath = edge.querySelector('path');
            if (edgePath) edgePath.setAttribute('stroke', "gray85");
        });


        // Reset all edge polygons
        allEdges.forEach(edge => {
            const edgePolygon = edge.querySelector('polygon');
            const edgePath = edge.querySelector('path');
            if (edgePolygon) {
                edgePath.setAttribute('stroke', '#f2f2f2');
                edgePolygon.setAttribute('stroke', '#f2f2f2');
                edgePolygon.setAttribute('fill', '#f2f2f2');
            }
        });

        // Reset all nodes to default color
        nodes.forEach(otherNode => {
            otherNode.querySelector('ellipse').setAttribute('fill', '#f2f2f2');
        });


        const data = JSON.parse(
        document.getElementById("program-buttons").dataset.programs
        );

        const selected = data.find(p => p.program === programName);
        const stats_requirements = selected.stats_requirements;
        const codeSet = new Set();
        for (const item of stats_requirements) {
            codeSet.add(item.code);
        }

        nodes.forEach(node => {
            const titleElement = node.querySelector('title');
            let courseCode = titleElement.textContent.replace(/\s+/g, '');

            if (codeSet.has(courseCode)) {
                highlightPrerequisites(node,codeSet);
            }
        });
    });
});


document.addEventListener('DOMContentLoaded', function() {

    // Get all node elements in the SVG
    const nodes = document.querySelectorAll('.node');
    
    // Set default styles on each node
    nodes.forEach(node => {
        node.addEventListener('click', () => setActiveNode(nodes, node));
        node.style.cursor = 'pointer';

        const ellipse = node.querySelector('ellipse');
        ellipse.setAttribute('stroke', '#111827');
        ellipse.setAttribute('stroke-width', '0.75');

        const textElements = node.querySelectorAll('text');
        textElements.forEach(text => {
            text.setAttribute('font-size', '13.00');
        })
    });

});
