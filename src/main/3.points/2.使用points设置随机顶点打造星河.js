import * as THREE from "three";
//导入轨道控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
//导入动画库
import gsap from "gsap";
//导入dat.ui
import * as dat from "dat.gui";

//目标：使用points设置随机顶点打造星河
const gui = new dat.GUI();

//1.创建场景
const scene = new THREE.Scene();

//2.创建相机
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

//设置相机位置
camera.position.set(0, 0, 10);
scene.add(camera);

//创建球几何体
const particlesGeometry = new THREE.BufferGeometry(3, 30, 30);

const count = 5000;

//设置缓冲区数组
const positions = new Float32Array(count * 3);
//设置粒子顶点颜色
const colors = new Float32Array(count * 3);
//设置顶点
for (let i = 0; i < count * 3; i++) {
  positions[i] = (Math.random() - 0.5) * 100;
  colors[i] = Math.random();
}

particlesGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positions, 3)
);
particlesGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

//设置点材质
const pointsMaterial = new THREE.PointsMaterial();
pointsMaterial.size = 0.5;
pointsMaterial.color.set(0xfff000);

//相机深度而衰减
pointsMaterial.sizeAttenuation = true;

//载入纹理
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load("./textures/particles/zs2.png");
//设置点材质纹理
pointsMaterial.map = texture;
pointsMaterial.alphaMap = texture;
pointsMaterial.transparent = true;
pointsMaterial.depthWrite = false;
pointsMaterial.blending = THREE.AdditiveBlending;

const points = new THREE.Points(particlesGeometry, pointsMaterial);
scene.add(points);

//初始化渲染器
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
//初始化场景中的阴影贴图
renderer.shadowMap.enabled = true;
renderer.physicallyCorrectLights = true;

document.body.appendChild(renderer.domElement);

//创建轨道控制器
const controls = new OrbitControls(camera, renderer.domElement);
//设置控制器阻力
controls.enableDamping = true;

//添加坐标轴辅助器
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

function render() {
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}

render();

window.addEventListener("resize", () => {
  //更新摄像头
  camera.aspect = window.innerWidth / window.innerHeight;
  //更新摄像机的投影矩阵
  camera.updateProjectionMatrix();

  //更新渲染器
  renderer.setSize(window.innerWidth, window.innerheight);
  //设置渲染器的像素比
  renderer.setPixelRatio(window.devicePixelRatio);
});
