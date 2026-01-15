// One must imagine Sisyphus happy.
function animate() {
  const scaledSpeed = 0.25 * speed;
  switch (animSeq) {
    case 0:
      // Rotate all joints into position and open the gripper
      const upperJointSign = Math.sign(upperJoint - upperArmRotation);
      const middleJointSign = Math.sign(middleJoint - middleArmRotation);
      const lowerJointSign = Math.sign(lowerJoint - lowerArmRotation);
      let hasReachedPosition = [false, false, false, false, false];
      
      // Upper arm rotation
      if (Math.abs(upperJoint - upperArmRotation) <= scaledSpeed) {
        upperArmRotation = upperJoint;
        hasReachedPosition[0] = true;
      } else {
        upperArmRotation += scaledSpeed * upperJointSign * 3.5;
      }
      
      // Middle arm rotation
      if (Math.abs(middleJoint - middleArmRotation) <= scaledSpeed) {
        middleArmRotation = middleJoint;
        hasReachedPosition[1] = true;
      }
      else {
        middleArmRotation += scaledSpeed * middleJointSign * 1.3;
      }
      
      // Lower arm rotation
      if (Math.abs(lowerJoint - lowerArmRotation) <= scaledSpeed) {
        lowerArmRotation = lowerJoint;
        hasReachedPosition[2] = true;
      } else {
        lowerArmRotation += scaledSpeed * lowerJointSign;
      }
      
      // Gripper opening
      if (gripperRotation > -30 + 2 * scaledSpeed) {
        gripperRotation -= 6 * scaledSpeed;
      } else {
        gripperRotation = -30;
        hasReachedPosition[3] = true;
      }
      
      // Rotate to face cube
      cubeAngle = cubeDestinations[cubeAtIdx];
      if (Math.abs(cubeAngle - baseRotation) <= speed) {
        baseRotation = cubeAngle;
        hasReachedPosition[4] = true;
      } else {
        baseRotation -= speed * Math.sign(baseRotation - cubeAngle);
      }

      // When all parts are in position, move to next sequence
      if (hasReachedPosition.every(Boolean)) {
        animSeq++;
      }
      break;

    case 1:
      // Close grippers, mark cube as gripped
      if (gripperRotation > gripperPosition + speed) {
        gripperRotation -= speed;
      } else {
        gripperRotation = gripperPosition;
        isGripping = true;
        cubeAtIdx = (cubeAtIdx + 1) % cubeDestinations.length; // Update to next cube position
        animSeq++;
      }
      break;

    case 2:
      // Lift cube to lift position
      if (lowerArmRotation < lowerJoint + liftAngleLower - scaledSpeed) {
        lowerArmRotation += scaledSpeed;
      } else {
        lowerArmRotation = lowerJoint + liftAngleLower;
      }
      if (middleArmRotation < middleJoint + liftAngleMiddle - scaledSpeed) {
        middleArmRotation += scaledSpeed;
      } else {
        middleArmRotation = middleJoint + liftAngleMiddle;
      }
      if (upperArmRotation < upperJoint + liftAngleUpper - scaledSpeed) {
        upperArmRotation += scaledSpeed;
      } else {
        upperArmRotation = upperJoint + liftAngleUpper;
      }
      if (lowerArmRotation === lowerJoint + liftAngleLower &&
        middleArmRotation === middleJoint + liftAngleMiddle &&
        upperArmRotation === upperJoint + liftAngleUpper) {
        cubeAngle = -180
        animSeq++;
      }
      break;

    case 3:
      // Rotate to face drop-off location on the other side
      cubeAngle = cubeDestinations[cubeAtIdx] === 0 ? -360 : cubeDestinations[cubeAtIdx];
      if (Math.abs(cubeAngle - baseRotation) <= speed) {
        baseRotation = cubeAngle === -360 ? 0 : cubeAngle;
        animSeq++;
      } else {
        baseRotation -= speed * Math.sign(baseRotation - cubeAngle);
      }

      break;

    case 4:
      // Lower cube to drop-off position
      if (lowerArmRotation > lowerJoint + scaledSpeed) {
        lowerArmRotation -= scaledSpeed;
      } else {
        lowerArmRotation = lowerJoint;
      }
      if (middleArmRotation > middleJoint + scaledSpeed) {
        middleArmRotation -= scaledSpeed;
      } else {
        middleArmRotation = middleJoint;
      }
      if (upperArmRotation > upperJoint + scaledSpeed) {
        upperArmRotation -= scaledSpeed;
      } else {
        upperArmRotation = upperJoint;
      }
      if (lowerArmRotation === lowerJoint &&
        middleArmRotation === middleJoint &&
        upperArmRotation === upperJoint) {
        animSeq++;
      }
      break;
    
    case 5:
      // Minor case: for setting isGripping, cubeAngle and cubePosition
      isGripping = false;
      updateCubePosition();
      animSeq++;
      break;

    case 6:
      // Open grippers, mark cube as released
      if (gripperRotation > -30 + 2 * scaledSpeed) {
        gripperRotation -= 2 * scaledSpeed;
      } else {
        gripperRotation = -30;
        animSeq++;
      }
      break;

    case 7:
      // Lift all arms away from cube and back to initial position
      const lowerArmSign = Math.sign(lowerArmRotationStart - lowerArmRotation);
      const middleArmSign = Math.sign(middleArmRotationStart - middleArmRotation);
      const upperArmSign = Math.sign(upperArmRotationStart - upperArmRotation);
      const gripperSign = Math.sign(gripperRotationStart - gripperRotation);
      let hasReturnedToOrigin = [false, false, false, false];

      if (Math.abs(lowerArmRotationStart - lowerArmRotation) <= speed) {
        lowerArmRotation = lowerArmRotationStart;
        hasReturnedToOrigin[0] = true;
      } else {
        lowerArmRotation += scaledSpeed * lowerArmSign * 0.8;
      }

      if (Math.abs(middleArmRotationStart - middleArmRotation) <= speed) {
        middleArmRotation = middleArmRotationStart;
        hasReturnedToOrigin[1] = true;
      } else {
        middleArmRotation += speed * middleArmSign;
      }
      if (Math.abs(upperArmRotationStart - upperArmRotation) <= speed) {
        upperArmRotation = upperArmRotationStart;
        hasReturnedToOrigin[2] = true;
      } else {
        upperArmRotation += speed * upperArmSign;
      }
      if (Math.abs(gripperRotationStart - gripperRotation) <= speed) {
        gripperRotation = gripperRotationStart;
        hasReturnedToOrigin[3] = true;
      } else {
        gripperRotation += speed * gripperSign * 2;
      }
      if (hasReturnedToOrigin.every(Boolean)) {
        animSeq++;
      }
      break;

    case 8:
      // Short pause at the end of the animation
      timeoutHolder = !timeoutHolder && setTimeout(() => {
        // Reset to sequence 0 to allow re-running the animation
        animSeq = 0;
        timeoutHolder = null;
      }, 500);
      break;

    default: return;
  }
}

