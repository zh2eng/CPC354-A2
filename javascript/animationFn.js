// One must imagine Sisyphus happy.
function animate() {
  const scaledSpeed = 0.25 * speed;
  switch (animSeq) {
    case 0:
      // Rotate all joints into position and open the gripper
      const upperJointSign = Math.sign(upperJoint - upperArmRotation[0]);
      const middleJointSign = Math.sign(middleJoint - middleArmRotation[0]);
      const lowerJointSign = Math.sign(lowerJoint - lowerArmRotation[0]);
      let hasReachedPosition = [false, false, false, false, false];

      // Upper arm rotation
      if (Math.abs(upperJoint - upperArmRotation[0]) <= scaledSpeed) {
        upperArmRotation[0] = upperJoint;
        hasReachedPosition[0] = true;
      } else {
        upperArmRotation[0] += scaledSpeed * upperJointSign * 3.5;
      }

      // Middle arm rotation
      if (Math.abs(middleJoint - middleArmRotation[0]) <= scaledSpeed) {
        middleArmRotation[0] = middleJoint;
        hasReachedPosition[1] = true;
      }
      else {
        middleArmRotation[0] += scaledSpeed * middleJointSign * 1.3;
      }

      // Lower arm rotation
      if (Math.abs(lowerJoint - lowerArmRotation[0]) <= scaledSpeed) {
        lowerArmRotation[0] = lowerJoint;
        hasReachedPosition[2] = true;
      } else {
        lowerArmRotation[0] += scaledSpeed * lowerJointSign;
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
      const lowerArmSign = Math.sign(lowerArmRotationStart[0] - lowerArmRotation[0]);
      const middleArmSign = Math.sign(middleArmRotationStart[0] - middleArmRotation[0]);
      const upperArmSign = Math.sign(upperArmRotationStart[0] - upperArmRotation[0]);
      const gripperSign = Math.sign(gripperRotationStart - gripperRotation);
      let hasReturnedToOrigin = [false, false, false, false, false];

      if (Math.abs(lowerArmRotationStart[0] - lowerArmRotation[0]) <= speed) {
        lowerArmRotation[0] = lowerArmRotationStart[0];
        hasReturnedToOrigin[0] = true;
      } else {
        lowerArmRotation[0] += scaledSpeed * lowerArmSign * 0.8;
      }

      if (Math.abs(middleArmRotationStart[0] - middleArmRotation[0]) <= speed) {
        middleArmRotation[0] = middleArmRotationStart[0];
        hasReturnedToOrigin[1] = true;
      } else {
        middleArmRotation[0] += speed * middleArmSign;
      }
      if (Math.abs(upperArmRotationStart[0] - upperArmRotation[0]) <= speed) {
        upperArmRotation[0] = upperArmRotationStart[0];
        hasReturnedToOrigin[2] = true;
      } else {
        upperArmRotation[0] += speed * upperArmSign;
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


