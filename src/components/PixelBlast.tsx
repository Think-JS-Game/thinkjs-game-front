import { Effect, EffectComposer, EffectPass, RenderPass } from "postprocessing";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import * as THREE from "three";
import "./PixelBlast.css";

const createTouchTexture = () => {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = size; canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "black"; ctx.fillRect(0, 0, size, size);
  const texture = new THREE.Texture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;
  const trail: { x: number; y: number; age: number; force: number; vx: number; vy: number }[] = [];
  let last: { x: number; y: number } | null = null;
  const maxAge = 64;
  let radius = 0.1 * size;
  const speed = 1 / maxAge;
  const clear = () => { ctx.fillStyle = "black"; ctx.fillRect(0, 0, size, size); };
  const drawPoint = (p: typeof trail[0]) => {
    const pos = { x: p.x * size, y: (1 - p.y) * size };
    const easeOutSine = (t: number) => Math.sin((t * Math.PI) / 2);
    const easeOutQuad = (t: number) => -t * (t - 2);
    let intensity = p.age < maxAge * 0.3 ? easeOutSine(p.age / (maxAge * 0.3)) : (easeOutQuad(1 - (p.age - maxAge * 0.3) / (maxAge * 0.7)) || 0);
    intensity *= p.force;
    const color = `${((p.vx + 1) / 2) * 255}, ${((p.vy + 1) / 2) * 255}, ${intensity * 255}`;
    const offset = size * 5;
    ctx.shadowOffsetX = offset; ctx.shadowOffsetY = offset; ctx.shadowBlur = radius;
    ctx.shadowColor = `rgba(${color},${0.22 * intensity})`;
    ctx.beginPath(); ctx.fillStyle = "rgba(255,0,0,1)";
    ctx.arc(pos.x - offset, pos.y - offset, radius, 0, Math.PI * 2); ctx.fill();
  };
  const addTouch = (norm: { x: number; y: number }) => {
    let force = 0, vx = 0, vy = 0;
    if (last) {
      const dx = norm.x - last.x, dy = norm.y - last.y;
      if (dx === 0 && dy === 0) return;
      const d = Math.sqrt(dx * dx + dy * dy);
      vx = dx / (d || 1); vy = dy / (d || 1);
      force = Math.min((dx * dx + dy * dy) * 10000, 1);
    }
    last = { x: norm.x, y: norm.y };
    trail.push({ x: norm.x, y: norm.y, age: 0, force, vx, vy });
  };
  const update = () => {
    clear();
    for (let i = trail.length - 1; i >= 0; i--) {
      const p = trail[i];
      const f = p.force * speed * (1 - p.age / maxAge);
      p.x += p.vx * f; p.y += p.vy * f; p.age++;
      if (p.age > maxAge) trail.splice(i, 1);
    }
    trail.forEach(drawPoint);
    texture.needsUpdate = true;
  };
  return { canvas, texture, addTouch, update, set radiusScale(v: number) { radius = 0.1 * size * v; }, get radiusScale() { return radius / (0.1 * size); }, size };
};

const createLiquidEffect = (texture: THREE.Texture, opts?: { strength?: number; freq?: number }) =>
  new Effect("LiquidEffect", `
    uniform sampler2D uTexture; uniform float uStrength; uniform float uTime; uniform float uFreq;
    void mainUv(inout vec2 uv) {
      vec4 tex = texture2D(uTexture, uv);
      float vx = tex.r * 2.0 - 1.0; float vy = tex.g * 2.0 - 1.0; float intensity = tex.b;
      float wave = 0.5 + 0.5 * sin(uTime * uFreq + intensity * 6.2831853);
      uv += vec2(vx, vy) * uStrength * intensity * wave;
    }
  `, {
    uniforms: new Map<string, THREE.Uniform<any>>([
      ["uTexture", new THREE.Uniform(texture)],
      ["uStrength", new THREE.Uniform(opts?.strength ?? 0.025)],
      ["uTime", new THREE.Uniform(0)],
      ["uFreq", new THREE.Uniform(opts?.freq ?? 4.5)],
    ]),
  });

