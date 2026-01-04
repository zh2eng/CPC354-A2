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

      // Rotate back to initial base rotation (0 degrees)
      if (Math.abs(baseRotation) <= speed) {
        baseRotation = 0;
        hasReachedPosition[4] = true;
      } else {
        baseRotation -= Math.sign(baseRotation) * speed;
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
        animSeq++;
      }
      break;

    case 3:
      // Rotate to face drop-off location on the left side (-180 degrees)
      if (baseRotation > speed - 180) {
        baseRotation -= speed;
      } else {
        baseRotation = -180;
        animSeq++;
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

    case 6:
      // Lift all arms away from cube and back to initial position
      const lowerArmSign = Math.sign(lowerArmRotationStart - lowerArmRotation);
      const middleArmSign = Math.sign(middleArmRotationStart - middleArmRotation);
      const upperArmSign = Math.sign(upperArmRotationStart - upperArmRotation);
      const gripperSign = Math.sign(gripperRotationStart - gripperRotation);
      let hasReturnedToOrigin = [false, false, false, false, false];

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
      // Rotate back to initial base rotation (0 degrees)
      if (Math.abs(baseRotation) <= speed) {
        baseRotation = 0;
        hasReturnedToOrigin[4] = true;
      } else {
        baseRotation -= Math.sign(baseRotation) * speed;
      }
      if (hasReturnedToOrigin.every(Boolean)) {
        animSeq++;
      }
      break;

    case 7:
      // Teleport cube back to initial position
      cubePosition = [...cubePositionInit];
      animSeq++;
      break;
    case 8:
      // Start again from sequence 0
      animSeq = 0;
    default: return;
  }
}


