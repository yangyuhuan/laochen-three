import * as THREE from 'three'
//导入轨道控制器
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
//导入CANNON引擎
import * as CANNON from 'cannon-es';

//目标:cannon引擎

//1.创建舞台
const scene = new THREE.Scene()

//2.创建相机
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  30
)
camera.position.set(0, 0, 18)
scene.add(camera);

//3.创建球和平面
const sphereGeometry = new THREE.SphereGeometry(1, 20, 20);
const sphereMaterial = new THREE.MeshStandardMaterial();
const sphere = new THREE.Mesh(
  sphereGeometry,
  sphereMaterial
)
sphere.castShadow = true;
scene.add(sphere);

const floor = new THREE.Mesh(
  new THREE.PlaneBufferGeometry(20,20),
  new THREE.MeshStandardMaterial()
)
floor.position.set(0, -5, 0);
floor.rotation.x = - Math.PI / 2;
floor.receiveShadow = true;
scene.add(floor)

//4.创建物理世界
const world = new CANNON.World();
world.gravity.set(0, -9.8, 0);
//创建物理小球形状
const sphereShape = new CANNON.Sphere(1);
//设置物理材质
const sphereWorldMaterial = new CANNON.Material('sphere');
//创建物理世界的物体
const sphereBody = new CANNON.Body({
  shape: sphereShape,
  position: new CANNON.Vec3(0, 0, 0),
  //小球质量
  mass: 1,
  //物理材质
  material: sphereWorldMaterial
})
//将物体添加至物理世界
world.addBody(sphereBody);

//创建击打声音
const hitSound = new Audio('assets/metalHit.mp3');
//添加监听碰撞事件
function HitEvent(e){
  //获取碰撞的强度
  const impactStrength = e.contact.getImpactVelocityAlongNormal();
  if(impactStrength > 2) {
    hitSound.currentTime = 0;
    hitSound.play();
  }
}
sphereBody.addEventListener('collide',HitEvent)

//物理世界创建地面
const floorShape = new CANNON.Plane();
const floorBody = new CANNON.Body();
const floorMaterial = new CANNON.Material('floor');
floorBody.material = floorMaterial;
//当质量为0时,可以使得物体保持不动
floorBody.mass = 0;
floorBody.addShape(floorShape);
//地面位置
floorBody.position.set(0, -5, 0);
//旋转地面的位置
floorBody.quaternion.setFromAxisAngle(
  new CANNON.Vec3(1, 0, 0),
  -Math.PI/ 2
)

world.addBody(floorBody);

//设置两种材质碰撞的参数
const defaultContactMaterial = new CANNON.ContactMaterial(
  sphereMaterial,
  floorMaterial,
  {
    //摩擦力
    friction: 0.1,
    //弹性
    restitution: 0.7
  }
);
//将材质的关联设置添加到物理世界
world.addContactMaterial(defaultContactMaterial)


//5.添加环境光和平行光
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight)
const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
dirLight.castShadow = true;
scene.add(dirLight)

//6.初始化渲染器
//渲染器透明
const renderer = new THREE.WebGL1Renderer({
  alpha: true
})
//设置渲染器的大小
renderer.setSize(window.innerWidth, window.innerHeight);
//开启场景中的阴影贴图
renderer.shadowMap.enabled = true

//将webgl渲染的canvas内容添加到body
document.body.appendChild(renderer.domElement)

//7.创建轨道控制器
const controls = new OrbitControls(
  camera,
  renderer.domElement
)
// 设置控制器阻尼，让控制器更有真实效果,必须在动画循环里调用.update()。
controls.enableDamping = true;

//8.添加坐标轴辅助器
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

//9.创建render函数
const clock = new THREE.Clock();
function render(){
  let deltatime = clock.getDelta()
  //更新物理引擎里世界的物体
  world.step(1 / 120, deltatime);

  sphere.position.copy(sphereBody.position);

  renderer.render(scene, camera);
  //渲染下一帧的时候就会调用render函数
  requestAnimationFrame(render)
}
render()

//10.监听画面变化,更新渲染画面
window.addEventListener('resize', () => {

  //更新摄影头
  camera.aspect = window.innerWidth / window.innerHeight;
  //更新摄像机的投影矩阵
   camera.updateProjectionMatrix();
   
   //更新渲染器
   renderer.setSize(window.innerWidth, window.innerHeight);
   //设置渲染器的像素比
   renderer.setPixelRatio(window.devicePixelRatio)
})