const SHAPE_MAP: Record<string, number> = { square: 0, circle: 1, triangle: 2, diamond: 3 };
const MAX_CLICKS = 10;
const VERT = `void main() { gl_Position = vec4(position, 1.0); }`;
const FRAG = `
precision highp float;
uniform vec3 uColor; uniform vec2 uResolution; uniform float uTime;
uniform float uPixelSize; uniform float uScale; uniform float uDensity;
uniform float uPixelJitter; uniform int uEnableRipples;
uniform float uRippleSpeed; uniform float uRippleThickness; uniform float uRippleIntensity;
uniform float uEdgeFade; uniform int uShapeType;
const int MAX_CLICKS=10;
uniform vec2 uClickPos[MAX_CLICKS]; uniform float uClickTimes[MAX_CLICKS];
out vec4 fragColor;
float Bayer2(vec2 a){a=floor(a);return fract(a.x/2.+a.y*a.y*.75);}
#define Bayer4(a) (Bayer2(.5*(a))*0.25+Bayer2(a))
#define Bayer8(a) (Bayer4(.5*(a))*0.25+Bayer2(a))
float hash11(float n){return fract(sin(n)*43758.5453);}
float vnoise(vec3 p){
  vec3 ip=floor(p),fp=fract(p);
  float n000=hash11(dot(ip+vec3(0,0,0),vec3(1,57,113)));float n100=hash11(dot(ip+vec3(1,0,0),vec3(1,57,113)));
  float n010=hash11(dot(ip+vec3(0,1,0),vec3(1,57,113)));float n110=hash11(dot(ip+vec3(1,1,0),vec3(1,57,113)));
  float n001=hash11(dot(ip+vec3(0,0,1),vec3(1,57,113)));float n101=hash11(dot(ip+vec3(1,0,1),vec3(1,57,113)));
  float n011=hash11(dot(ip+vec3(0,1,1),vec3(1,57,113)));float n111=hash11(dot(ip+vec3(1,1,1),vec3(1,57,113)));
  vec3 w=fp*fp*fp*(fp*(fp*6.-15.)+10.);
  return mix(mix(mix(n000,n100,w.x),mix(n010,n110,w.x),w.y),mix(mix(n001,n101,w.x),mix(n011,n111,w.x),w.y),w.z)*2.-1.;
}
float fbm2(vec2 uv,float t){
  vec3 p=vec3(uv*uScale,t); float amp=1.,freq=1.,sum=1.;
  for(int i=0;i<5;i++){sum+=amp*vnoise(p*freq);freq*=1.25;amp*=1.;}
  return sum*.5+.5;
}
float maskCircle(vec2 p,float cov){float r=sqrt(cov)*.25;float d=length(p-.5)-r;float aa=.5*fwidth(d);return cov*(1.-smoothstep(-aa,aa,d*2.));}
float maskTriangle(vec2 p,vec2 id,float cov){bool flip=mod(id.x+id.y,2.)>.5;if(flip)p.x=1.-p.x;float r=sqrt(cov);float d=p.y-r*(1.-p.x);float aa=fwidth(d);return cov*clamp(.5-d/aa,0.,1.);}
float maskDiamond(vec2 p,float cov){float r=sqrt(cov)*.564;return step(abs(p.x-.49)+abs(p.y-.49),r);}
void main(){
  float pixelSize=uPixelSize;
  vec2 fragCoord=gl_FragCoord.xy-uResolution*.5;
  float ar=uResolution.x/uResolution.y;
  vec2 pixelId=floor(fragCoord/pixelSize);
  vec2 pixelUV=fract(fragCoord/pixelSize);
  float cellPS=8.*pixelSize;
  vec2 cellId=floor(fragCoord/cellPS);
  vec2 uv=cellId*cellPS/uResolution*vec2(ar,1.);
  float base=fbm2(uv,uTime*.05)*.5-.65;
  float feed=base+(uDensity-.5)*.3;
  if(uEnableRipples==1){
    for(int i=0;i<MAX_CLICKS;i++){
      vec2 pos=uClickPos[i]; if(pos.x<0.)continue;
      vec2 cuv=(((pos-uResolution*.5-cellPS*.5)/uResolution))*vec2(ar,1.);
      float t=max(uTime-uClickTimes[i],0.);
      float r=distance(uv,cuv);
      float ring=exp(-pow((r-uRippleSpeed*t)/uRippleThickness,2.));
      feed=max(feed,ring*exp(-1.*t)*exp(-10.*r)*uRippleIntensity);
    }
  }
  float bayer=Bayer8(fragCoord/pixelSize)-.5;
  float bw=step(.5,feed+bayer);
  float h=fract(sin(dot(floor(fragCoord/pixelSize),vec2(127.1,311.7)))*43758.5453);
  float coverage=bw*(1.+(h-.5)*uPixelJitter);
  float M;
  if(uShapeType==1)M=maskCircle(pixelUV,coverage);
  else if(uShapeType==2)M=maskTriangle(pixelUV,pixelId,coverage);
  else if(uShapeType==3)M=maskDiamond(pixelUV,coverage);
  else M=coverage;
  if(uEdgeFade>0.){
    vec2 norm=gl_FragCoord.xy/uResolution;
    float edge=min(min(norm.x,norm.y),min(1.-norm.x,1.-norm.y));
    M*=smoothstep(0.,uEdgeFade,edge);
  }
  vec3 col=uColor;
  vec3 srgb=mix(col*12.92,1.055*pow(col,vec3(1./2.4))-.055,step(0.0031308,col));
  fragColor=vec4(srgb,M);
}
`;

