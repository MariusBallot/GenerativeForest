#pragma glslify: cnoise = require(./noise.glsl)

varying vec3 vUv; 
varying float n;

uniform float t;

void main() {
  vUv = position; 
  n = cnoise(vec2(vUv.x*0.3, vUv.y*0.3-t*0.045));
  
  
  vec3 pos = position;
  pos.z = n*0.2;
  vec4 modelViewPosition = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * modelViewPosition; 
}