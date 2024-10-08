import * as THREE from 'three'
import { MeshSurfaceSampler } from 'three/examples/jsm/Addons.js'

const textureLoader = new THREE.TextureLoader()

export function addBoilerPlateMesh() {
	const box = new THREE.SphereGeometry(0.065)
	const boxMaterial = new THREE.MeshPhysicalMaterial({ 
		color: 0x00ffff,
		emissive:0xa9fef9 })
	const boxMesh = new THREE.Mesh(box, boxMaterial)
	boxMesh.position.set(1.12, -0.1, 2)
	return boxMesh
}
export function addBoilerPlateMesh2() {
	const box = new THREE.SphereGeometry(0.065)
	const boxMaterial = new THREE.MeshPhysicalMaterial({ 
		color: 0x00ffff,
		emissive:0xa9fef9 })
	const boxMesh = new THREE.Mesh(box, boxMaterial)
	boxMesh.position.set(-1.12, -0.1, 2)
	return boxMesh
}

export function addflame1() {
	const box = new THREE.SphereGeometry(0.2, 100, 5)
	const material = new THREE.MeshLambertMaterial({
		color: 0x004444,
		transparent: true,
		emissive:0xa9fef9,
		opacity: 0.5,})
	const mesh = new THREE.Mesh(box, material)
	const edges = new THREE.EdgesGeometry(mesh.geometry, -10)
	const edgesMaterial = new THREE.LineBasicMaterial({
	color: 0x00ffff,
	})
	const line = new THREE.LineSegments(edges, edgesMaterial)
	mesh.add(line)
	mesh.position.set(1.12, -0.1, 2)
	mesh.rotation.x = 0.2
	mesh.rotation.z = -0.25
	return mesh
}
export function addflame2() {
	const box = new THREE.SphereGeometry(0.2, 100, 5)
	const material = new THREE.MeshLambertMaterial({
		color: 0x004444,
		transparent: true,
		emissive:0xa9fef9,
		opacity: 0.5,})
	const mesh = new THREE.Mesh(box, material)
	const edges = new THREE.EdgesGeometry(mesh.geometry, -10)
	const edgesMaterial = new THREE.LineBasicMaterial({
	color: 0x00ffff,
	})
	const line = new THREE.LineSegments(edges, edgesMaterial)
	mesh.add(line)
	mesh.position.set(-1.12, -0.1, 2)
	mesh.rotation.y = 0.2
	mesh.rotation.z = 0.25
	return mesh
}

export function addflame3() {
	const box = new THREE.SphereGeometry(0.25, 100, 5)
	const material = new THREE.MeshLambertMaterial({
		color: 0x004444,
		transparent: true,
		opacity: 0.5,})
	const mesh = new THREE.Mesh(box, material)
	const edges = new THREE.EdgesGeometry(mesh.geometry, -10)
	const edgesMaterial = new THREE.LineBasicMaterial({
	color: 0x66ffff,
	})
	const line = new THREE.LineSegments(edges, edgesMaterial)
	mesh.add(line)
	mesh.position.set(1.12, -0.1, 2)
	mesh.rotation.y = 0.2
	mesh.rotation.z = 0.25
	return mesh
}
export function addflame4() {
	const box = new THREE.SphereGeometry(0.25, 100, 5)
	const material = new THREE.MeshLambertMaterial({
		color: 0x004444,
		transparent: true,
		opacity: 0.5,})
	const mesh = new THREE.Mesh(box, material)
	const edges = new THREE.EdgesGeometry(mesh.geometry, -10)
	const edgesMaterial = new THREE.LineBasicMaterial({
	color: 0x66ffff,
	})
	const line = new THREE.LineSegments(edges, edgesMaterial)
	mesh.add(line)
	mesh.position.set(-1.12, -0.1, 2)
	mesh.rotation.y = 0.2
	mesh.rotation.z = 0.25
	return mesh
}


export function aimpoint(){
	const geometry = new THREE.SphereGeometry(0.5, 100, 5)
	const material = new THREE.MeshLambertMaterial({
			color: 0x84ffff,
			transparent: true,
			opacity: 0,		
		})
	const mesh = new THREE.Mesh(geometry, material)
	const edges = new THREE.EdgesGeometry(mesh.geometry, -10)
	const edgesMaterial = new THREE.LineBasicMaterial({
	color: 0x00ffff,
	})
	const line = new THREE.LineSegments(edges, edgesMaterial)
	mesh.add(line)
	mesh.position.set(0, 0, -20)
	mesh.rotation.x = 1.5 
	mesh.rotation.z = 0
	return mesh
}

export function addStandardMesh() {
	const box = new THREE.BoxGeometry(1, 1,1)
	const boxMaterial = new THREE.MeshPhysicalMaterial({ 
		color: 0xa9fef9,
		emissive:0xffffff })
	const boxMesh = new THREE.Mesh(box, boxMaterial)
	boxMesh.position.set(-2, 0, 0)
	return boxMesh
}

export function addAsteroids() {
	var asteroids = []
	var max = 30
	var min = -30
	for(var i=0; i< 30; i++) {
	const geometry = new THREE.SphereGeometry( 1, 20, 10 )
	const material = new THREE.MeshLambertMaterial({
		color: 0x004444,
		transparent: true,
		opacity: 0.5,})
	const mesh = new THREE.Mesh(geometry, material)
	const edges = new THREE.EdgesGeometry(mesh.geometry, -10)
	const edgesMaterial = new THREE.LineBasicMaterial({
	color: 0x00ffff,
	})
	const line = new THREE.LineSegments(edges, edgesMaterial)
	mesh.add(line)
	mesh.velocity = Math.random() * 2 + 2
	mesh.vRotation = new THREE.Vector3(Math.random(), Math.random(), Math.random())
	mesh.position.set(Math.floor(Math.random() * (max - min + 1)) + min + 5, Math.floor(Math.random() * (max - min + 1)) + min + 5, Math.floor(Math.random() * (max - min + 1)) + min + 5)
	if(mesh.position.x < 3 && mesh.position.x > -3 || mesh.position.y < 3 && mesh.position.y > -3 || mesh.position.z < 3 && mesh.position.z > -3){
		mesh.position.set(Math.floor(Math.random() * (max - min + 1)) + min + 10, Math.floor(Math.random() * (max - min + 1)) + min + 10, Math.floor(Math.random() * (max - min + 1)) + min + 10)
	}else if(mesh.position.x < 3 && mesh.position.x > -3 || mesh.position.y < 3 && mesh.position.y > -3 || mesh.position.z < 3 && mesh.position.z > -3){
		mesh.position.set(Math.floor(Math.random() * (max - min + 1)) + max + 10, Math.floor(Math.random() * (max - min + 1)) + max + 10, Math.floor(Math.random() * (max - min + 1)) + max + 10)
	}
	asteroids.push(mesh)
	}
	return asteroids
}