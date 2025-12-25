/*-----------------------------------------------------------------------------------*/
// Variable Declaration
/*-----------------------------------------------------------------------------------*/

/*************************************************************************************/
// Common webGL Variables
/*************************************************************************************/
var canvas, gl, program;
var posBuffer, colBuffer, vPosition, vColor;
var modelViewMatrixLoc, projectionMatrixLoc;
var modelViewMatrix, projectionMatrix;

/*************************************************************************************/
// Variables for UI elements
/*************************************************************************************/
// Start/Stop button, reset button
var toggleButton, resetButton;

var position = [], theta = [], scaleNum = []

// 6. Animation state control
var doAnimation = false; // flag to indicate if animation is running

// Variables for the robot arms
var points = [], colors = [];
var armStart, armCount;
var jointStart, jointCount;
var gripperStart, gripperCount;

var stack = [];

// Colors for the vertices
var newColors = [
    vec4(0.15, 0.15, 0.15, 1.0), // Deep Charcoal
    vec4(0.45, 0.45, 0.45, 1.0), // Dark Silver
    vec4(0.0, 0.0, 1.0, 1.0), // Blue
    vec4(0.15, 0.15, 0.35, 1.0), // Charcoal Blue
    vec4(0.75, 0.75, 0.75, 1.0) // Standard Silver
];