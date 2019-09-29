import * as THREE from 'three'
import Particles from './Particles'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import monModel from '../assets/exported.fbx'
import shroomsUrl from '../assets/shrooms.fbx'

import low from '../assets/low.mp3'
import mid from '../assets/mid.mp3'
import high from '../assets/high.mp3'
import top from '../assets/top.mp3'
import backSound from '../assets/background.mp3'

export default class Forest {
    constructor(scene, camera) {
        let background = new Audio(backSound)

        this.audios = []

        this.flags = []

        this.clickFlag = false

        this.camera = camera
        this.particles = new Particles(3000, 5)

        this.loader = new FBXLoader();
        this.texLoader = new THREE.TextureLoader();
        this.treeCount = 150;
        this.shroomCount = 130;
        this.posTrees = []

        this.shrooms = []
        this.posShrooms = []

        let trees = []
        this.off = 5;
        this.scene = scene
        this.loader.load(monModel, (scene) => {
            for (let i = 0; i < scene.children.length; i++) {
                scene.children[i].material = new THREE.MeshPhongMaterial({
                    color: 0x232323
                })
                trees.push(scene.children[i])
            }
            this.placeTress(trees)

        })

        this.loader.load(shroomsUrl, (scene) => {
            scene.children.forEach(group => {
                group.children.forEach((obj, i) => {
                    if (obj.name == `trunk${i}` || obj.name == 'trunk2') {
                        obj.material = new THREE.MeshPhongMaterial({
                            color: 0x232323
                        })
                    } else {
                        obj.material = new THREE.MeshBasicMaterial()
                    }
                })
                this.shrooms.push(group)

            });

            this.placeShroom(this.shrooms)
        })

        this.scene.add(this.particles.particleSystem)

        window.addEventListener('click', () => {
            if (this.clickFlag == false) {
                background.play()
                background.addEventListener('ended', () => {
                    background.play()
                })
                this.clickFlag = true
            }
        })
    }

    placeShroom(shrooms) {
        for (let i = 0; i < this.shroomCount; i++) {
            this.flags.push(true)
            switch (i % 4) {
                case 0:
                    this.audios.push(new Audio(low))
                    this.audios[i].addEventListener('ended', () => { this.flags[i] = true })
                    this.audios[i].volume = 0.3
                    break;
                case 1:
                    this.audios.push(new Audio(mid))
                    this.audios[i].addEventListener('ended', () => { this.flags[i] = true })
                    this.audios[i].volume = 0.3

                    break;
                case 2:
                    this.audios.push(new Audio(high))
                    this.audios[i].addEventListener('ended', () => { this.flags[i] = true })
                    this.audios[i].volume = 0.3

                    break;
                case 3:
                    this.audios.push(new Audio(top))
                    this.audios[i].addEventListener('ended', () => { this.flags[i] = true })
                    this.audios[i].volume = 0.3

                    break;
            }
            this.audios.push(new Audio(low))
            let shroom = shrooms[i % 3].clone()
            shroom.children[0].receiveShadow = true
            shroom.children[0].castShadow = true
            shroom.children[1].receiveShadow = true
            shroom.children[1].castShadow = true
            shroom.children[1].material = new THREE.MeshPhongMaterial({
                side: THREE.DoubleSide
            })
            shroom.children[0].material = new THREE.MeshPhongMaterial({
                color: 0x232323
            })
            shroom.castShadow = true
            shroom.receiveShadow = true
            let s = 0.002
            shroom.scale.set(s, s, s)
            let pos = {
                x: Math.random() * 5 - 5 / 2,
                y: 0,
                z: Math.random() * 60,
            }
            shroom.position.set(pos.x, pos.y, pos.z)
            shroom.rotateY(Math.random() * Math.PI * 2)
            this.posShrooms.push(shroom)
            this.scene.add(shroom)
        }
    }

    placeTress(trees) {
        for (let i = 0; i < this.treeCount; i++) {
            let tree = trees[i % 3].clone()
            tree.castShadow = true
            tree.receiveShadow = true
            let s = 0.02
            tree.scale.set(s, s, s)
            let pos = {
                x: Math.random() * this.off + 0.4,
                y: -0.05,
                z: Math.random() * 60,
            }
            if (i % 2 == 0) {
                pos.x = -Math.random() * this.off - 0.4
            }
            tree.position.set(pos.x, pos.y, pos.z)
            tree.rotateY(Math.random() * Math.PI * 2)
            this.posTrees.push(tree)
            this.scene.add(tree)
        }
    }

    moveForest() {
        let speed = 0.15
        this.particles.translateParticles(-0.01, -0.1)
        this.posTrees.forEach((tree, i) => {
            tree.position.z -= speed
            if (tree.position.z <= this.camera.position.z - 20) {
                let pos = {
                    x: Math.random() * this.off + 0.4,
                    y: -0.01,
                    z: 40,
                }
                if (i % 2 == 0) {
                    pos.x = -Math.random() * this.off - 0.4
                }
                tree.position.set(pos.x, pos.y, pos.z)
                tree.rotateY(Math.random() * Math.PI * 2)

            }
        });

        this.posShrooms.forEach((shroom, i) => {
            shroom.position.z -= speed
            if (shroom.position.z <= this.camera.position.z - 2) {
                let pos = {
                    x: Math.random() * 5 - 5 / 2,
                    y: -0.01,
                    z: 50,
                }
                if (i % 2 == 0) {
                    pos.x = -Math.random() * this.off - 0.4
                }
                shroom.position.set(pos.x, pos.y, pos.z)
                shroom.rotateY(Math.random() * Math.PI * 2)
            }

            let d = this.distance(shroom.position, this.camera.position)
            let col = -d / 2 + 5;
            if (d <= 3)
                this.playSound(i)

            shroom.children[1].material.color = new THREE.Color(col, col, col)
        })
    }

    distance(from, to) {
        return Math.sqrt(Math.pow((to.x - from.x), 2) + Math.pow((to.z - from.z), 2))
    }

    playSound(i) {
        if (this.flags[i] == true && this.audios[i] && this.clickFlag) {
            this.audios[i].play()
            this.flags[i] = false
        }
    }


    bind() {
        this.placeTress = this.placeTress.bind(this)
        this.moveForest = this.moveForest.bind(this)
        this.distance = this.distance.bind(this)

        this.playSound = this.playSound.bind(this)

    }

}