interface PixelBlastProps {
  variant?: "square" | "circle" | "triangle" | "diamond";
  pixelSize?: number;
  color?: string;
  className?: string;
  style?: CSSProperties;
  antialias?: boolean;
  patternScale?: number;
  patternDensity?: number;
  liquid?: boolean;
  liquidStrength?: number;
  liquidRadius?: number;
  pixelSizeJitter?: number;
  enableRipples?: boolean;
  rippleIntensityScale?: number;
  rippleThickness?: number;
  rippleSpeed?: number;
  liquidWobbleSpeed?: number;
  autoPauseOffscreen?: boolean;
  speed?: number;
  transparent?: boolean;
  edgeFade?: number;
}

export default function PixelBlast({
  variant = "square", pixelSize = 3, color = "#B497CF", className, style,
  antialias = true, patternScale = 2, patternDensity = 1, liquid = false,
  liquidStrength = 0.1, liquidRadius = 1, pixelSizeJitter = 0, enableRipples = true,
  rippleIntensityScale = 1, rippleThickness = 0.1, rippleSpeed = 0.3,
  liquidWobbleSpeed = 4.5, autoPauseOffscreen = true, speed = 0.5,
  transparent = true, edgeFade = 0.5,
}: PixelBlastProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const visibilityRef = useRef({ visible: true });
  const speedRef = useRef(speed);
  const threeRef = useRef<any>(null);
  const prevConfigRef = useRef<any>(null);

  // States para performance
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const mediaQueryMobile = window.matchMedia("(max-width: 767px)");
    setIsMobile(mediaQueryMobile.matches);
    const handleResize = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mediaQueryMobile.addEventListener("change", handleResize);
    return () => mediaQueryMobile.removeEventListener("change", handleResize);
  }, []);

  useEffect(() => {
    if (!autoPauseOffscreen) return;
    const observer = new IntersectionObserver(
      (entries) => {
        visibilityRef.current.visible = entries[0].isIntersecting;
      },
      { threshold: 0.05 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [autoPauseOffscreen]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || isReducedMotion) return;
    
    // Fallback Mobile
    const activeLiquid = isMobile ? false : liquid;
    const activePixelSize = isMobile ? pixelSize * 1.5 : pixelSize;

    speedRef.current = speed;
    const cfg = { antialias, liquid: activeLiquid };
    const mustReinit = !threeRef.current || (prevConfigRef.current && (prevConfigRef.current.antialias !== cfg.antialias || prevConfigRef.current.liquid !== cfg.liquid));

    if (mustReinit) {
      if (threeRef.current) {
        const t = threeRef.current;
        t.resizeObserver?.disconnect();
        cancelAnimationFrame(t.raf);
        t.quad?.geometry.dispose();
        t.material.dispose();
        t.composer?.dispose();
        t.renderer.dispose();
        t.renderer.forceContextLoss();
        if (t.renderer.domElement.parentElement === container) container.removeChild(t.renderer.domElement);
        threeRef.current = null;
      }

      const canvas = document.createElement("canvas");
      const renderer = new THREE.WebGLRenderer({ canvas, antialias, alpha: true, powerPreference: "high-performance" });
      renderer.domElement.style.width = "100%";
      renderer.domElement.style.height = "100%";
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      container.appendChild(renderer.domElement);
      if (transparent) renderer.setClearAlpha(0); else renderer.setClearColor(0x000000, 1);

      const uniforms = {
        uResolution: { value: new THREE.Vector2(0, 0) },
        uTime: { value: 0 },
        uColor: { value: new THREE.Color(color) },
        uClickPos: { value: Array.from({ length: MAX_CLICKS }, () => new THREE.Vector2(-1, -1)) },
        uClickTimes: { value: new Float32Array(MAX_CLICKS) },
        uShapeType: { value: SHAPE_MAP[variant] ?? 0 },
        uPixelSize: { value: activePixelSize * renderer.getPixelRatio() },
        uScale: { value: patternScale },
        uDensity: { value: patternDensity },
        uPixelJitter: { value: pixelSizeJitter },
        uEnableRipples: { value: enableRipples ? 1 : 0 },
        uRippleSpeed: { value: rippleSpeed },
        uRippleThickness: { value: rippleThickness },
        uRippleIntensity: { value: rippleIntensityScale },
        uEdgeFade: { value: edgeFade },
      };

      const scene = new THREE.Scene();
      const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
      const material = new THREE.ShaderMaterial({ vertexShader: VERT, fragmentShader: FRAG, uniforms, transparent: true, depthTest: false, depthWrite: false, glslVersion: THREE.GLSL3 });
      const quadGeom = new THREE.PlaneGeometry(2, 2);
      const quad = new THREE.Mesh(quadGeom, material);
      scene.add(quad);
      const clock = new THREE.Timer();

      const setSize = () => {
        const w = container.clientWidth || 1, h = container.clientHeight || 1;
        renderer.setSize(w, h, false);
        uniforms.uResolution.value.set(renderer.domElement.width, renderer.domElement.height);
        if (threeRef.current?.composer) threeRef.current.composer.setSize(renderer.domElement.width, renderer.domElement.height);
        uniforms.uPixelSize.value = activePixelSize * renderer.getPixelRatio();
      };
      setSize();
      const ro = new ResizeObserver(setSize);
      ro.observe(container);

      const timeOffset = Math.random() * 1000;
      let composer: EffectComposer | undefined;
      let touch: ReturnType<typeof createTouchTexture> | undefined;
      let liquidEffect: Effect | undefined;

      if (activeLiquid) {
        touch = createTouchTexture();
        touch.radiusScale = liquidRadius;
        composer = new EffectComposer(renderer);
        const renderPass = new RenderPass(scene, camera);
        liquidEffect = createLiquidEffect(touch.texture, { strength: liquidStrength, freq: liquidWobbleSpeed });
        const effectPass = new EffectPass(camera, liquidEffect);
        effectPass.renderToScreen = true;
        composer.addPass(renderPass);
        composer.addPass(effectPass);
        composer.setSize(renderer.domElement.width, renderer.domElement.height);
      }

      const mapToPixels = (e: PointerEvent) => {
        const rect = renderer.domElement.getBoundingClientRect();
        const sx = renderer.domElement.width / rect.width, sy = renderer.domElement.height / rect.height;
        return { fx: (e.clientX - rect.left) * sx, fy: (rect.height - (e.clientY - rect.top)) * sy, w: renderer.domElement.width, h: renderer.domElement.height };
      };

      const onPointerDown = (e: PointerEvent) => {
        const { fx, fy } = mapToPixels(e);
        const ix = threeRef.current?.clickIx ?? 0;
        uniforms.uClickPos.value[ix].set(fx, fy);
        uniforms.uClickTimes.value[ix] = uniforms.uTime.value;
        if (threeRef.current) threeRef.current.clickIx = (ix + 1) % MAX_CLICKS;
      };
      const onPointerMove = (e: PointerEvent) => {
        if (!touch) return;
        const { fx, fy, w, h } = mapToPixels(e);
        touch.addTouch({ x: fx / w, y: fy / h });
      };
      renderer.domElement.addEventListener("pointerdown", onPointerDown, { passive: true });
      renderer.domElement.addEventListener("pointermove", onPointerMove, { passive: true });

      let raf = 0;
      const animate = () => {
        if (autoPauseOffscreen && !visibilityRef.current.visible) { raf = requestAnimationFrame(animate); return; }
        clock.update();
        uniforms.uTime.value = timeOffset + clock.getElapsed() * speedRef.current;
        if (composer) { if (touch) touch.update(); composer.render(); }
        else renderer.render(scene, camera);
        raf = requestAnimationFrame(animate);
      };
      raf = requestAnimationFrame(animate);

      threeRef.current = { renderer, scene, camera, material, clock, clickIx: 0, uniforms, resizeObserver: ro, raf, quad, timeOffset, composer, touch, liquidEffect };
    } else {
      const t = threeRef.current;
      t.uniforms.uShapeType.value = SHAPE_MAP[variant] ?? 0;
      t.uniforms.uPixelSize.value = activePixelSize * t.renderer.getPixelRatio();
      t.uniforms.uColor.value.set(color);
      t.uniforms.uScale.value = patternScale;
      t.uniforms.uDensity.value = patternDensity;
      t.uniforms.uPixelJitter.value = pixelSizeJitter;
      t.uniforms.uEnableRipples.value = enableRipples ? 1 : 0;
      t.uniforms.uRippleIntensity.value = rippleIntensityScale;
      t.uniforms.uRippleThickness.value = rippleThickness;
      t.uniforms.uRippleSpeed.value = rippleSpeed;
      t.uniforms.uEdgeFade.value = edgeFade;
    }
    prevConfigRef.current = cfg;

    return () => {
      if (mustReinit) return;
      if (!threeRef.current) return;
      const t = threeRef.current;
      t.resizeObserver?.disconnect();
      cancelAnimationFrame(t.raf);
      t.quad?.geometry.dispose();
      t.material.dispose();
      t.composer?.dispose();
      t.renderer.dispose();
      t.renderer.forceContextLoss();
      if (t.renderer.domElement.parentElement === container) container.removeChild(t.renderer.domElement);
      threeRef.current = null;
    };
  }, [antialias, liquid, pixelSize, patternScale, patternDensity, enableRipples, rippleIntensityScale, rippleThickness, rippleSpeed, pixelSizeJitter, edgeFade, transparent, liquidStrength, liquidRadius, liquidWobbleSpeed, autoPauseOffscreen, variant, color, speed, isReducedMotion, isMobile]);

  if (isReducedMotion) {
    return (
      <div className={`pixel-blast-container${className ? ` ${className}` : ""}`} style={{ ...style, backgroundColor: "transparent" }} aria-hidden />
    );
  }

  return (
    <div ref={containerRef} className={`pixel-blast-container${className ? ` ${className}` : ""}`} style={style} aria-hidden />
  );
}
