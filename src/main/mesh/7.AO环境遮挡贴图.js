import * as THREE from "three";
//导入轨道控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
//导入动画库
import gsap from "gsap";
//导入data.gui
import * as dat from "dat.gui"

// 目标：AO环境遮挡贴图

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
const textureLoader = new THREE.TextureLoader()
const doorColorTexture = textureLoader.load("./textures/door/color.jpg")
const doorAlphaTexture = textureLoader.load("./textures/door/alpha.jpg")
const doorAoTexture = textureLoader.load("./textures/door/ambientOcclusion.jpg")

// 设置纹理偏移
// doorColorTexture.offset.x = 0.5;
// doorColorTexture.offset.y = 0.5;
// 设置旋转的原点
// doorColorTexture.center.set(0.5, 0.5);
// // 旋转45deg
// doorColorTexture.rotation = Math.PI / 4;
// 设置纹理的重复
// doorColorTexture.repeat.set(2, 3);
// doorColorTexture.wrapS = THREE.MirroredRepeatWrapping;
// doorColorTexture.wrapT = THREE.RepeatWrapping;


// texture纹理显示设置
// texture.minFilter = THREE.NearestFilter;
// texture.magFilter = THREE.NearestFilter;
// texture.minFilter = THREE.LinearFilter;
// texture.magFilter = THREE.LinearFilter;

const cubeGeometry = new THREE.BoxBufferGeometry(1,1,1)
const basicMaterial = new THREE.MeshBasicMaterial({
  color:"#ffff00",
  map: doorColorTexture,
  alphaMap: doorAlphaTexture,
  transparent: true,
  aoMap: doorAoTexture,
  aoMapIntensity: 1,
  // opacity: 0.3
})


//双面渲染
basicMaterial.side = THREE.DoubleSide
const cube = new THREE.Mesh(cubeGeometry,basicMaterial)
scene.add(cube)

//给cube添加第二组uv
cubeGeometry.setAttribute(
  'uv2',
  new THREE.BufferAttribute(cubeGeometry.attributes.uv.array,2)
)


//添加平面
const plane = new THREE.Mesh(
  new THREE.PlaneBufferGeometry(1,1),
  basicMaterial
)
plane.position.set(3, 0, 0)
scene.add(plane)
// 给平面设置第二组uv
planeGeometry.setAttribute(
  "uv2",
  new THREE.BufferAttribute(planeGeometry.attributes.uv.array, 2)
);

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
//设置控制器阻力,让控制器更有真实效果,必须在动画循环里调用.update()
controls.enableDamping = true

//添加坐标轴辅助器
const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)


function render() {
  controls.update()
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
