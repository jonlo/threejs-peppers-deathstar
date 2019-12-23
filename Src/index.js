import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { PeppersGhostEffect } from 'three/examples/jsm/effects/PeppersGhostEffect.js';
var container;
var camera, scene, renderer, effect, model, light;
var mixer;
var clock = new THREE.Clock();
var currentModel;
var loader = new FBXLoader();

init();
animate();
function init() {
	container = document.createElement('div');
	document.body.appendChild(container);
	camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 100000);
	scene = new THREE.Scene();
	// Cube
	currentModel = 'tie';


	light = new THREE.DirectionalLight(0xffffff);
	light.position.set(0, 2, 1);
	light.castShadow = true;
	light.shadow.camera.top = 180;
	light.shadow.camera.bottom = - 100;
	light.shadow.camera.left = - 120;
	light.shadow.camera.right = 120;
	scene.add(light);
	light = new THREE.HemisphereLight(0xffffff, 0x444444, 2);
	light.position.set(0, 10, 0);
	scene.add(light);

	loader.load('./models/TieFighter.fbx', function (object) {
		mixer = new THREE.AnimationMixer(object);
		// var action = mixer.clipAction(object.animations[0]);
		// action.play();
		object.traverse(function (child) {
			if (child.isMesh) {
				child.castShadow = true;
				child.receiveShadow = true;
			}
		});
		model = object;
		model.scale.set(1 / 300, 1 / 300, 1 / 300);
		//deathStar.scale.set(1/200,1/200,1/200);
		scene.add(model);
	});


	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio(window.devicePixelRatio);
	container.appendChild(renderer.domElement);
	effect = new PeppersGhostEffect(renderer);
	effect.setSize(window.innerWidth, window.innerHeight);
	effect.cameraDistance = 5;
	window.addEventListener('resize', onWindowResize, false);

	document.addEventListener('keydown', (event) => {
		const keyName = event.key;
		if (keyName === 'Control') {
			// do not alert when only Control key is pressed.
			return;
		}
		if (event.ctrlKey && keyName === 'c') {
			toggleModel();
		}
	});
}

function toggleModel() {
	scene.remove(model);
	currentModel = currentModel === 'tie' ? 'death' : 'tie';
	switch (currentModel) {
		case 'tie':
			light.intensity = 2;
			loader.load('./models/TieFighter.fbx', function (object) {
				mixer = new THREE.AnimationMixer(object);
				// var action = mixer.clipAction(object.animations[0]);
				// action.play();
				object.traverse(function (child) {
					if (child.isMesh) {
						child.castShadow = true;
						child.receiveShadow = true;
					}
				});
				model = object;
				model.scale.set(1 / 300, 1 / 300, 1 / 300);
				//deathStar.scale.set(1/200,1/200,1/200);
				scene.add(model);
			});

			break;
		case 'death':
			light.intensity = 7;
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
				model = object;
				model.scale.set(1 / 200, 1 / 200, 1 / 200);
				scene.add(model);
			});

		default:
			break;
	}
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
	if (model && currentModel === 'tie') {
		model.rotation.y += 0.01;
	}
}