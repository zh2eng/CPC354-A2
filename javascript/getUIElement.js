// Retrieve all elements from HTML and store in the corresponding variables
function getUIElement() {
	canvas = document.getElementById("gl-canvas");
	menus = document.getElementById("menus");
	toggleButton = document.getElementById('toggleButton');
	resetButton = document.getElementById('reset');
	// worldSlider = document.getElementById('worldSlider');
	// worldTextbox = document.getElementById('worldTextbox');
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
	dropofflocations = document.getElementById('dropofflocations');
	grippedNotif = document.getElementById('gripped_notif');

	pointLightRadio = document.getElementById("pointLight");
	directionalLightRadio = document.getElementById("directionalLight");
  sliderAmbient = document.getElementById("sliderAmbient");
  textboxAmbient = document.getElementById("textboxAmbient");
  sliderLightX = document.getElementById("sliderLightX");
  textboxLightX = document.getElementById("textboxLightX");
  sliderLightY = document.getElementById("sliderLightY");
  textboxLightY = document.getElementById("textboxLightY");
  sliderLightZ = document.getElementById("sliderLightZ");
  textboxLightZ = document.getElementById("textboxLightZ");    

	// Event listener for the start/stop button
	toggleButton.addEventListener('click', startAnimation);
	resetButton.addEventListener('click', resetAnimation);

	// Event listener for world Scale
	// worldSlider.addEventListener('input', function () {
	// 	worldTextbox.value = parseFloat(worldSlider.value);
	// 	worldScale = parseFloat(worldSlider.value) / 10;
	// 	render();
	// })

	// worldTextbox.addEventListener('input', function () {
	// 	worldSlider.value = parseFloat(worldTextbox.value);
	// 	worldScale = parseFloat(worldSlider.value) / 10;
	// 	render();
	// })

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
	// Drop off location selector
	dropofflocations.addEventListener('change', function (event) {
		const selected = event.target.id;
		let checked;
		switch (selected) {
			case 'leftDropoff':
				checked = leftDropoff.checked;
				if (checked)
					cubeDestinations.push(-180);
				else
					cubeDestinations = cubeDestinations.filter(angle => angle !== -180);
				break;
			case 'frontDropoff':
				checked = frontDropoff.checked;
				if (checked)
					cubeDestinations.push(-90);
				else
					cubeDestinations = cubeDestinations.filter(angle => angle !== -90);
				break;
			case 'backDropoff':
				checked = backDropoff.checked;
				if (checked)
					cubeDestinations.push(-270);
				else
					cubeDestinations = cubeDestinations.filter(angle => angle !== -270);
				break;
		}
	});
	
	//helper for lightning
	function resetLighttoDefault(isPoint){
		lightPosition = vec4(53.0, 39.0, -10.0, isPoint ? 1.0 : 0.0);
		lightAmbient = vec4(1.0, 1.0, 1.0, 1.0);
		sliderLightX.value = 53;   
		textboxLightX.value = 53;
    sliderLightY.value = 39; 
		textboxLightY.value = 39;
    sliderLightZ.value = -10;   
		textboxLightZ.value = -10;
    sliderAmbient.value = 1.3;  
		textboxAmbient.value = 1.3;
		render();
	}
  // Event listener for ligtning settings
	pointLightRadio.addEventListener('change', function(){
		if(pointLightRadio.checked){
			resetLighttoDefault(true);
		}
	});

	directionalLightRadio.addEventListener('change', function(){
		if(directionalLightRadio.checked){
			resetLighttoDefault(false);
		}
	});

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
		switch (key) {
			case '1':
				// move lower arm left
				armRadio[1].checked = true;
				armLabel.style.display = 'block';
				jointLabel.style.display = 'none';
				if(lowerArmRotation < 110)
					lowerArmRotation += 1;
				armSlider.value = lowerArmRotation;
				armTextbox.value = lowerArmRotation;
				break;
			case '2':
				// move lower arm right
				armRadio[1].checked = true;
				if(lowerArmRotation > -110)
					lowerArmRotation -= 1;
				armLabel.style.display = 'block';
				jointLabel.style.display = 'none';
				armSlider.value = lowerArmRotation;
				armTextbox.value = lowerArmRotation;
				break;
			case '4':
				// move middle arm left
				armRadio[2].checked = true;
				armLabel.style.display = 'block';
				jointLabel.style.display = 'none';
				if(middleArmRotation < 110)
					middleArmRotation += 1;
				armSlider.value = middleArmRotation;
				armTextbox.value = middleArmRotation;
				break;
			case '5':
				// move middle arm right
				armRadio[2].checked = true;
				armLabel.style.display = 'block';
				jointLabel.style.display = 'none';
				if(middleArmRotation > -110)
					middleArmRotation -= 1;
				armSlider.value = middleArmRotation;
				armTextbox.value = middleArmRotation;
				break;
			case '7':
				// move upper arm left
				armRadio[3].checked = true;
				armLabel.style.display = 'block';
				jointLabel.style.display = 'none';
				if(upperArmRotation < 110)
					upperArmRotation += 1;
				armSlider.value = upperArmRotation;
				armTextbox.value = upperArmRotation;
				break;
			case '8':
				// move upper arm right
				armRadio[3].checked = true;
				armLabel.style.display = 'block';
				jointLabel.style.display = 'none';
				if(upperArmRotation > -110)
					upperArmRotation -= 1;
				armSlider.value = upperArmRotation;
				armTextbox.value = upperArmRotation;
				break;
			case '9':
				// close gripper
				if(gripperRotation < 35)
					gripperRotation += 1;
				gripperSlider.value = gripperRotation + 20;
				gripperTextbox.value = gripperRotation + 20;
				break;
			case '6':
				// open gripper
				if(gripperRotation > 0)
					gripperRotation -= 1;
				gripperSlider.value = gripperRotation + 20;
				gripperTextbox.value = gripperRotation + 20;
				break;
		}
		render();
	});
}

