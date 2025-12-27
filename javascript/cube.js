var length = 3.0;
var cube = [
    vec4(-length, -length, -length, 1.0),
    vec4(-length,  length, -length, 1.0),
    vec4( length,  length, -length, 1.0),
    vec4( length, -length, -length, 1.0),

    vec4(-length, -length,  length, 1.0),
    vec4(-length,  length,  length, 1.0),
    vec4( length,  length,  length, 1.0),
    vec4( length, -length,  length, 1.0),
]

setupCube = function() {
    cubeStart = points.length;
    quadrilateral([1, 0, 3, 2], 0, cube);
    quadrilateral([5, 4, 7, 6], 0, cube);
    quadrilateral([1, 0, 4, 5], 1, cube);
    quadrilateral([2, 3, 7, 6], 1, cube);
    quadrilateral([3, 0, 4, 7], 2, cube);
    quadrilateral([6, 5, 1, 2], 2, cube);
    cubeCount = points.length - cubeStart;
}