// Backdrop screen for better lighting visualization

var backdropLen = 250.0, backdropHeight = 300.0;

// Create a plane positioned behind the robot
var backdropWall = [
    vec4(-backdropLen, floorPosition, -100.0, 1.0),  // bottom-left
    vec4( backdropLen, floorPosition, -100.0, 1.0),  // bottom-right
    vec4( backdropLen,  backdropHeight+floorPosition, -100.0, 1.0),  // top-right
    vec4(-backdropLen,  backdropHeight+floorPosition, -100.0, 1.0),  // top-left
]

var backdropFloor = [
  vec4(-backdropLen, floorPosition, -100, 1.0),  // bottom-left
  vec4( backdropLen, floorPosition, -100, 1.0),  // bottom-right
  vec4( backdropLen, floorPosition, 100, 1.0),  // top-right
  vec4(-backdropLen, floorPosition, 100, 1.0),  // top-left
]

setupBackdrop = function() {
    backdropStart = points.length;
    // Create a single plane (quadrilateral = 2 triangles)
    // Using color index 5 (Dark Green)
    quadrilateral([0, 1, 2, 3], 5, backdropWall);
    quadrilateral([0, 1, 2, 3], 0, backdropFloor);
    backdropCount = points.length - backdropStart;
}

drawBackdrop = function() {
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.uniformMatrix3fv(normalMatrixLoc, false, flatten(normalMatrix(modelViewMatrix, true)));
    gl.drawArrays(gl.TRIANGLES, backdropStart, backdropCount);
}
