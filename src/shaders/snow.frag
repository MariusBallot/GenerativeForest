varying vec3 vUv;
varying float n;

float map(float x,float in_min, float in_max, float out_min, float out_max){
  return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

void main() {
  vec3 col = vec3(map(n, 0., 1., 0.4,0.7));
  float a = vUv.y*0.1+2.;
  gl_FragColor = vec4(col, a);
}