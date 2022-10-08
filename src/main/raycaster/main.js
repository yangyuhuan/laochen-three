import * as THREE from "three";
//导入轨道控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
//导入动画库
import gsap from "gsap";
//导入data.gui
import * as dat from "dat.gui"


//目标：raycaster

const gui = new dat.GUI();
//1.创建场景
const scene = new THREE.Scene();

//2.创建相机
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  300
);

const textureLoader = new THREE.TextureLoader()
//设置相机位置
camera.position.set(0,0,20)
scene.add(camera)

//添加物体
const cubeGeometry = new THREE.BoxBufferGeometry(1,1,1)
//材质
const material = new THREE.MeshBasicMaterial({
  wireframe: true
})

const redMaterial = new THREE.MeshBasicMaterial({
  color: '#ff0000'
})

//1000立方体
let cubeArr = []
for(let i = -5; i < 5; i++) {
  for(let j = -5; j < 5; j++){
    for(let z = -5; z < 5; z++){
      const cube = new THREE.Mesh(cubeGeometry, material)
      cube.position.set(i, j, z)
      scene.add(cube)
      cubeArr.push(cube)
    
    }
  }
}

//创建投射光线对象
const raycaster = new THREE.Raycaster();

//鼠标的位置对象
const mouse = new THREE.Vector2();

//监听鼠标的位置
window.addEventListener('click', (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 -1;
  mouse.y = - ((event.clientX / window.innerHeight) * 2 -1);

  raycaster.setFromCamera(mouse, camera)

  let result = raycaster.intersectObjects(cubeArr)
  result.forEach(item => {
    item.object.material = redMaterial
  })
})
  
//4.初始化渲染器
const renderer = new THREE.WebGLRenderer();
//设置渲染的尺寸大小
renderer.setSize(window.innerWidth, window.innerHeight);
// 开启场景中的阴影贴图
renderer.shadowMap.enabled = true;
renderer.physicallyCorrectLights = true;

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
