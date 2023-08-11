import * as THREE from './node_modules/three/build/three.module.js';
import './style.css';
import gsap from 'gsap';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';

const scene = new THREE.Scene();


const geomtry =  new THREE.TorusGeometry( 5, 2, 16, 100 ); 
const material = new THREE.MeshStandardMaterial({
  color: '#049ef4',
  roughness: .5,
  metalness: 1
})
const mesh = new THREE.Mesh(geomtry, material);
scene.add(mesh);

const size = {
  width: window.innerWidth,
  height: window.innerHeight
}

const spotLight = new THREE.PointLight( 0xffffff, 450, 100 );
spotLight.position.set( 0, 10, 10 );

spotLight.castShadow = true;
scene.add(spotLight);

const camera = new THREE.PerspectiveCamera(45, size.width / size.height, 0.1, 100);
camera.position.z = 50;
scene.add(camera);


const canvas = document.querySelector('.webgl');
const renderer = new THREE.WebGLRenderer({canvas});

renderer.setSize(size.width, size.height);
renderer.setPixelRatio(2);
renderer.render(scene, camera);
renderer.setClearColor( 0xffffff, 0);


window.addEventListener('resize', () => {
  size.width = window.innerWidth;
  size.height = window.innerHeight;

  camera.updateProjectionMatrix();
  camera.aspect = size.width / size.height;
  renderer.setSize(size.width, size.height);
})

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enablePan = false;
controls.enableZoom = false;
controls.autoRotate = true;
controls.autoRotateSpeed = 3;


const loop = () => {
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(loop);
}

loop();

const tl = gsap.timeline({defaults: {duration: 1}})
tl.fromTo(mesh.scale, {z:0, x:0, y:0}, {z:1, x:1, y:1})



let mouseDown = false;
let rgb = []
window.addEventListener('mousedown', () => (mouseDown = true));
window.addEventListener('mouseup', () => (mouseDown = false));

window.addEventListener('mousemove', (e) => {
  if (mouseDown) {
    rgb = [
      Math.round((e.pageX / size.width) * 255),
      Math.round((e.pageY / size.height) * 255),
      150,
    ]
    let newColor = new THREE.Color(`rgb(${rgb.join(",")})`);
    document.getElementById('grow').style.backgroundColor = `rgb(${rgb.join(",")})`;
    gsap.to(mesh.material.color, {r: newColor.r, g: newColor.g, b: newColor.b})
  }  
})




const element = document.getElementById("grow");
element.addEventListener("click", grow);

var originalScale = 1;
var newScale = getRandomScale(); // Initialize with a random value

function getRandomScale() {
  return Math.random() * 3; 
}

function grow() {
  tl.fromTo(mesh.scale, {z: originalScale, x: originalScale, y: originalScale}, {z: newScale, x: newScale, y: newScale});
  var temp = originalScale;
  originalScale = newScale;
  newScale = temp;
  newScale = getRandomScale();
}
