function setActiveNode(nodes, node) {

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

document.addEventListener('DOMContentLoaded', function() {

    // Get all node elements in the SVG
    const nodes = document.querySelectorAll('.node');
    
    nodes.forEach(node => {
        node.addEventListener('click', () => setActiveNode(nodes, node));
        node.style.cursor = 'pointer';
    });

});
