import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { PeppersGhostEffect } from 'three/examples/jsm/effects/PeppersGhostEffect.js';
var container;
var camera, scene, renderer, effect, deathStar, light;
var mixer;
var clock = new THREE.Clock();

init();
animate();
function init() {
	container = document.createElement('div');
	document.body.appendChild(container);
	camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 100000);
	scene = new THREE.Scene();
	// Cube


	light = new THREE.HemisphereLight(0xffffff, 0x444444,3);
	light.position.set(0, 200, 0);
	scene.add(light);
	light = new THREE.DirectionalLight(0xffffff);
	light.position.set(0, 200, 100);
	light.castShadow = true;
	light.shadow.camera.top = 180;
	light.shadow.camera.bottom = - 100;
	light.shadow.camera.left = - 120;
	light.shadow.camera.right = 120;
	
	scene.add(light);

	var loader = new FBXLoader();
	loader.load('./models/death.fbx', function (object) {
		mixer = new THREE.AnimationMixer(object);
		var action = mixer.clipAction(object.animations[0]);
		action.play();
		object.traverse(function (child) {
			if (child.isMesh) {
				child.castShadow = true;
				child.receiveShadow = true;
			}
		});
		deathStar = object;
		deathStar.scale.set(1/200,1/200,1/200);
		scene.add(deathStar);
	});
	

	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio(window.devicePixelRatio);
	container.appendChild(renderer.domElement);
	effect = new PeppersGhostEffect(renderer);
	effect.setSize(window.innerWidth, window.innerHeight);
	effect.cameraDistance = 5;
	window.addEventListener('resize', onWindowResize, false);
}
function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	effect.setSize(window.innerWidth, window.innerHeight);
}
function animate() {
	requestAnimationFrame(animate);
	var delta = clock.getDelta();
	if (mixer) mixer.update(delta);
	effect.render(scene, camera);

}