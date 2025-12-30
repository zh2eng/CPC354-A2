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
// var armStart, armCount;
// var armLength, armWidth, armHeight;
// var jointStart, jointCount;
// var jointLength, jointWidth, jointHeight;
// var gripperStart, gripperCount;
// var gripperLength, gripperWidth, gripperHeight;

// Variables to control robot arm orientation
// Initial angles for each part of the robot arm
const initialState = {
    lowerArmAngle: -20,
    lowerArmJointAngle: 20,
    middleArmAngle: -40,
    middleArmJointAngle: -50,
    upperArmAngle: -50,
    upperArmJointAngle: 50,
    leftGripperJointAngle: 30,
    rightGripperJointAngle: 60
}

const animationState = {
    lowerArmAngle: initialState.lowerArmAngle,
    lowerArmJointAngle: initialState.lowerArmJointAngle,
    middleArmAngle: initialState.middleArmAngle,
    middleArmJointAngle: initialState.middleArmJointAngle,
    upperArmAngle: initialState.upperArmAngle,
    upperArmJointAngle: initialState.upperArmJointAngle,
    leftGripperJointAngle: initialState.leftGripperJointAngle,
    rightGripperJointAngle: initialState.rightGripperJointAngle
}


var stack = [];

// Colors for the vertices
var newColors = [
    vec4(0.15, 0.15, 0.15, 1.0), // Deep Charcoal
    vec4(0.45, 0.45, 0.45, 1.0), // Dark Silver
    vec4(0.0, 0.0, 1.0, 1.0), // Blue
    vec4(0.15, 0.15, 0.35, 1.0), // Charcoal Blue
    vec4(0.75, 0.75, 0.75, 1.0) // Standard Silver
];