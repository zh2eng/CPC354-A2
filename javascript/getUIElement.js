// Retrieve all elements from HTML and store in the corresponding variables
function getUIElement() {
    canvas = document.getElementById("gl-canvas");
    menus = document.getElementById("menus");
    toggleButton = document.getElementById('toggleButton');
    resetButton = document.getElementById('reset');
    worldSlider = document.getElementById('worldSlider');
    worldTextbox = document.getElementById('worldTextbox');
    gripperSlider = document.getElementById('gripperSlider');
    gripperTextbox = document.getElementById('gripperTextbox');
    speedSlider = document.getElementById('speedSlider');
    speedTextbox = document.getElementById('speedTextbox')
    for (let i = 0; i < 4; i++) {
        armRadio[i] = document.getElementById(armRadioLabels[i]);
    }
    jointSlider = document.getElementById('jointSlider');
    jointTextbox = document.getElementById('jointTextbox');
    armLabel = document.getElementById('armLabel');
    jointLabel = document.getElementById('jointLabel');
    armSlider = document.getElementById('armSlider');
    armTextbox = document.getElementById('armTextbox');
    liftAngleSettings = document.getElementById('liftAngleSettings');

    sliderAmbient = document.getElementById("sliderAmbient");
    textboxAmbient = document.getElementById("textboxAmbient");
    sliderLightX = document.getElementById("sliderLightX");
    textboxLightX = document.getElementById("textboxLightX");
    sliderLightY = document.getElementById("sliderLightY");
    textboxLightY = document.getElementById("textboxLightY");
    sliderLightZ = document.getElementById("sliderLightZ");
    textboxLightZ = document.getElementById("textboxLightZ");

    // Event listener for the start/stop button
    toggleButton.addEventListener('click', function () {
        doAnimation = !doAnimation;
        if (doAnimation) {
            toggleButton.innerHTML = '<span>&#9724;</span> Stop';
            toggleButton.className = 'base-btn stop-btn';
            menus.style.display = 'none';
            baseRotationStart = baseRotation;
            lowerArmRotationStart = lowerArmRotation;
            middleArmRotationStart = middleArmRotation;
            upperArmRotationStart = upperArmRotation;
            gripperRotationStart = gripperRotation;
            render();
        }
        else {
            toggleButton.innerHTML = '<span>&#9654;</span> Start';
            toggleButton.className = 'base-btn start-btn';
            menus.style.display = 'block';
        }
        render();
    });

    resetButton.addEventListener('click', function () {
        // Reset all variables to initial state
        isGripping = false;
        doAnimation = false;
        animSeq = 0;
        toggleButton.innerHTML = '<span>&#9654;</span> Start';
        toggleButton.className = 'base-btn start-btn';
        baseRotation = baseRotationDefault;
        lowerArmRotation = lowerArmRotationDefault;
        middleArmRotation = middleArmRotationDefault;
        upperArmRotation = upperArmRotationDefault;
        gripperRotation = gripperRotationDefault;
        speed = initialSpeed;
        worldScale = worldScaleInit;
        liftAngleLower = 30;
        liftAngleMiddle = 30;
        liftAngleUpper = 30;
        
        // Reset all UI elements to initial state
        worldSlider.value = worldScaleInit * 10;
        worldTextbox.value = worldScaleInit * 10;
        gripperSlider.value = gripperRotationDefault + 20;
        gripperTextbox.value = gripperRotationDefault + 20;
        speedSlider.value = initialSpeed;
        speedTextbox.value = initialSpeed;
        armRadio[0].checked = true;
        cubePosition = [...cubePositionInit];
        liftAngleLowerArmTextbox.value = 30;
        liftAngleLowerArmSlider.value = 30;
        liftAngleMiddleArmTextbox.value = 30;
        liftAngleMiddleArmSlider.value = 30;
        liftAngleUpperArmTextbox.value = 30;
        liftAngleUpperArmSlider.value = 30;
        
        sliderAmbient.value = 0.5;
        textboxAmbient.value = 0.5;
        sliderLightX.value = 0;
        textboxLightX.value = 0;
        sliderLightY.value = 100;
        textboxLightY.value = 100;
        sliderLightZ.value = 0;
        textboxLightZ.value = 0;
        lightAmbient = vec4(0.5, 0.5, 0.5, 1.0);
        lightPosition = vec4(0.0, 100.0, 0.0, 1.0);
        menus.style.display = 'block';

        render();
    });

    // Event listener for world Scale
    worldSlider.addEventListener('input', function () {
        worldTextbox.value = parseFloat(worldSlider.value);
        worldScale = parseFloat(worldSlider.value) / 10;
        render();
    })

    worldTextbox.addEventListener('input', function () {
        worldSlider.value = parseFloat(worldTextbox.value);
        worldScale = parseFloat(worldSlider.value) / 10;
        render();
    })

    // Event listener for gripper
    gripperSlider.addEventListener('input', function () {
        gripperTextbox.value = parseFloat(gripperSlider.value);
        gripperRotation = parseFloat(gripperSlider.value) - 20;
        render();
    })

    gripperTextbox.addEventListener('input', function () {
        if (gripperTextbox.value >= 55) gripperTextbox.value = 55;
        else if (gripperTextbox.value <= 0) gripperTextbox.value = 0;
        gripperSlider.value = parseFloat(gripperTextbox.value);
        gripperRotation = parseFloat(gripperTextbox.value) - 20;
        render();
    })

    // Event listener for speed
    speedSlider.addEventListener('input', function () {
        speedTextbox.value = parseFloat(speedSlider.value);
        speed = parseFloat(speedSlider.value);
    })

    speedTextbox.addEventListener('input', function () {
        speedSlider.value = parseFloat(speedTextbox.value);
        speed = parseFloat(speedSlider.value);
    })

    // Event listener for the arm radio buttons
    for (let i = 0; i < armRadio.length; i++) {
        armRadio[i].addEventListener('change', function () {
            armLabel.style.display = i === 0 ? 'none' : 'block';
            jointLabel.style.display = i === 0 ? 'block' : 'none';

            if (armRadio[0].checked) {
                jointSlider.value = baseRotation;
                jointTextbox.value = baseRotation;
            }
            else if (armRadio[1].checked) {
                armSlider.value = lowerArmRotation;
                armTextbox.value = lowerArmRotation;
            }
            else if (armRadio[2].checked) {
                armSlider.value = middleArmRotation;
                armTextbox.value = middleArmRotation;
            }
            else if (armRadio[3].checked) {
                armSlider.value = upperArmRotation;
                armTextbox.value = upperArmRotation;
            }
        });
    }

    // Event listener for the joint slider and textbox
    jointSlider.addEventListener('input', function () {
        jointTextbox.value = parseFloat(jointSlider.value);
        if (armRadio[0].checked) baseRotation = parseFloat(jointSlider.value);
        render()
    })

    jointTextbox.addEventListener('input', function () {
        if (jointTextbox.value >= 180) jointTextbox.value = -180 + (jointTextbox.value % 180);
        else if (jointTextbox.value <= -180) jointTextbox.value = 180 - (jointTextbox.value % 180);
        jointSlider.value = parseFloat(jointTextbox.value);
        if (armRadio[0].checked) baseRotation = parseFloat(jointTextbox.value);
        render()
    });

    // Event listener for the arm slider and text box
    armSlider.addEventListener('input', function () {
        armTextbox.value = parseFloat(armSlider.value);
        if (armRadio[1].checked) lowerArmRotation = parseFloat(armSlider.value);
        else if (armRadio[2].checked) middleArmRotation = parseFloat(armSlider.value);
        else if (armRadio[3].checked) upperArmRotation = parseFloat(armSlider.value);
        render()
    })

    armTextbox.addEventListener('input', function () {
        if (armTextbox.value >= 110) armTextbox.value = 110;
        else if (armTextbox.value <= -110) armTextbox.value = -110;
        armSlider.value = parseFloat(armTextbox.value);
        if (armRadio[1].checked) lowerArmRotation = parseFloat(armTextbox.value);
        else if (armRadio[2].checked) middleArmRotation = parseFloat(armTextbox.value);
        else if (armRadio[3].checked) upperArmRotation = parseFloat(armTextbox.value);
        render()
    })

    // Event listener for lift angle settings
    liftAngleSettings.addEventListener('change', (event) => {
        const value = parseInt(event.target.value);
        const id = event.target.id;
        if (id === 'liftAngleLowerArmSlider') {
            liftAngleLower = value;
            liftAngleLowerArmTextbox.value = value;
        } else if (id === 'liftAngleMiddleArmSlider') {
            liftAngleMiddle = value;
            liftAngleMiddleArmTextbox.value = value;
        } else if (id === 'liftAngleUpperArmSlider') {
            liftAngleUpper = value;
            liftAngleUpperArmTextbox.value = value;
        }
    });

    // Event listener for ligtning settings
    // ambient
    sliderAmbient.addEventListener('input', function() {
        var val = parseFloat(sliderAmbient.value);
        textboxAmbient.value = val;
        lightAmbient = vec4(val, val, val, 1.0); 
        render();
    });
    textboxAmbient.addEventListener('input', function() {
        var val = parseFloat(textboxAmbient.value);
        sliderAmbient.value = val;
        lightAmbient = vec4(val, val, val, 1.0);
        render();
    });
    //light X
    sliderLightX.addEventListener('input', function() {
        var val = parseFloat(sliderLightX.value);
        textboxLightX.value = val;
        lightPosition[0] = val; 
        render();
    });
    textboxLightX.addEventListener('input', function() {
        var val = parseFloat(textboxLightX.value);
        sliderLightX.value = val;
        lightPosition[0] = val;
        render();
    });
    //light Y
    sliderLightY.addEventListener('input', function() {
        var val = parseFloat(sliderLightY.value);
        textboxLightY.value = val;
        lightPosition[1] = val; 
        render();
    });
    textboxLightY.addEventListener('input', function() {
        var val = parseFloat(textboxLightY.value);
        sliderLightY.value = val;
        lightPosition[1] = val;
        render();
    });
    //light Z
    sliderLightZ.addEventListener('input', function() {
        var val = parseFloat(sliderLightZ.value);
        textboxLightZ.value = val;
        lightPosition[2] = val; 
        render();
    });
    textboxLightZ.addEventListener('input', function() {
        var val = parseFloat(textboxLightZ.value);
        sliderLightZ.value = val;
        lightPosition[2] = val;
        render();
    });

    // Key event listeners for setting arm rotations
    document.addEventListener('keydown', function (event) {
        const key = event.key.toLowerCase();
        switch(key){
            case 'r':
                // Start or stop animation
                toggleButton.click();
                break;
            case 'e':
                // Reset the arm to initial state
                resetButton.click();
                break;
            case 'a':
                // move lower arm left
                armRadio[1].checked = true;
                armLabel.style.display = 'block';
                jointLabel.style.display = 'none';
                lowerArmRotation -= 1;
                armSlider.value = lowerArmRotation;
                armTextbox.value = lowerArmRotation;
                break;
            case 's':
                // move lower arm right
                armRadio[1].checked = true;
                lowerArmRotation += 1;
                armLabel.style.display = 'block';
                jointLabel.style.display = 'none';
                armSlider.value = lowerArmRotation;
                armTextbox.value = lowerArmRotation;
                break;
            case 'd':
                // move middle arm left
                armRadio[2].checked = true;
                armLabel.style.display = 'block';
                jointLabel.style.display = 'none';
                middleArmRotation -= 1;
                armSlider.value = middleArmRotation;
                armTextbox.value = middleArmRotation;
                break;
            case 'f':
                // move middle arm right
                armRadio[2].checked = true;
                armLabel.style.display = 'block';
                jointLabel.style.display = 'none';
                middleArmRotation += 1;
                armSlider.value = middleArmRotation;
                armTextbox.value = middleArmRotation;
                break;
            case 'q':
                // move upper arm left
                armRadio[3].checked = true;
                armLabel.style.display = 'block';
                jointLabel.style.display = 'none';
                upperArmRotation -= 1;
                armSlider.value = upperArmRotation;
                armTextbox.value = upperArmRotation;
                break;
            case 'w':
                // move upper arm right
                armRadio[3].checked = true;
                armLabel.style.display = 'block';
                jointLabel.style.display = 'none';
                upperArmRotation += 1;
                armSlider.value = upperArmRotation;
                armTextbox.value = upperArmRotation;
                break;
            }
        render();
    });
}