function startAnimation() {
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
	}
	else {
		cancelAnimationFrame(animFrame); // Cancel pending animation frame
		toggleButton.innerHTML = '<span>&#9654;</span> Start';
		toggleButton.className = 'base-btn start-btn';
		menus.style.display = 'block';
	}
	render();
}

function resetAnimation() {
	// Reset all variables to initial state
	doAnimation = false;
	cancelAnimationFrame(animFrame); // Cancel any pending animation frame
	isGripping = false;
	cubeAtIdx = 0;
	cubeDestinations = [...cubeDestinationsInit];
	animSeq = 0;
	toggleButton.innerHTML = '<span>&#9654;</span> Start';
	toggleButton.className = 'base-btn start-btn';
	baseRotation = baseRotationDefault;
	lowerArmRotation = lowerArmRotationDefault;
	middleArmRotation = middleArmRotationDefault;
	upperArmRotation = upperArmRotationDefault;
	gripperRotation = gripperRotationDefault;
	document.getElementById('leftDropoff').checked = true;
	document.getElementById('frontDropoff').checked = true;
	document.getElementById('backDropoff').checked = true;
	speed = initialSpeed;
	worldScale = worldScaleInit;
	
	// Reset all UI elements to initial state
	// worldSlider.value = worldScaleInit * 10;
	// worldTextbox.value = worldScaleInit * 10;
	gripperSlider.value = gripperRotationDefault + 20;
	gripperTextbox.value = gripperRotationDefault + 20;
	speedSlider.value = initialSpeed;
	speedTextbox.value = initialSpeed;
	armRadio[0].checked = true;
	cubePosition = [...cubePositionInit];
	jointSlider.value = baseRotationDefault;
	jointTextbox.value = baseRotationDefault;

  sliderAmbient.value = 1.3;
  textboxAmbient.value = 1.3;
  sliderLightX.value = 53;
  textboxLightX.value = 53;
  sliderLightY.value = 39;
  textboxLightY.value = 39;
  sliderLightZ.value = -10;
  textboxLightZ.value = -10;
	lightAmbient = vec4(1.0, 1.0, 1.0, 1.0);
  lightPosition = vec4(53.0, 39.0, -10.0, 1.0);
	document.getElementById("pointLight").checked = true;
	menus.style.display = 'block';

	render();
}

