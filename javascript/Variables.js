/*-----------------------------------------------------------------------------------*/
// Variable Declaration
/*-----------------------------------------------------------------------------------*/

/*************************************************************************************/
// Common webGL Variables
/*************************************************************************************/
var canvas, gl, program;
var posBuffer, colBuffer, vPosition, vColor, nBuffer, vNormal;
var modelViewMatrixLoc, projectionMatrixLoc, normalMatrixLoc;
var modelViewMatrix, projectionMatrix;
var normals = [];

/*************************************************************************************/
// Ligfhtning Variables
/*************************************************************************************/
var lightPosition = vec4(53.0, 39.0, -10.0, 1.0);
var lightAmbient = vec4(1.0, 1.0, 1.0, 1.0);
var lightDiffuse = vec4(1.0, 1.0, 1.0, 1.0);
var lightSpecular = vec4(1.0, 1.0, 1.0, 1.0);

var materialShininess = 100.0;

var sliderLightX, sliderLightY, sliderLightZ;
var sliderAmbient, sliderDiffuse, sliderSpecular;
var sliderShininess;

var textboxAmbient, textboxLightX, textboxLightY, textboxLightZ;

/*************************************************************************************/
// Variables for UI elements
/*************************************************************************************/
// Start/Stop button, reset button
var toggleButton, resetButton;

var position = [], theta = [], scaleNum = []

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

// Slider and textbox for world scale
const worldScaleInit = 0.25;
var worldScale = worldScaleInit;
var worldSlider, worldTextbox;

// Slider and textbox for robot arm
var armRadio = [], armLabel, armRadioLabels = ["base", "lowerArm", "middleArm", "upperArm"];
var index = 0; // use for keydown function
var jointSlider, jointTextbox, armSlider, armTextbox;

// Slider and textbox for gripper
var gripperSlider, gripperTextbox;

// Notification for cube gripped
var grippedNotif;

/*************************************************************************************/
// Animation function variables
/*************************************************************************************/
// Reference variables for arm length and cube length
const armLength = 27.5; // From: arm.js, 30-2.5=27.5
const cubeLength = 10.0; // From: cube.js, length=5.0
const jointLength = 6.5; // From: Zhi Heng

// Variables for arm and joint rotation
// Default values
const baseRotationDefault = 0;
const lowerArmRotationDefault = 0;
const middleArmRotationDefault = 0;
const upperArmRotationDefault = 0;
const gripperRotationDefault = 35;
// initial rotation angles
var baseRotationStart;
var lowerArmRotationStart;
var middleArmRotationStart;
var upperArmRotationStart;
var gripperRotationStart;
// rotation angles at time of animation
var baseRotation = baseRotationDefault;
// [arm angle, joint angle]
var lowerArmRotation = lowerArmRotationDefault; 
var middleArmRotation = middleArmRotationDefault;
var upperArmRotation = upperArmRotationDefault;
var gripperRotation = gripperRotationDefault; // gripper angle

// Variables for ideal robot arm orientation for pickup and dropoff
const lowerJoint = -27;
const middleJoint = -48;
const upperJoint = -93;
const gripperPosition = 3;

// Variables for selected paths
// Note: lift angles are relative to ideal angles
// Applies in both display and calculations
const liftAngleLower = 30;
const liftAngleMiddle = 30;
const liftAngleUpper = 30;

// Variable for position of cube and robot
const robotPosition = [0, -8, -50];
const cubePositionInit = [14, -8, -50];
var cubePosition = [...cubePositionInit];

/*************************************************************************************/
// Animation state control
/*************************************************************************************/
var doAnimation = false; // flag to indicate if animation is running
var isGripping = false; // flag to indicate if gripper is gripping the cube
var animSeq = 0; // variable to track the current animation sequence
const initialSpeed = 1;
var speed = initialSpeed; // speed of animation
var animFrame; // variable to store the animation frame ID
var cubeAtIdx = 0; // current cube position
const cubeDestinationsInit = [0, -90, -180, -270]; // initial possible cube positions
var cubeDestinations = [...cubeDestinationsInit]; 
var timeoutHolder; // to hold timeout for pause

