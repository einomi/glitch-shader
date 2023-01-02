precision mediump float;
uniform sampler2D colorMap;
uniform float uTime;
varying vec2 vUv;

float random(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

void main(void ) {
  vec2 uv = vUv;
  float randomNum = 0.5 * uTime;

  float y = 0.0;
  float x = 0.0;
  y -= cos(uv.y) * randomNum;
  x += sin(uv.y) * randomNum;

  float r = texture2D(colorMap, uv + vec2(y, x * randomNum)).r;
  float g = texture2D(colorMap, uv + vec2(y * randomNum, x)).g;
  float b = texture2D(colorMap, uv).b;
  float w = 0.0;

  uv.x *= -uTime * 0.05;
  r += uv.x;
  g += uv.x;
  b += uv.x;
  w -= uTime * 0.5;

  vec3 texture = texture2D(colorMap, uv).rgb;

  gl_FragColor = vec4(r, g, b, 1.0);
}

