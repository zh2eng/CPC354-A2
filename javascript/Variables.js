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
var cubeStart, cubeCount;

var stack = [];

// Colors for the vertices
var newColors = [
    vec4(0.15, 0.15, 0.15, 1.0), // Deep Charcoal
    vec4(0.45, 0.45, 0.45, 1.0), // Dark Silver
    vec4(0.0, 0.0, 1.0, 1.0), // Blue
    vec4(0.15, 0.15, 0.35, 1.0), // Charcoal Blue
    vec4(0.75, 0.75, 0.75, 1.0) // Standard Silver
];

// Constant for initial translation values
const armTranslate = vec3(0, 0.0025, 0)
const jointTranslate = vec3(0, 23.3, 0)

// Variables for arm and joint rotation
var baseRotation = 0;
var lowerArmRotation = [-20, 20]; // [arm angle, joint angle]
var middleArmRotation = [-30, -50]; // [arm angle, joint angle]
var upperArmRotation = [-60, -10]; // [arm angle, joint angle]
var gripperRotation = 5; // gripper angle

// Variable for position of robot arm
var robotPosition = [0, -8, -50];

// Slider and textbox for world scale
var worldScale = 0.25;
var worldSlider, worldTextbox;

// Slider and textbox for robot arm
var armRadio = [], armLabel, armRadioLabels = ["base", "lowerArm", "middleArm", "upperArm"];
var positionRadio = [], positionLabel, positionRadioLabels = ["xPosition", "yPosition", "zPosition"];
var index = 0, indexP = 0; // use for keydown function
var jointSlider, jointTextbox, armSlider, armTextbox, positionSlider, positionTextbox;

// Slider and textbox for gripper
var gripperSlider, gripperTextbox;