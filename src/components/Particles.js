import * as THREE from 'three';

import part from '../assets/particle.png'

export default class Particles {

    constructor(pCount_, boxSize_) {
        this.particleCount = pCount_;
        this.plarticles;
        this.particlMaterial;
        this.particleSystem;
        this.boxSize = boxSize_;

        this.bind();
        this.init();
    }

    init() {
        this.particles = new THREE.Geometry();

        for (let p = 0; p < this.particleCount; p++) {

            let x = Math.random() * this.boxSize - this.boxSize / 2;
            let y = Math.random() * this.boxSize;
            let z = Math.random() * this.boxSize - this.boxSize / 2;

            // Create the vertex
            let particle = new THREE.Vector3(x, y, z);

            // Add the vertex to the geometry
            this.particles.vertices.push(particle);
        }

        let texLoader = new THREE.TextureLoader()

        this.particleMaterial = new THREE.PointsMaterial(
            {
                color: 0xffffff,
                size: 0.01,
                map: texLoader.load(part),
                blending: THREE.AdditiveBlending,
                transparent: true,
            });

        this.particleSystem = new THREE.Points(this.particles, this.particleMaterial);
    }

    translateParticles(y_, z_) {
        for (let p = 0; p < this.particleCount; p++) {
            this.particleSystem.geometry.vertices[p].x += 0;
            this.particleSystem.geometry.vertices[p].y += y_;
            this.particleSystem.geometry.vertices[p].z += z_;
            if (this.particleSystem.geometry.vertices[p].z <= -1) {
                this.particleSystem.geometry.vertices[p].z = this.boxSize;
                this.particleSystem.geometry.vertices[p].x = Math.random() * this.boxSize - this.boxSize / 2;
            }
            if (this.particleSystem.geometry.vertices[p].y <= 0) {
                this.particleSystem.geometry.vertices[p].y = this.boxSize;
                this.particleSystem.geometry.vertices[p].x = Math.random() * this.boxSize - this.boxSize / 2;

            }
        }

        this.particleSystem.geometry.verticesNeedUpdate = true;


    }

    bind() {
        this.init = this.init.bind(this)
        this.translateParticles = this.translateParticles.bind(this)
    }

}

