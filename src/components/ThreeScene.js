import * as THREE from "three";
import OrbitControls from "orbit-controls-es6";
import snowVert from "../shaders/snow.vert";
import snowFrag from "../shaders/snow.frag";

import { GUI } from "three/examples/jsm/libs/dat.gui.module.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";


import Forest from './Forest'

class ThreeScene {
  constructor() {
    this.mouseX = 0;
    this.mouseY = 0


    this.snow

    this.pointLight

    this.camera;
    this.scene;
    this.renderer;
    this.controls;
    this.uniforms;
    this.composer;
    this.bloomPass
    this.Forest
    this.bind();
    this.init();
  }

  init() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.body.appendChild(this.renderer.domElement);

    // let white = new THREE.Color(0x202030)
    let white = new THREE.Color(0xBB9999)
    this.scene = new THREE.Scene();
    this.scene.background = white
    this.scene.fog = new THREE.Fog(white, 1, 40)

    this.camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set(0, 1, 0);
    this.camera.lookAt(0, 1, 1)

    this.composer = new EffectComposer(this.renderer);
    this.composer.antialias = true
    this.composer.addPass(new RenderPass(this.scene, this.camera));
    this.bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 3, 1, 0.7);
    this.composer.addPass(this.bloomPass);

    // this.myGui()


    let light = new THREE.AmbientLight();
    light.intensity = 0.1
    this.pointLight = new THREE.PointLight();
    this.pointLight.position.set(6, 10, 1);
    this.pointLight.intensity = 0.6
    this.pointLight.castShadow = true
    this.pointLight.shadow.mapSize.width = 2048;
    this.pointLight.shadow.mapSize.height = 2048;

    this.scene.add(light, this.pointLight);

    this.Forest = new Forest(this.scene, this.camera)

    let plane = new THREE.Mesh(new THREE.PlaneBufferGeometry(100, 100), new THREE.MeshPhongMaterial({ color: 0x151515 }))
    plane.receiveShadow = true;
    plane.rotateX(-Math.PI / 2)
    this.scene.add(plane)

    this.snow = new THREE.Mesh(new THREE.PlaneGeometry(20, 40, 200, 400), new THREE.ShaderMaterial({
      vertexShader: snowVert,
      fragmentShader: snowFrag,
      transparent: true,
      uniforms: {
        t: {
          type: 'f',
          value: 0,
        }
      }
    }));
    this.snow.rotateX(-Math.PI / 2)
    this.snow.position.y = -0.01
    this.snow.position.z = 40 / 2
    this.scene.add(this.snow)

    window.addEventListener('mousemove', (e) => {
      this.mouseX = e.clientX - window.innerWidth / 2
      this.mouseY = e.clientY - window.innerHeight / 2
    })
  }

  update() {
    this.Forest.moveForest()

    this.snow.material.uniforms.t.value += 1;

    this.camera.position.x += (-this.mouseX / 1000 - this.camera.position.x) * 0.05
    this.camera.position.y += (-this.mouseY / 1000 - this.camera.position.y + 1) * 0.05

    this.composer.render();
  }

  resizeCanvas() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
  }

  bind() {
    this.resizeCanvas = this.resizeCanvas.bind(this);
    this.myGui = this.myGui.bind(this);
    this.moveCam = this.myGui.bind(this);
    window.addEventListener("resize", this.resizeCanvas);
  }

  moveCam(e) {
    console.log('what')
  }


  myGui() {
    var gui = new GUI();
    var params = {
      exposure: 1,
      bloomStrength: 0,
      bloomThreshold: 1.8,
      bloomRadius: 0.55,
      animationSpeed: 0.01
    };

    gui.add(params, "exposure", 0.1, 2).onChange(value => {
      this.renderer.toneMappingExposure = Math.pow(value, 4.0);
    });

    gui.add(params, "bloomThreshold", 0.0, 1.0).onChange(value => {
      this.bloomPass.threshold = Number(value);
    });

    gui.add(params, "bloomStrength", 0.0, 3.0).onChange(value => {
      this.bloomPass.strength = Number(value);
    });

    gui.add(params, "bloomRadius", 0.0, 1.0).step(0.01).onChange(value => {
      this.bloomPass.radius = Number(value);
    });

    gui.add(params, "animationSpeed", 0.0, 0.2).step(0.01).onChange(value => {
      this.AnimSpeed = Number(value);
    });
  }
}

export {
  ThreeScene as
    default
};