function updateCubePosition() {
  const angleRad = cubeDestinations[cubeAtIdx] * (Math.PI / 180);


  const centerX = robotPosition[0];
  const centerZ = robotPosition[2];
  const radius = cubePositionInit[0] - centerX; // initial distance from robot to cube

  // Apply the rotation formula
  // x = cx + r * cos(theta)
  // z = cz - r * sin(theta)
  const newX = centerX + radius * Math.cos(angleRad);
  const newZ = centerZ - radius * Math.sin(angleRad);

  // 4. Update the actual position array
  cubePosition[0] = newX;
  cubePosition[2] = newZ;
}

// function animateCubeFalling() {
//   if (cubePosition[1] > -8 && !isGripping) {
//     cubePosition[1] -= 0.5 * speed;
//   }
// }

// function gripCubeOutOfAnimation(){
//   // angle = tan-1((z2-z1)/(x2-x1))
//   if(gripperRotation < gripperPosition - 2){
//     isGripping = false;
//     cubePosition[0] = robotPosition[0] + 14 * Math.cos(-baseRotation * (Math.PI / 180));
//     cubePosition[2] = robotPosition[2] - 14 * Math.sin(-baseRotation * (Math.PI / 180));
//     return;
//   }
//   const cubeAngle = -1 * Math.atan2(cubePosition[2] - robotPosition[2], cubePosition[0] - robotPosition[0])
//   * (180 / Math.PI);
//   const tolerance = 20;
//   if(Math.abs(cubeAngle - baseRotation) < 5 &&
//     Math.abs(lowerArmRotation - lowerJoint) < tolerance &&
//     Math.abs(middleArmRotation - middleJoint) < tolerance &&
//     Math.abs(upperArmRotation - upperJoint) < tolerance){
//       isGripping = true;
//   }
//   // Alternate arrangement
//   if(Math.abs(cubeAngle - baseRotation) < 5 &&
//     Math.abs(lowerArmRotation) < tolerance && 
//     Math.abs(middleArmRotation - (-90)) < tolerance &&
//     upperArmRotation <= -45 &&
//     upperArmRotation >= (-45 - tolerance)
//   ){
//     isGripping = true;
//   }
// }