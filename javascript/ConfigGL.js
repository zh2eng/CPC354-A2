
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
    worldSlider = document.getElementById('worldSlider');
    worldTextbox = document.getElementById('worldTextbox');
    gripperSlider = document.getElementById('gripperSlider');
    gripperTextbox = document.getElementById('gripperTextbox');
    for (let i = 0; i < 4; i++) {
        armRadio[i] = document.getElementById(armRadioLabels[i]);
    }
    jointSlider = document.getElementById('jointSlider');
    jointTextbox = document.getElementById('jointTextbox');
    armLabel = document.getElementById('armLabel');
    armSlider = document.getElementById('armSlider');
    armTextbox = document.getElementById('armTextbox');

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

    // Keydown event listener for arm control
    document.addEventListener('keydown', function(event) {
        if (event.code === 'Digit1') index = 0;
        else if (event.code === 'Digit2') index = 1;
        else if (event.code === 'Digit3') index = 2;
        else if (event.code === 'Digit4') index = 3;
        else if (event.code === 'KeyW') {
            armTextbox.value = parseFloat(armTextbox.value) - 1;
            armTextbox.dispatchEvent(new Event('input'));
        }
        else if (event.code === 'KeyA') {
            jointTextbox.value = parseFloat(jointTextbox.value) - 1;
            jointTextbox.dispatchEvent(new Event('input'));
        }
        else if (event.code === 'KeyS') {
            armTextbox.value = parseFloat(armTextbox.value) + 1;
            armTextbox.dispatchEvent(new Event('input'));
        }
        else if (event.code === 'KeyD') {
            jointTextbox.value = parseFloat(jointTextbox.value) + 1;
            jointTextbox.dispatchEvent(new Event('input'));
        }
        else if (event.code === 'KeyG') {
            gripperTextbox.value = parseFloat(gripperTextbox.value) + 1;
            gripperTextbox.dispatchEvent(new Event('input'));
        }
        else if (event.code === 'KeyR') {
            gripperTextbox.value = parseFloat(gripperTextbox.value) - 1;
            gripperTextbox.dispatchEvent(new Event('input'));
        }

        if ( index === 0 || index === 1 || index === 2 || index === 3 ){
            armRadio[index].checked = true;
            armRadio[index].dispatchEvent(new Event('change'));
        }

    })

    // Event listener for world Scale
    worldSlider.addEventListener('input', function () {
        worldTextbox.value = parseFloat(worldSlider.value);
        worldScale = parseFloat(worldSlider.value)/10;
        render();
    })

    worldTextbox.addEventListener('input', function () {
        worldSlider.value = parseFloat(worldTextbox.value);
        worldScale = parseFloat(worldSlider.value)/10;
        render();
    })

    // Event listener for gripper
    gripperSlider.addEventListener('input', function () {
        gripperTextbox.value = parseFloat(gripperSlider.value);
        gripperRotation = parseFloat(gripperSlider.value)-20;
        render();
    })

    gripperTextbox.addEventListener('input', function () {
        if (gripperTextbox.value >= 55) gripperTextbox.value = 55;
        else if (gripperTextbox.value <= 0) gripperTextbox.value = 0;
        gripperSlider.value = parseFloat(gripperTextbox.value);
        gripperRotation = parseFloat(gripperTextbox.value)-20;
        render();
    })

    // Event listener for the arm radio buttons
    for (let i = 0; i < armRadio.length; i++) {
        armRadio[i].addEventListener('change', function () {
            armLabel.style.display = i === 0 ? 'none' : 'block';
            if (armRadio[0].checked) {
                jointSlider.value = baseRotation;
                jointTextbox.value = baseRotation;
            }
            else if (armRadio[1].checked) {
                armSlider.value = lowerArmRotation[0];
                armTextbox.value = lowerArmRotation[0];
                jointSlider.value = lowerArmRotation[1];
                jointTextbox.value = lowerArmRotation[1];
            }
            else if (armRadio[2].checked) {
                armSlider.value = middleArmRotation[0];
                armTextbox.value = middleArmRotation[0];
                jointSlider.value = middleArmRotation[1];
                jointTextbox.value = middleArmRotation[1];
            }
            else if (armRadio[3].checked) {
                armSlider.value = upperArmRotation[0];
                armTextbox.value = upperArmRotation[0];
                jointSlider.value = upperArmRotation[1];
                jointTextbox.value = upperArmRotation[1];
            }
        });
    }

    // Event listener for the joint slider and textbox
    jointSlider.addEventListener('input', function () {
        jointTextbox.value = parseFloat(jointSlider.value);
        if (armRadio[0].checked) baseRotation = parseFloat(jointSlider.value);
        else if (armRadio[1].checked) lowerArmRotation[1] = parseFloat(jointSlider.value);
        else if (armRadio[2].checked) middleArmRotation[1] = parseFloat(jointSlider.value);
        else if (armRadio[3].checked) upperArmRotation[1] = parseFloat(jointSlider.value);
        render()
    })

    jointTextbox.addEventListener('input', function () {
        if (jointTextbox.value >= 180) jointTextbox.value = -180 + (jointTextbox.value % 180);
        else if (jointTextbox.value <= -180) jointTextbox.value = 180 - (jointTextbox.value % 180);
        jointSlider.value = parseFloat(jointTextbox.value);
        if (armRadio[0].checked)  baseRotation = parseFloat(jointTextbox.value);
        else if (armRadio[1].checked) lowerArmRotation[1] = parseFloat(jointTextbox.value);
        else if (armRadio[2].checked) middleArmRotation[1] = parseFloat(jointTextbox.value);
        else if (armRadio[3].checked) upperArmRotation[1] = parseFloat(jointTextbox.value);
        render()
    });

    // Event listener for the arm slider and text box
    armSlider.addEventListener('input', function () {
        armTextbox.value = parseFloat(armSlider.value);
        if (armRadio[1].checked) lowerArmRotation[0] = parseFloat(armSlider.value);
        else if (armRadio[2].checked) middleArmRotation[0] = parseFloat(armSlider.value);
        else if (armRadio[3].checked) upperArmRotation[0] = parseFloat(armSlider.value);
        render()
    })

    armTextbox.addEventListener('input', function () {
        if (armTextbox.value >= 110) armTextbox.value = 110;
        else if (armTextbox.value <= -110) armTextbox.value = -110;
        armSlider.value = parseFloat(armTextbox.value);
        if (armRadio[1].checked) lowerArmRotation[0] = parseFloat(armTextbox.value);
        else if (armRadio[2].checked) middleArmRotation[0] = parseFloat(armTextbox.value);
        else if (armRadio[3].checked) upperArmRotation[0] = parseFloat(armTextbox.value);
        render()
    })
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
    modelViewMatrix = mult(modelViewMatrix, translate(7, -5, -30));
    modelViewMatrix = mult(modelViewMatrix, rotateX(15));
    modelViewMatrix = mult(modelViewMatrix, rotateY(10));
    modelViewMatrix = mult(modelViewMatrix, scalem(worldScale, worldScale, worldScale));
    drawCube();

    //Only request new frame if animation is running
    if (doAnimation) requestAnimationFrame(render);
}



setupRobotArm = function() {
    // Create the model view matrix
    modelViewMatrix = mat4();
    modelViewMatrix = mult(modelViewMatrix, translate(0, -8.0, -50.0));
    modelViewMatrix = mult(modelViewMatrix, rotateY(baseRotation));
    modelViewMatrix = mult(modelViewMatrix, scalem(worldScale, worldScale, worldScale))

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
    modelViewMatrix = mult(modelViewMatrix, scalem(-1, 1, 1));
    // 2 times left gripper to balance the gripper purpose
    modelViewMatrix = mult(modelViewMatrix, rotateZ(gripperRotation*2));
    drawGripper();

    popMatrix();
}