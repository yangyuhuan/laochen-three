import * as THREE from "three";
//导入轨道控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
//导入动画库
import gsap from "gsap";


// 目标：监听页面尺寸变化，修改渲染画面

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
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
//根据几何体和材质创建物体
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
//将几何体添加到场景中
scene.add(cube);

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



let animate1 = gsap.to(cube.position, {
  x: 5,
  duration: 5,
  ease: "power1.inOut",
  //设置重复的次数,无限次循环-1
  repeat: -1,
  //往返运动
  yoyo: true,
  delay: 2,
  onComplete: ()=>{
    console.log('动画完成')
  },
  conStart: ()=>{
    console.log("动画开始")
  }
})

gsap.to(cube.rotation, {
  x: 2 * Math.PI,
  duration: 5,
  ease: 'power1.inOut'
})

window.addEventListener("dblclick", ()=>{
  if(animate1.isActive()){
    animate1.pause()
  }else{
    animate1.resume()
  }
})


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
