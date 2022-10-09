import * as THREE from "three";
//导入轨道控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
//导入动画库
import gsap from "gsap";
//导入data.gui
import * as dat from "dat.gui"

// 目标：打造酷炫的三角形

//1.创建场景
const scene = new THREE.Scene();

//2.创建相机
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

//设置相机的位置
camera.position.set(0, 0, 10);
scene.add(camera);

//3.添加物体
//创建几何体
for(let i= 0; i < 50; i++){
  const geometry = new THREE.BufferGeometry();
  const positionArray = new Float32Array(9)
  for(let j = 0; j <9; j++){
    positionArray[j] = Math.random()*10 - 5
  }
  geometry.setAttribute('position', new THREE.BufferAttribute(positionArray,3))

  let color = new THREE.Color(Math.random(), Math.random(), Math.random())
  //添加材质
  const material = new THREE.MeshBasicMaterial({ color:color,transparent: true,opacity:0.5 });
  //根据几何体和材质创建物体
  const mesh = new THREE.Mesh(geometry, material);
  //将几何体添加到场景中
  scene.add(mesh);
}


//4.初始化渲染器
const renderer = new THREE.WebGLRenderer();
//设置渲染的尺寸大小
renderer.setSize(window.innerWidth, window.innerHeight);
//将webgl渲染的canvas内容添加到body里面
document.body.appendChild(renderer.domElement);

//5.使用渲染器，通过相机将场景渲染进来
//renderer.render(scene, camera);

//创建轨道控制器
const controls = new OrbitControls(camera, renderer.domElement);
//添加坐标轴辅助器
const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)


function render() {
  renderer.render(scene, camera);
  //渲染下一帧的时候会调用render函数
  requestAnimationFrame(render);
}

render();

// 监听画面变化，更新渲染画面
window.addEventListener("resize",()=>{
  //更新摄像头
  camera.aspect = window.innerWidth/window.innerHeight
  //更新摄像机的投影矩阵
  camera.updateProjectionMatrix()
  //更新渲染器
  renderer.setSize(window.innerWidth, window.innerHeight)
  //设置渲染器的像素比
  renderer.setPixelRatio(Window.devicePicelRatio)
})
