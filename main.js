import './style.css'
import * as THREE from 'three'
import { addBoilerPlateMesh, addBoilerPlateMesh2, addflame1, addflame2 } from './addMeshes'
import { addLight, addFlame } from './addLights'
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
camera.position.set(0, 2.0, 0)
var time = 0
var newPosition = new THREE.Vector3()
var matrix = new THREE.Matrix4()

var stop = 1
var DEGTORAD = 0.01745327
var temp = new THREE.Vector3()
var dir = new THREE.Vector3()
var a = new THREE.Vector3()
var b = new THREE.Vector3()
var coronaSafetyDistance = 5.5
var velocityVertical = 0.0
var velocityHoriontal = 0.0
var velocityHoriontal2 = 0.0
var speedVertical = 0.0
var speedHorizontal = 0.0
var speedHorizontal2 = 0.0
var rotateHorizontal = 0.0
var boost = 0.0
let goal, follow
const keys = {
	a: false,
	s: false,
	d: false,
	w: false,
	q: false,
	e: false,
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

//toggleButton.addEventListener('click', () => {
	//asciiEffectEnabled = !asciiEffectEnabled
	//effect.domElement.style.display = asciiEffectEnabled ? 'block' : 'none'
	//renderer.domElement.style.display = asciiEffectEnabled ? 'none' : 'block'
	// if (asciiEffectEnabled) {
	// 	controls = new OrbitControls(camera, effect.domElement)
	// } else {
	// 	controls = new OrbitControls(camera, renderer.domElement)
	// }
//})

// document.body.appendChild(renderer.domElement)
init()
function init() {
	const group1 = new THREE.Group()
	camera.lookAt(scene.position)
	const width = window.innerWidth
	const height = window.innerHeight
	renderer.setSize(width)
	renderer.setPixelRatio(window.devicePixelRatio)
	renderer.domElement.style.position = 'absolute'
	renderer.domElement.style.top = '0'
	renderer.domElement.style.left = '0'
	var gridHelper = new THREE.GridHelper( 400, 400 );
	//gridHelper.layers.set(1)
    //scene.add( gridHelper );
	//ASCII
	effect = new AsciiEffect(renderer, ' 0123456', { invert: true })
	effect.setSize(width, height)
	effect.domElement.style.color = '#03F614'
	effect.domElement.style.backgroundColor = 'black'
	effect.domElement.style.position = 'absolute'
	effect.domElement.style.top = '0'
	effect.domElement.style.left = '0'
	// controls = new OrbitControls(camera, effect.domElement)

	document.body.appendChild(renderer.domElement)
	document.body.appendChild(effect.domElement)

	//meshes
	meshes.default = addBoilerPlateMesh()
	meshes.default2 = addBoilerPlateMesh2()
	meshes.flame1 = addflame1()
	meshes.flame2 = addflame2()
	meshes.asteroids = addAsteroids()
	lights.defaultLight = addLight()
	lights.flame = addFlame()
	meshes.group = group1
	meshes.group.add(meshes.default)
	meshes.group.add(meshes.default2)
	meshes.group.add(lights.flame)
	meshes.group.add(meshes.flame1)
	meshes.group.add(meshes.flame2)
	//lights
	for(var i=0; i< 30; i++){
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
	for(var i=0; i< 30; i++){
		scene.add(meshes.asteroids[i])
	}
	scene.add(lights.defaultLight)
	keySetup()
	models()
	resize()
	animate()
}

function keySetup() {
	window.addEventListener('keydown', (e) => {
		if (keys[e.key] !== undefined) keys[e.key] = true
		console.log(keys)
	})
	window.addEventListener('keyup', (e) => {
		if (keys[e.key] !== undefined) keys[e.key] = false
	})
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
	const hitboxShip = new THREE.Box3()
	Ship.hitbox = hitboxShip
	Ship.
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
	boost = 0.02
	const delta = clock.getDelta()
	meshes.default.rotation.x += 0.01
	meshes.default.rotation.z += 0.01
	meshes.default2.rotation.x += 0.01
	meshes.default2.rotation.z += 0.01
	for(var i=0; i< 30; i++){
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
	velocityHoriontal2 += (speedHorizontal2 - velocityHoriontal2) * 0.5
	if (asciiEffectEnabled) {
		renderer.clear()

		effect.render(scene, camera)
	} else {
		renderer.clear()
		// renderer.render(scene, camera)
		composer.composer.render()
	}
	meshes.flame1.rotateZ(-boost)
	meshes.flame2.rotateZ(boost)
	

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
		for(var i=0; i< 30; i++){
		if(meshes.ship.hitbox.intersectsBox(meshes.asteroids[i])){
			meshes.asteroids[i].position.set(Math.random() * 30, Math.random() * 30, camera.position.z * 30)
			console.log('collied')
		}
	}
		camera.lookAt(meshes.group.position)
	}
	requestAnimationFrame(animate)
}
