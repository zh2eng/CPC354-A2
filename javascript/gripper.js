var gripper = [
    // Front
    vec4(1, -1, -1.5, 1),
    vec4(1, 2, -1.5, 1),
    vec4(-10, 2, -1.5, 1),
    vec4(-8, -10, -1, 1),
    vec4(-7, -10, -1, 1),
    vec4(-7, -1, -1.5, 1),

    // Back
    vec4(1, -1, 1.5, 1),
    vec4(1, 2, 1.5, 1),
    vec4(-10, 2, 1.5, 1),
    vec4(-8, -10, 1, 1),
    vec4(-7, -10, 1, 1),
    vec4(-7, -1, 1.5, 1),
];

setupGripper = function() {
    gripperStart = points.length;

    // Front
    quadrilateral([0,1,2,5], 0, gripper);
    quadrilateral([5,2,3,4], 0, gripper);

    // Back
    quadrilateral([6,7,8,11], 0, gripper);
    triangle([11,8,9,10], 0, gripper);

    // Side
    quadrilateral([0,6,7,1], 2, gripper);
    quadrilateral([1,7,8,2], 2, gripper);
    quadrilateral([2,8,9,3], 2, gripper);
    quadrilateral([3,9,10,4], 2, gripper);
    quadrilateral([4,10,11,5], 2, gripper);
    quadrilateral([5,11,6,0], 2, gripper);

    gripperCount = points.length - gripperStart;

}

