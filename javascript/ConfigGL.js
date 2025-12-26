
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

// Retrieve all elements from HTML and store in the corresponding variables
function getUIElement() {
    canvas = document.getElementById("gl-canvas");
    toggleButton = document.getElementById('toggleButton');
    resetButton = document.getElementById('reset');

    // Event listener for the toggle button
    toggleButton.addEventListener('click', function () {
        if(!doAnimation){
            toggleButton.innerHTML = '<span>&#9724;</span> Start';
            toggleButton.className = 'base-btn stop-btn';
        }
        else{
            toggleButton.innerHTML = '<span>&#9654;</span> Start';
            toggleButton.className = 'base-btn start-btn';
        }
        doAnimation = !doAnimation
    });
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
    // run animation update if animation is ongoing
    if (doAnimation) animation();
    // Clear the color buffer and the depth buffer before rendering a new frame
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Pass a 4x4 perspective projection matrix to the shader
    projectionMatrix = perspective(45, canvas.width/canvas.height, 0.1, 100);
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));

    setupRobotArm();
    modelViewMatrix = mat4();
    modelViewMatrix = mult(modelViewMatrix, translate(6, -7, -30));
    modelViewMatrix = mult(modelViewMatrix, rotateX(45));
    modelViewMatrix = mult(modelViewMatrix, rotateY(45));
    modelViewMatrix = mult(modelViewMatrix, scalem(0.5, 0.5, 0.5));
    drawCube();

    //Only request new frame if animation is running
    if (doAnimation) requestAnimationFrame(render);
}



setupRobotArm = function() {
    // Create the model view matrix
    modelViewMatrix = mat4();
    modelViewMatrix = mult(modelViewMatrix, translate(0, -8.0, -50.0));
    modelViewMatrix = mult(modelViewMatrix, rotateY(baseRotation));
    modelViewMatrix = mult(modelViewMatrix, scalem(0.25 ,0.25,0.25))

    pushMatrix();
    drawJoint();

    // === LOWER ARM ===
    modelViewMatrix = mult(modelViewMatrix, translate(armTranslate));
    modelViewMatrix = mult(modelViewMatrix, rotateZ(lowerArmRotation[0]));
    drawArm();

    // === LOWER ARM JOINT ===
    modelViewMatrix = mult(modelViewMatrix, translate(jointTranslate));
    modelViewMatrix = mult(modelViewMatrix, rotateY(lowerArmRotation[1]));
    drawJoint();

    // === MIDDLE ARM ===
    modelViewMatrix = mult(modelViewMatrix, translate(armTranslate));
    modelViewMatrix = mult(modelViewMatrix, rotateZ(middleArmRotation[0]));
    drawArm();

    // === MIDDLE ARM JOINT ===
    modelViewMatrix = mult(modelViewMatrix, translate(jointTranslate));
    modelViewMatrix = mult(modelViewMatrix, rotateY(middleArmRotation[1]));
    drawJoint();

    // === UPPER ARM ===
    modelViewMatrix = mult(modelViewMatrix, translate(armTranslate));
    modelViewMatrix = mult(modelViewMatrix, rotateZ(upperArmRotation[0]));
    drawArm();

    // === UPPER ARM JOINT ===
    modelViewMatrix = mult(modelViewMatrix, translate(jointTranslate));
    modelViewMatrix = mult(modelViewMatrix, rotateY(upperArmRotation[1]));
    drawJoint();

    // === LEFT GRIPPER ===
    modelViewMatrix = mult(modelViewMatrix, translate(armTranslate));
    modelViewMatrix = mult(modelViewMatrix, scalem(-1,-1,-1));
    modelViewMatrix = mult(modelViewMatrix, rotateZ(gripperRotation));
    drawGripper();

    // === RIGHT GRIPPER ===
    modelViewMatrix = mult(modelViewMatrix, scalem(-1,1,1));
    // 2 times left gripper to balance the gripper purpose
    modelViewMatrix = mult(modelViewMatrix, rotateZ(gripperRotation*2));
    drawGripper();

    popMatrix();
}