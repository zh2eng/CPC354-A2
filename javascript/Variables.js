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
var isGripping = false; // flag to indicate if gripper is gripping the cube
var animSeq = 0; // variable to track the current animation sequence
var speed = 1; // speed of animation
var animFrame; // variable to store the animation frame ID

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
const jointTranslate = vec3(0, 33.3, 0)

// Reference variables for arm length and cube length
const armLength = 27.5; // From: arm.js, 30-2.5=27.5
const cubeLength = 10.0; // From: cube.js, length=5.0
const jointLength = 6.5; // From: Zhi Heng

// Variables for arm and joint rotation
// Default values
const baseRotationInit = 0;
const lowerArmRotationInit = [0, 0];
const middleArmRotationInit = [0, 0];
const upperArmRotationInit = [0, 0];
const gripperRotationInit = 35;
var baseRotation = baseRotationInit;
var lowerArmRotation = [...lowerArmRotationInit]; // [arm angle, joint angle]
var middleArmRotation = [...middleArmRotationInit]; // [arm angle, joint angle]
var upperArmRotation = [...upperArmRotationInit]; // [arm angle, joint angle]
var gripperRotation = gripperRotationInit; // gripper angle

// Variables for ideal robot arm orientation for pickup and dropoff
const lowerJoint = -25;
const middleJoint = -48;
const upperJoint = -93;
const gripperPosition = 3;

// Variables for selected paths
// Note: lift angles are relative to ideal angles
// Applies in both display and calculations
var liftAngleLower = 30;
var liftAngleMiddle = 30;
var liftAngleUpper = 30;

// Variable for position of robot arm and cube
const robotPositionInit = [0, -8, -50];
var robotPosition = [...robotPositionInit];
const cubePositionInit = [14, -8, -50];
var cubePosition = [...cubePositionInit];

// Slider and textbox for world scale
const worldScaleInit = 0.25;
var worldScale = worldScaleInit;
var worldSlider, worldTextbox;

// Slider and textbox for robot arm
var armRadio = [], armLabel, armRadioLabels = ["base", "lowerArm", "middleArm", "upperArm"];
var positionRadio = [], positionLabel, positionRadioLabels = ["xPosition", "yPosition", "zPosition"];
var index = 0, indexP = 0; // use for keydown function
var jointSlider, jointTextbox, armSlider, armTextbox, positionSlider, positionTextbox;

// Slider and textbox for gripper
var gripperSlider, gripperTextbox;