import './style.css'
import * as THREE from 'three'
import { addBoilerPlateMesh, addBoilerPlateMesh2, addflame1, addflame2, aimpoint, addflame3, addflame4 } from './addMeshes'
import { addLight } from './addLights'
import Model from './Model'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { postprocessing } from './postprocessing'
import { AsciiEffect } from 'three/examples/jsm/Addons.js'
import { addAsteroids } from './addMeshes'

const scene = new THREE.Scene()
const renderer = new THREE.WebGLRenderer({ antialias: true })
const camera = new THREE.PerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight,
	0.1,
	100
)
camera.position.set(0, 1, 0)
//var gridHelper = new THREE.GridHelper( 400, 400, '0x84ffff');
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
var score = 0
var win = false
var lose = false
var health = 100
var sneak = false
var ammos = []
var lastTime = 0
var timeInterval = 0.01
var newPosition = new THREE.Vector3()
var matrix = new THREE.Matrix4()
var state = 0
var shot = false
var stop = 1
var DEGTORAD = 0.01745327
var temp = new THREE.Vector3()
var dir = new THREE.Vector3()
var a = new THREE.Vector3()
var b = new THREE.Vector3()
var coronaSafetyDistance = 5.0
var velocityVertical = 0.0
var velocityHoriontal = 0.0
var velocityHoriontal2 = 0.0
var speedVertical = 0.0
var speedHorizontal = 0.0
var speedHorizontal2 = 0.0
var rotateHorizontal = 0.0
var rotateVertical = 0.0
var pointerSpd = 0.0
var boost = 0.0
let goal, follow
const keys = {
	a: false,
	s: false,
	d: false,
	w: false,
	q: false,
	e: false,
	z: false,
	x: false,
	c: false,
}

goal = new THREE.Object3D()
follow = new THREE.Object3D()
follow.position.z = -coronaSafetyDistance

//Globals
const meshes = {}
const lights = {}
const mixers = []
const clock = new THREE.Clock()
let controls
let composer

let effect

const toggleButton = document.createElement('button')
toggleButton.textContent = 'Toggle AsciiEffect'
toggleButton.style.position = 'absolute'
toggleButton.style.top = '10px'
toggleButton.style.zIndex = '3'
toggleButton.style.left = '10px'
//document.body.appendChild(toggleButton)

let asciiEffectEnabled = false

init()
function init() {
	createTapToStartButton()
	const group1 = new THREE.Group()
	camera.lookAt(scene.position)
	const width = window.innerWidth
	const height = window.innerHeight
	renderer.setSize(width)
	renderer.setPixelRatio(window.devicePixelRatio)
	renderer.domElement.style.position = 'absolute'
	renderer.domElement.style.top = '0'
	renderer.domElement.style.left = '0'
    //scene.add( gridHelper )
	//gridHelper.visible = false
	//ASCII
	effect = new AsciiEffect(renderer, ' 01*=0', { invert: true })
	effect.setSize(width, height)
	effect.domElement.style.color = '#00FFFF'
	effect.domElement.style.backgroundColor = 'black'
	effect.domElement.style.position = 'absolute'
	effect.domElement.style.top = '0'
	effect.domElement.style.left = '0'
	// controls = new OrbitControls(camera, effect.domElement)

	document.body.appendChild(renderer.domElement)
	document.body.appendChild(effect.domElement)

	raycaster.setFromCamera(pointer, camera)
	//meshes
	meshes.default = addBoilerPlateMesh()
	meshes.default2 = addBoilerPlateMesh2()
	meshes.flame1 = addflame1()
	meshes.flame2 = addflame2()
	meshes.flame3 = addflame3()
	meshes.flame4 = addflame4()
	meshes.asteroids = addAsteroids()
	meshes.aimpoint = aimpoint()
	lights.defaultLight = addLight()
	meshes.group = group1
	meshes.group.add(meshes.default)
	meshes.group.add(meshes.default2)
	meshes.group.add(meshes.flame1)
	meshes.group.add(meshes.flame2)
	meshes.group.add(meshes.flame3)
	meshes.group.add(meshes.flame4)
	meshes.group.add(meshes.aimpoint)
	//lights
	for(let i = 0; i < meshes.asteroids.length; i++){
		meshes.asteroids[i].rotateY(Math.random() * 40)
		meshes.asteroids[i].rotateZ(Math.random() * 40)
		meshes.asteroids[i].rotateX(Math.random() * 40)
	}
	//changes
	meshes.default.scale.set(2, 2, 2)
	meshes.default2.scale.set(2, 2, 2)

	composer = postprocessing(scene, camera, renderer)

	goal.add(camera)
	//scene operations
	scene.add(meshes.group)
	for(let i = 0; i < meshes.asteroids.length; i++){
		scene.add(meshes.asteroids[i])
	}
	scene.add(lights.defaultLight)
	keySetup()
	models()
	resize()
	button.addEventListener('click', startGame)
}

