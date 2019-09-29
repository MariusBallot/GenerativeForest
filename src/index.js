import './sass/index.scss';
import ThreeScene from './components/threeScene'

import img from './assets/logo.png'


const threeScene = new ThreeScene();
window.addEventListener('load', function () {
    document.querySelector('.logo').style = 'display: block;'
    this.console.log(document.querySelector('.logo'))
    document.querySelector('.logo').src = img
})

function raf() {
    requestAnimationFrame(raf)
    threeScene.update();
}

raf()