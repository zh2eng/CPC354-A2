// One must imagine Sisyphus happy.
function animate() {
  const scaledSpeed = 0.25 * speed;
  switch (animSeq) {
    case 0:
      // Rotate to face the cube
      const baseRotationSign = Math.sign(baseRotation);
      if (Math.abs(baseRotation) <= speed) {
        baseRotation = 0;
        animSeq++;
      } else {
        baseRotation -= speed * baseRotationSign;
      }
      break;

    case 1:
      // Rotate upper joint into position
      const upperJointSign = Math.sign(upperJoint - upperArmRotation[0]);
      if (Math.abs(upperJoint - upperArmRotation[0]) <= speed) {
        upperArmRotation[0] = upperJoint;
        animSeq++;
      } else {
        upperArmRotation[0] += speed * upperJointSign;
      }
      break;

    case 2:
      // Rotate middle joint into position
      const middleJointSign = Math.sign(middleJoint - middleArmRotation[0]);
      if (Math.abs(middleJoint - middleArmRotation[0]) <= speed) {
        middleArmRotation[0] = middleJoint;
        animSeq++;
      }
      else {
        middleArmRotation[0] += speed * middleJointSign;
      }
      break;

    case 3:
      // Open grippers
      if (gripperRotation > -30 + 2 * scaledSpeed) {
        gripperRotation -= 2 * scaledSpeed;
      } else {
        gripperRotation = -30;
        animSeq++;
      }
      break;

    case 4:
      // Rotate lower joint into position
      const lowerJointSign = Math.sign(lowerJoint - lowerArmRotation[0]);
      if (Math.abs(lowerJoint - lowerArmRotation[0]) <= speed) {
        lowerArmRotation[0] = lowerJoint;
        animSeq++;
      } else {
        lowerArmRotation[0] += speed * lowerJointSign;
      }
      break;

    case 5:
      // Close grippers, mark cube as gripped
      if (gripperRotation > gripperPosition + speed) {
        gripperRotation -= speed;
      } else {
        gripperRotation = gripperPosition;
        isGripping = true;
        animSeq++;
      }
      break;

    case 6:
      // Lift cube to lift position
      if (lowerArmRotation[0] < lowerJoint + liftAngleLower - scaledSpeed) {
        lowerArmRotation[0] += scaledSpeed;
      } else {
        lowerArmRotation[0] = lowerJoint + liftAngleLower;
      }
      if (middleArmRotation[0] < middleJoint + liftAngleMiddle - scaledSpeed) {
        middleArmRotation[0] += scaledSpeed;
      } else {
        middleArmRotation[0] = middleJoint + liftAngleMiddle;
      }
      if (upperArmRotation[0] < upperJoint + liftAngleUpper - scaledSpeed) {
        upperArmRotation[0] += scaledSpeed;
      } else {
        upperArmRotation[0] = upperJoint + liftAngleUpper;
      }
      if (lowerArmRotation[0] === lowerJoint + liftAngleLower &&
        middleArmRotation[0] === middleJoint + liftAngleMiddle &&
        upperArmRotation[0] === upperJoint + liftAngleUpper) {
        animSeq++;
      }
      break;

    case 7:
      // Rotate to face drop-off location on the left side
      if (baseRotation > speed - 180) {
        baseRotation -= speed;
      } else {
        baseRotation = -180;
        animSeq++;
      }
      break;

    case 8:
      // Lower cube to drop-off position
      if (lowerArmRotation[0] > lowerJoint + scaledSpeed) {
        lowerArmRotation[0] -= scaledSpeed;
      } else {
        lowerArmRotation[0] = lowerJoint;
      }
      if (middleArmRotation[0] > middleJoint + scaledSpeed) {
        middleArmRotation[0] -= scaledSpeed;
      } else {
        middleArmRotation[0] = middleJoint;
      }
      if (upperArmRotation[0] > upperJoint + scaledSpeed) {
        upperArmRotation[0] -= scaledSpeed;
      } else {
        upperArmRotation[0] = upperJoint;
      }
      if (lowerArmRotation[0] === lowerJoint &&
        middleArmRotation[0] === middleJoint &&
        upperArmRotation[0] === upperJoint) {
        animSeq++;
      }
      break;

    case 9:
      // Open grippers, mark cube as released
      isGripping = false;
      cubePosition = [-14, -8, -50]; // Set cube to drop-off position
      if (gripperRotation > -30 + 2 * scaledSpeed) {
        gripperRotation -= 2 * scaledSpeed;
      } else {
        gripperRotation = -30;
        animSeq++;
      }
      break;

    case 10:
      // Lift lower arm away from cube and back to initial position
      const lowerArmSign = Math.sign(lowerArmRotationInit[0] - lowerArmRotation[0]);
      if (Math.abs(lowerArmRotationInit[0] - lowerArmRotation[0]) <= speed) {
        lowerArmRotation[0] = lowerArmRotationInit[0];
        animSeq++;
      } else {
        lowerArmRotation[0] += scaledSpeed * lowerArmSign;
      }
      break;

    case 11:
      // Return other arms and gripper to initial position
      const middleArmSign = Math.sign(middleArmRotationInit[0] - middleArmRotation[0]);
      const upperArmSign = Math.sign(upperArmRotationInit[0] - upperArmRotation[0]);
      const gripperSign = Math.sign(gripperRotationInit - gripperRotation);
      
      let allAtTarget = true;
      
      if (Math.abs(middleArmRotationInit[0] - middleArmRotation[0]) <= speed) {
        middleArmRotation[0] = middleArmRotationInit[0];
      } else {
        middleArmRotation[0] += speed * middleArmSign;
        allAtTarget = false;
      }
      if (Math.abs(upperArmRotationInit[0] - upperArmRotation[0]) <= speed) {
        upperArmRotation[0] = upperArmRotationInit[0];
      } else {
        upperArmRotation[0] += speed * upperArmSign;
        allAtTarget = false;
      }
      if (Math.abs(gripperRotationInit - gripperRotation) <= speed) {
        gripperRotation = gripperRotationInit;
      } else {
        gripperRotation += speed * gripperSign;
        allAtTarget = false;
      }
      if (allAtTarget) {
        animSeq++;
      }
      break;

    case 12:
      // Teleport cube back to initial position
      cubePosition = [...cubePositionInit];
      animSeq++;
      break;
    case 13:
      // Start again from sequence 0
      animSeq = 0;
    default: return;
  }
}


