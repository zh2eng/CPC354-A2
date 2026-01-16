// CHANGE 'length' TO 'cubeLen' TO AVOID CONFLICT
var cubeLen = 5.5; 

var cube = [
    vec4(-cubeLen, -cubeLen, -cubeLen, 1.0),
    vec4(-cubeLen,  cubeLen, -cubeLen, 1.0),
    vec4( cubeLen,  cubeLen, -cubeLen, 1.0),
    vec4( cubeLen, -cubeLen, -cubeLen, 1.0),

    vec4(-cubeLen, -cubeLen,  cubeLen, 1.0),
    vec4(-cubeLen,  cubeLen,  cubeLen, 1.0),
    vec4( cubeLen,  cubeLen,  cubeLen, 1.0),
    vec4( cubeLen, -cubeLen,  cubeLen, 1.0),
]

setupCube = function() {
    cubeStart = points.length;
    quadrilateral([1, 0, 3, 2], 1, cube);
    quadrilateral([5, 4, 7, 6], 1, cube);
    quadrilateral([1, 0, 4, 5], 2, cube);
    quadrilateral([2, 3, 7, 6], 2, cube);
    quadrilateral([3, 0, 4, 7], 5, cube);
    quadrilateral([6, 5, 1, 2], 5, cube);
    cubeCount = points.length - cubeStart;
}