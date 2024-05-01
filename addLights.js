import * as THREE from 'three'

export function addLight() {
	const light = new THREE.DirectionalLight(0xffffff, 1)
	light.position.set(1, 1, 1)
	return light
}

export function addFlame() {
	const flame = new THREE.PointLight(0xffffff, 1)
	flame.position.set(-2, 0, 0)
	return flame
}