function createTapToStartButton() {
    button = document.createElement('button')
    button.textContent = 'Tap to Start'
    button.style.position = 'absolute'
    button.style.bottom = '500px'
    button.style.left = '50%'
    button.style.transform = 'translateX(-50%)'
    button.style.padding = '20px'
    button.style.fontSize = '24px'
    button.style.backgroundColor = '#00FFFF'
    button.style.color = '#000'
    button.style.border = 'none'
    button.style.cursor = 'pointer'
    button.style.zIndex = '10'
    document.body.appendChild(button)
}

function startGame() {
    gameStarted = true
    button.style.display = 'none' // Hide the button after the game starts
    animate() // Start the game animation loop
}

function onPointerMove( event ) {
	pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

}

function keySetup() {
	window.addEventListener('keydown', (e) => {
		if (keys[e.key] !== undefined) keys[e.key] = true
		//console.log(keys)
		if (e.key == 'x'){
			state += 1
			if(state > 1){
				state = 0
			}
		}
	})
	window.addEventListener('keyup', (e) => {
		if (keys[e.key] !== undefined) keys[e.key] = false
	})
	window.addEventListener('click', (e) =>{
		if(e.button===0){
			if(lastTime >= timeInterval){
				shotAmmo()
				lastTime = 0
			}
		}
	})
	window.addEventListener('mousedown', (e)=> {
		shot = true
	})
	window.addEventListener('mouseup', (e)=> {
		shot = false
	})
}


function shotAmmo() {
	var bulletSpeed = 1
	var position = new THREE.Vector3();
    position.copy(raycaster.ray.origin);
    var direction = new THREE.Vector3();
    direction.copy(raycaster.ray.direction);
	direction.clone().multiplyScalar(bulletSpeed);
	const ammoDia = new THREE.SphereGeometry(0.5)
	const ammoMat = new THREE.MeshBasicMaterial({
			color: 0xa9fef9,
			transparent: true,
			opacity: 0.5		
		})
	const ammo = new THREE.Mesh(ammoDia, ammoMat)
	ammo.position.copy(position)
	ammo.position.y = 0
	ammo.position.z = -5
	ammo.velocity = direction.clone().multiplyScalar(bulletSpeed)
	scene.add(ammo)
	ammos.push(ammo)
	
}

function models() {
	const Ship = new Model({
		name: 'ship',
		url: '/sbneko.glb',
		scene: scene,
		meshes: meshes,
		scale: new THREE.Vector3(0.6, 0.6, -0.6),
		position: new THREE.Vector3(0, 0, -1),
		replace: true,
		//replaceURL: '/newMatcap.png',
		mixers: mixers,
		follow: follow,
	})
	Ship.init()
}



function resize() {
	window.addEventListener('resize', () => {
		const width = window.innerWidth
		const height = window.innerHeight

		camera.aspect = width / height
		camera.updateProjectionMatrix()

		renderer.setSize(width, height)
		effect.setSize(width, height)
	})
}

