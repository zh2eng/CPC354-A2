var arm = [];
var joint = [];

var radius = 2.5;
var armSegments = 30;
var jointSegments = armSegments/2;
const z_value = 1.5;

joint.push(vec4(-2.5, 0, -z_value, 1));
joint.push(vec4(2.5, 0, -z_value, 1));
joint.push(vec4(2.5, 2.5, -z_value, 1));
joint.push(vec4(-2.5, 2.5, -z_value, 1));
joint.push(vec4(0, 0, -z_value, 1));

for (let i = 0; i <= jointSegments; i++) {
    let angle = (i * Math.PI) / jointSegments;  
    let x = radius * Math.cos(angle);
    let y = radius * Math.sin(angle);
    joint.push(vec4(x, -y, -z_value, 1)); 
}

joint.push(vec4(-2.5, 0, z_value, 1));
joint.push(vec4(2.5, 0, z_value, 1));
joint.push(vec4(2.5, 2.5, z_value, 1));
joint.push(vec4(-2.5, 2.5, z_value, 1));
joint.push(vec4(0, 0, z_value, 1));

for (let i = 0; i <= jointSegments; i++) {
    let angle = (i * Math.PI) / jointSegments;  
    let x = radius * Math.cos(angle);
    let y = radius * Math.sin(angle);
    joint.push(vec4(x, -y, z_value, 1)); 
}



radius = 3.0;
arm.push(vec4(0, 20, 0, 1))
for(let i = 0; i <= armSegments; i++){
    let angle = (i * 2 * Math.PI) / armSegments;  
    let x = radius * Math.cos(angle);
    let z = radius * Math.sin(angle);
    arm.push(vec4(x, 20, z, 1)); 
}

arm.push(vec4(0, 2.5, 0, 1))
for(let i = 0; i <= armSegments; i++){
    let angle = (i * 2 * Math.PI) / armSegments;  
    let x = radius * Math.cos(angle);
    let z = radius * Math.sin(angle);
    arm.push(vec4(x, 2.5, z, 1)); 
}


for (let i = 0; i < joint.length; i++){
    arm.push(joint[i])
}


setupArm = function () {
    armStart = points.length;
    //Arm
    for(let i = armSegments+1; i > 0; i-- ){
        triangle([i, i-1, 0], 3, arm)
    }
    for(let i = 2*armSegments+3; i > armSegments+3; i-- ){
        triangle([i, i-1, armSegments+2], 3, arm)
    }
    for(let i = armSegments+1; i > 0; i--){
        quadrilateral([i, i-1, i+armSegments+1, i+armSegments+2], 3, arm)
    }

    //Joint connection
    quadrilateral([2*armSegments+4, 2*armSegments+5, 2*armSegments+6, 2*armSegments+7], 0, arm)
    for(let i = 2*armSegments+jointSegments+9; i > 2*armSegments+9; i--){
        triangle([i, i-1, 2*armSegments+8], 0, arm)
    }

    quadrilateral([2*armSegments+jointSegments+10, 2*armSegments+jointSegments+11, 2*armSegments+jointSegments+12, 2*armSegments+jointSegments+13], 0, arm)
    for(let i = 2*armSegments+2*jointSegments+15; i > 2*armSegments+jointSegments+10; i--){
        triangle([i, i-1, 2*armSegments+jointSegments+14], 0, arm)
    }

    quadrilateral([2*armSegments+4,2*armSegments+jointSegments+10,2*armSegments+jointSegments+13,2*armSegments+7], 4, arm)
    quadrilateral([2*armSegments+5,2*armSegments+jointSegments+11,2*armSegments+jointSegments+12,2*armSegments+6], 4, arm)
    for(let i = 2*armSegments+jointSegments+9; i > 2*armSegments+9; i--){
        quadrilateral([i, i-1, i+jointSegments+5, i+jointSegments+6], 4, arm)
    }
    armCount = points.length - armStart;
}