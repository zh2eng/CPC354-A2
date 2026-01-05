//helper to calculate direction of a face
function computeNormal(a, b, c) {
    var t1 = subtract(b, a);
    var t2 = subtract(c, b);
    var normal = normalize(cross(t1, t2));
    return normal;
}

// Setup geometry function in quadrilateral form
// Form by 2 triangle
function quadrilateral(List, colorIndex, Vertex) {
    var normal = computeNormal(Vertex[List[0]], Vertex[List[1]], Vertex[List[2]])
    reorderIndices = [List[0], List[1], List[2], List[0], List[2], List[3]];
    for (let i = 0; i < 6; i++) {
        points.push(Vertex[reorderIndices[i]]);
        colors.push(newColors[colorIndex]);
        normals.push(normal);
    }
}


// Setup geometry function in triangle form
function triangle(List, colorIndex, Vertex) {
    var normal = computeNormal(Vertex[List[0]], Vertex[List[1]], Vertex[List[2]])
    for (let i = 0; i < 3; i++) {
        points.push(Vertex[List[i]]);
        colors.push(newColors[colorIndex]);
        normals.push(normal);
    }
}

function drawJoint(){
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.uniformMatrix3fv(normalMatrixLoc, false, flatten(normalMatrix(modelViewMatrix, true)));
    gl.drawArrays(gl.TRIANGLES, jointStart, jointCount);
}

function drawArm() {
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.uniformMatrix3fv(normalMatrixLoc, false, flatten(normalMatrix(modelViewMatrix, true)));
    gl.drawArrays(gl.TRIANGLES, armStart, armCount);
}

function drawJoint() {
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.uniformMatrix3fv(normalMatrixLoc, false, flatten(normalMatrix(modelViewMatrix, true)));
    gl.drawArrays(gl.TRIANGLES, jointStart, jointCount);
}

function drawGripper() {
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.uniformMatrix3fv(normalMatrixLoc, false, flatten(normalMatrix(modelViewMatrix, true)));
    gl.drawArrays(gl.TRIANGLES, gripperStart, gripperCount);
}

function drawCube() {
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.uniformMatrix3fv(normalMatrixLoc, false, flatten(normalMatrix(modelViewMatrix, true)));
    gl.drawArrays(gl.TRIANGLES, cubeStart, cubeCount);
}

function pushMatrix() {
    let m = mat4();
    for (let i = 0; i < 16; i++) m[i] = modelViewMatrix[i];
    stack.push(m);
}

function popMatrix() {
    modelViewMatrix = stack.pop();
}
