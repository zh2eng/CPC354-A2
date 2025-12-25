// Setup geometry function in quadrilateral form
// Form by 2 triangle
function quadrilateral(List, colorIndex, Vertex) {
    reorderIndices = [List[0], List[1], List[2], List[0], List[2], List[3]];
    for (let i = 0; i < 6; i++) {
        points.push(Vertex[reorderIndices[i]]);
        colors.push(newColors[colorIndex]);
    }
}


// Setup geometry function in triangle form
function triangle(List, colorIndex, Vertex) {
    for (let i = 0; i < 3; i++) {
        points.push(Vertex[List[i]]);
        colors.push(newColors[colorIndex]);
    }
}

function drawArm() {
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays(gl.TRIANGLES, armStart, armCount);
}

function drawJoint() {
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays(gl.TRIANGLES, jointStart, jointCount);
}

function drawGripper() {
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays(gl.TRIANGLES, gripperStart, gripperCount);
}

function pushMatrix() {
    let m = mat4();
    for (let i = 0; i < 16; i++) m[i] = modelViewMatrix[i];
    stack.push(m);
}

function popMatrix() {
    modelViewMatrix = stack.pop();
}