function animate() {
	if (!gameStarted) return
	window.addEventListener( 'pointermove', onPointerMove );
	//console.log(scene.children)
	//console.log(meshes.group.children)
	//console.log(meshes.group.children.length)
	//console.log(shot)
	document.getElementById("score").textContent = "Score: " + score;
	document.getElementById("health").textContent = "Health: " + health;
	if(asciiEffectEnabled){
	document.getElementById("sneak").textContent = "Sneak Mode" ;}else{
	document.getElementById("sneak").textContent = "Combat Mode"
	}
	if(!shot && meshes.group.children.length > 9){
		meshes.group.children.splice(7, 1)
	} 
	const delta = clock.getDelta()
	lastTime += delta
	boost = 0.02
	meshes.default.rotation.x += 0.01
	meshes.default.rotation.z += 0.01
	meshes.default2.rotation.x += 0.01
	meshes.default2.rotation.z += 0.01
	for(let i = 0; i < meshes.asteroids.length; i++){
		meshes.asteroids[i].rotateY(0.001)
	}
	// meshes.default.scale.x += 0.01
	//
	// console.log(composer)
	// composer.composer.render()
	speedVertical = 0.0
	speedHorizontal = 0.0
	speedHorizontal2 = 0.0
	rotateHorizontal = 0.0
	rotateVertical = 0.0
	pointerSpd = 80.0
	var pspd2 = pointerSpd / 2
	speedVertical = pointer.y / 40
	rotateHorizontal = -pointer.x / pointerSpd
	//console.log(ammos)
	for (let i = ammos.length - 1; i >= 0; i--) {
		meshes.group.add(ammos[i])
        ammos[i].position.add(ammos[i].velocity);
        if (ammos[i].position.distanceTo(camera.position) > 100) {
			meshes.group.remove(ammos[i])
            scene.remove(ammos[i]);
            ammos.splice(i, 1);
        } else {
            const ammoBox = new THREE.Box3().setFromObject(ammos[i]);
            for (let j = meshes.asteroids.length - 1; j >= 0; j--) {
                const roidBox = new THREE.Box3().setFromObject(meshes.asteroids[j]);
                if (ammoBox.intersectsBox(roidBox)) {
					score += 10
					meshes.group.remove(ammos[i])
                    scene.remove(meshes.asteroids[j]);
                    meshes.asteroids.splice(j, 1);
                    scene.remove(ammos[i]);
                    ammos.splice(i, 1);
                    break;
                }
            }
        }
	}
	if (keys.e) {speedVertical = -0.03
		speedHorizontal = -0.01
		boost = 1}
	else if (keys.q) {speedVertical = 0.03
		speedHorizontal = 0.01
		boost = 1}

	if (keys.w) {speedHorizontal = -0.03
		boost = 0.1
	}
	else if (keys.s) {speedHorizontal = 0.03
		boost = 0.1
	}

	if (keys.d) {speedHorizontal2 = 0.05 
	rotateHorizontal = -0.01
	boost = 0.05
	}
	else if (keys.a) {speedHorizontal2 = -0.05
	rotateHorizontal = 0.01
	boost = 0.05
	}
	velocityVertical += (speedVertical - velocityVertical) * 0.5
	velocityHoriontal += (speedHorizontal - velocityHoriontal) * 0.5
	//if(keys.x){
		//state += 1
	//}
	//console.log(state)
	if(state == 0){
		asciiEffectEnabled = false
	}else if(state == 1){
		asciiEffectEnabled = true
	}
	if (asciiEffectEnabled) {
		renderer.clear()
		const elem = document.querySelector('canvas')
		elem.style.display = 'none'
		effect.render(scene, camera)
		velocityVertical += (speedVertical - velocityVertical) * 2
		velocityHoriontal += (speedHorizontal - velocityHoriontal) * 2
		pointerSpd = 120.0
	} else {
		renderer.clear()
		const elem = document.querySelector('canvas')
		elem.style.display = 'block'
		// renderer.render(scene, camera)
		composer.composer.render()
		velocityVertical += (speedVertical - velocityVertical) /2
		velocityHoriontal += (speedHorizontal - velocityHoriontal) /2
		pointerSpd = 80.0
	}
	meshes.flame1.rotateZ(-boost)
	meshes.flame2.rotateZ(boost)
	meshes.flame3.rotateX(boost/1.2)
	meshes.flame4.rotateX(-boost/1.2)
	
	if(score >= 300){
		win = true
	}
	if(win){
		alert('--CLEAR--\n'+ score + ' Points')
       	window.location.reload()
		win = false
	}
	if(lose){
		alert('Game Over\n'+ score + ' Points')
       	window.location.reload()
		lose = false
	}

	// controls.update()
	if (meshes.ship) {
		meshes.group.add(meshes.ship)
		meshes.group.translateZ(velocityHoriontal)
		meshes.group.translateY(velocityVertical)
		//meshes.ship.translateX(velocityHoriontal2)
		meshes.group.rotateY(rotateHorizontal)
		a.lerp(meshes.group.position, 0.02)
		b.copy(goal.position)

		dir.copy(a).sub(b).normalize()
		const dis = a.distanceTo(b) - coronaSafetyDistance
		goal.position.addScaledVector(dir, dis)
		goal.position.lerp(temp, 0.1)
		temp.setFromMatrixPosition(follow.matrixWorld)
		for(let i = 0; i < meshes.asteroids.length; i++){
			const shipBox = new THREE.Box3().setFromObject(meshes.ship)
			const roidBox = new THREE.Box3().setFromObject(meshes.asteroids[i])
			if(shipBox.intersectsBox(roidBox) && asciiEffectEnabled == false){
				meshes.group.position.set(0, 0, 0)
				health -= 10
     			if(health < 1) {
       				lose = true
				}
				break
			}
		}
		camera.lookAt(meshes.group.position)
	}
	requestAnimationFrame(animate)
}
