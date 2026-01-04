
/*-----------------------------------------------------------------------------------*/
// WebGL Utilities
/*-----------------------------------------------------------------------------------*/
// Execute the init() function when the web page has fully loaded
window.onload = function init() {
    setupJoint();
    setupArm();
    setupGripper();
    setupCube();
    // WebGL setups
    getUIElement();
    configWebGL();
}

// Configure WebGL Settings
function configWebGL() {
    // Initialize the WebGL context
    gl = WebGLUtils.setupWebGL(canvas);

    if (!gl) {
        alert("WebGL isn't available");
    }

    // Set the viewport and clear the color
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.0, 0.0, 0.0, 0.0);

    // Enable hidden-surface removal
    gl.enable(gl.DEPTH_TEST);

    // Compile the vertex and fragment shaders and link to WebGL
    program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    // Create buffers and link them to the corresponding attribute variables in vertex and fragment shaders
    // Buffer for positions
    posBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);

    vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    // Buffer for colors
    colBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);

    vColor = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);

    // Get the location of the uniform variables within a compiled shader program
    modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");
    projectionMatrixLoc = gl.getUniformLocation(program, "projectionMatrix");

    render();
}

// Render the graphics for viewing
function render() {
    // Pass a perspective projection matrix to the shader
    // projectionMatrix = orthogonal(-10, 10, -12, 12, 0.1, 100);
    projectionMatrix = perspective(45, canvas.width / canvas.height, 0.1, 100);
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));

    animUpdate();
}

animUpdate = function () {
    // Clear the color buffer and the depth buffer before rendering a new frame
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Create the model view matrix
    modelViewMatrix = mat4();
    modelViewMatrix = mult(modelViewMatrix, translate(robotPosition[0], robotPosition[1], robotPosition[2]));
    modelViewMatrix = mult(modelViewMatrix, rotateY(baseRotation));
    modelViewMatrix = mult(modelViewMatrix, scalem(worldScale, worldScale, worldScale))

    if(doAnimation){
        animate();
    }

    // Start of Hierarchical Model
    pushMatrix();
    setupRobotArm();
    if (isGripping) {
        // Include cube setup within the robot arm matrix stack
        setUpCube();
        popMatrix();
    } else {
        popMatrix();
        setUpCube();
    }
    if (doAnimation) animFrame = requestAnimationFrame(animUpdate);
}

setupRobotArm = function () {
    drawJoint();

    // === LOWER ARM ===
    modelViewMatrix = mult(modelViewMatrix, translate(armTranslate));
    modelViewMatrix = mult(modelViewMatrix, rotateZ(lowerArmRotation));
    drawArm();

    // === LOWER ARM JOINT ===
    modelViewMatrix = mult(modelViewMatrix, translate(jointTranslate));
    drawJoint();

    // === MIDDLE ARM ===
    modelViewMatrix = mult(modelViewMatrix, translate(armTranslate));
    modelViewMatrix = mult(modelViewMatrix, rotateZ(middleArmRotation));
    drawArm();

    // === MIDDLE ARM JOINT ===
    modelViewMatrix = mult(modelViewMatrix, translate(jointTranslate));
    drawJoint();

    // === UPPER ARM ===
    modelViewMatrix = mult(modelViewMatrix, translate(armTranslate));
    modelViewMatrix = mult(modelViewMatrix, rotateZ(upperArmRotation));
    drawArm();

    // === UPPER ARM JOINT ===
    modelViewMatrix = mult(modelViewMatrix, translate(jointTranslate));
    drawJoint();

    // === LEFT GRIPPER ===
    modelViewMatrix = mult(modelViewMatrix, translate(armTranslate));
    modelViewMatrix = mult(modelViewMatrix, scalem(-1, -1, -1));
    modelViewMatrix = mult(modelViewMatrix, rotateZ(gripperRotation));
    drawGripper();

    // === RIGHT GRIPPER ===
    modelViewMatrix = mult(modelViewMatrix, scalem(-1, 1, 1));
    // 2 times left gripper to balance the gripper purpose
    modelViewMatrix = mult(modelViewMatrix, rotateZ(gripperRotation * 2));
    drawGripper();
}

setUpCube = function () {
    // should be do animation and cube gripped, cube gripping to be added later
    if(isGripping){
        // translate the cube to be in front of the gripper
        // translation of 2 units in the direction of upperArmRotation[1]
        modelViewMatrix = mult(modelViewMatrix, translate(0, -8, 0));
        modelViewMatrix = mult(modelViewMatrix, rotateY(upperArmRotation));
    } else{
        // Use cubePosition and default orientation when not gripping
        modelViewMatrix = mat4();
        modelViewMatrix = mult(modelViewMatrix, translate(cubePosition[0], cubePosition[1], cubePosition[2]));
        modelViewMatrix = mult(modelViewMatrix, rotateX(0));
        modelViewMatrix = mult(modelViewMatrix, rotateY(0));
        modelViewMatrix = mult(modelViewMatrix, scalem(worldScale, worldScale, worldScale));
    }
    drawCube();
}