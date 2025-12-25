var base = [];
var hook = [
    vec4(-2.5, -3.0, -0.15, 1),
    vec4(2.5, -3.0, -0.15, 1),
    vec4(2.5, 0, -0.15, 1),
    vec4(-2.5, 0, -0.15, 1),
    vec4(0, 0, -0.15, 1),
];

var radius = 2.5;
var baseSegments = 30;
var hookSegments = baseSegments/2;


for (let i = 0; i <= hookSegments; i++) {
    let angle = (i * Math.PI) / hookSegments;  
    let x = radius * Math.cos(angle);
    let y = radius * Math.sin(angle);
    hook.push(vec4(x, y, -0.15, 1)); 
}

hook.push(vec4(-2.5, -3.0, 0.15, 1))
hook.push(vec4(2.5, -3.0, 0.15, 1))
hook.push(vec4(2.5, 0, 0.15, 1))
hook.push(vec4(-2.5, 0, 0.15, 1))
hook.push(vec4(0, 0, 0.15, 1))

for (let i = 0; i <= hookSegments; i++) {
    let angle = (i * Math.PI) / hookSegments;  
    let x = radius * Math.cos(angle);
    let y = radius * Math.sin(angle);
    hook.push(vec4(x, y, 0.15, 1)); 
}


radius = 3.0
base.push(vec4(0, -3.0, 0, 1))
for (let i = 0; i <= baseSegments; i++) {
    let angle = (i * 2 * Math.PI) / baseSegments;  
    let x = radius * Math.cos(angle);
    let z = radius * Math.sin(angle);
    base.push(vec4(x, -3.0, z, 1)); 
}

base.push(vec4(0, -3.3, 0, 1))
for (let i = 0; i <= baseSegments; i++) {
    let angle = (i * 2 * Math.PI) / baseSegments;  
    let x = radius * Math.cos(angle);
    let z = radius * Math.sin(angle);
    base.push(vec4(x, -3.3, z, 1)); 
}

for (let i = 0; i < hook.length; i++){
    base.push(mult( translate(0.0, 0.0, 1.5), hook[i]))
}

for (let i = 0; i < hook.length; i++){
    base.push(mult( translate(0.0, 0.0, -1.5), hook[i]))
}


setupJoint = function() {
    jointStart = points.length;
    // Base
    for(let i = baseSegments+1; i > 0; i-- ){
        triangle([i, i-1, 0], 1, base)
    }
    for(let i = 2*baseSegments+3; i > baseSegments+3; i-- ){
        triangle([i, i-1, baseSegments+2], 1, base)
    }
    for(let i = baseSegments+1; i > 0; i--){
        quadrilateral([i, i-1, i+baseSegments+1, i+baseSegments+2], 2, base)
    }

    // Hook at the front
    quadrilateral([2*baseSegments+4, 2*baseSegments+5, 2*baseSegments+6, 2*baseSegments+7], 1, base)
    for(let i = 2*baseSegments+hookSegments+9; i > 2*baseSegments+9; i--){
        triangle([i, i-1, 2*baseSegments+8], 1, base)
    }

    quadrilateral([2*baseSegments+hookSegments+10, 2*baseSegments+hookSegments+11, 2*baseSegments+hookSegments+12, 2*baseSegments+hookSegments+13], 1, base)
    for(let i = 2*baseSegments+2*hookSegments+15; i > 2*baseSegments+hookSegments+10; i--){
        triangle([i, i-1, 2*baseSegments+hookSegments+14], 1, base)
    }

    quadrilateral([2*baseSegments+4,2*baseSegments+hookSegments+10,2*baseSegments+hookSegments+13,2*baseSegments+7], 2, base)
    quadrilateral([2*baseSegments+5,2*baseSegments+hookSegments+11,2*baseSegments+hookSegments+12,2*baseSegments+6], 2, base)
    for(let i = 2*baseSegments+hookSegments+9; i > 2*baseSegments+9; i--){
        quadrilateral([i, i-1, i+hookSegments+5, i+hookSegments+6], 2, base)
    }
    


    // Hook at the back
    quadrilateral([2*baseSegments+2*hookSegments+16,2*baseSegments+2*hookSegments+17,2*baseSegments+2*hookSegments+18,2*baseSegments+2*hookSegments+19], 1, base)
    for(let i = 2*baseSegments+3*hookSegments+21; i > 2*baseSegments+2*hookSegments+16; i--){
        triangle([i, i-1, 2*baseSegments+2*hookSegments+20], 1, base)
    }

    quadrilateral([2*baseSegments+3*hookSegments+22, 2*baseSegments+3*hookSegments+23, 2*baseSegments+3*hookSegments+24, 2*baseSegments+3*hookSegments+25], 1, base)
    for(let i = 2*baseSegments+4*hookSegments+27; i > 2*baseSegments+3*hookSegments+27; i--){
        triangle([i, i-1, 2*baseSegments+3*hookSegments+26], 1, base)
    }

    quadrilateral([2*baseSegments+2*hookSegments+16,2*baseSegments+3*hookSegments+22,2*baseSegments+3*hookSegments+25,2*baseSegments+2*hookSegments+19], 2, base)
    quadrilateral([2*baseSegments+2*hookSegments+17,2*baseSegments+3*hookSegments+23,2*baseSegments+3*hookSegments+24,2*baseSegments+2*hookSegments+18], 2, base)
    for(let i = 2*baseSegments+3*hookSegments+21; i > 2*baseSegments+2*hookSegments+16; i--){
        quadrilateral([i, i-1, i+hookSegments+5, i+hookSegments+6], 2, base)
    }

    jointCount = points.length - jointStart;

}