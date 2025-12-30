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
    positionLabel = document.getElementById('positionLabel');
    for (let i = 0; i < 3; i++) {
        positionRadio[i] = document.getElementById(positionRadioLabels[i]);
    }
    positionSlider = document.getElementById('positionSlider');
    positionTextbox = document.getElementById('positionTextbox');

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

        if ( index === 0 ){
            if (event.code === 'KeyX') indexP = 0;
            else if (event.code === 'KeyY') indexP = 1;
            else if (event.code === 'KeyZ') indexP = 2;
            else if (event.code === 'KeyW') {
                positionTextbox.value = parseFloat(positionTextbox.value) + 1;
                positionTextbox.dispatchEvent(new Event('input'));
            }
            else if (event.code === 'KeyS') {
                positionTextbox.value = parseFloat(positionTextbox.value) - 1;
                positionTextbox.dispatchEvent(new Event('input'));
            }

            if ( indexP === 0 || indexP === 1 || indexP === 2 ){
                positionRadio[indexP].checked = true;
                positionRadio[indexP].dispatchEvent(new Event('change'));
            }
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
            positionLabel.style.display = i === 0 ? 'block' : 'none';

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

    // Event listener for robot position radio
    for (let i = 0; i < positionRadio.length; i++){
        positionRadio[i].addEventListener('change', function () {
            if (positionRadio[i].checked){
                positionSlider.value = robotPosition[i];
                positionTextbox.value = robotPosition[i];
            }
        })
    }

    // Event listener for robot position slider and textbox
    positionSlider.addEventListener('input', function() {
        positionTextbox.value = parseFloat(positionSlider.value);
        for (let i = 0; i < positionRadio.length; i++){
            if (positionRadio[i].checked) robotPosition[i] = parseFloat(positionSlider.value);
        }
        render();
    })

    positionTextbox.addEventListener('input', function () {
        if (positionTextbox.value >= 50 ) positionTextbox.value = 50;
        else if(positionTextbox.value <=-50) positionTextbox.value = -50;
        positionSlider.value = parseFloat(positionTextbox.value);
        for (let i = 0; i < positionRadio.length; i++){
            if (positionRadio[i].checked) robotPosition[i] = parseFloat(positionTextbox.value);
        }
        render();
    })
}