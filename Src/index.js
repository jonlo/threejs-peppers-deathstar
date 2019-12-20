import * as THREE from 'three';
import { WEBGL } from 'three/examples/jsm/WebGL.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { PeppersGhostEffect } from 'three/examples/jsm/effects/PeppersGhostEffect.js';

if (WEBGL.isWebGL2Available() === false) {
	document.body.appendChild(WEBGL.getWebGL2ErrorMessage());
} else {
	init();
}
var camera, scene, renderer, controls, container, effect;


function init() {
	container = document.createElement( 'div' );
	document.body.appendChild( container );
	camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 100000 );
	scene = new THREE.Scene();

	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio( window.devicePixelRatio );
	container.appendChild( renderer.domElement );
	effect = new PeppersGhostEffect( renderer );
	effect.setSize( window.innerWidth, window.innerHeight );
	effect.cameraDistance = 5;
	window.addEventListener( 'resize', onWindowResize, false );


	var ambientLight = new THREE.AmbientLight(0xcccccc, 0.4);
	scene.add(ambientLight);
	var directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
	directionalLight.position.set(1, 1, 0).normalize();
	scene.add(directionalLight);
	//

	controls = new OrbitControls(camera, renderer.domElement);
	controls.update();


	var loader = new FBXLoader();
	loader.load( './models/death.fbx', function ( object ) {
		object.traverse( function ( child ) {
			if ( child.isMesh ) {
				child.castShadow = true;
				child.receiveShadow = true;
			}
		} );
		scene.add( object );
	} );

	animate();


}

function onWindowResize() {
	camera.aspect = container.offsetWidth / container.offsetHeight;
	camera.updateProjectionMatrix();
	effect.setSize( window.innerWidth, window.innerHeight );

}

function animate() {
	requestAnimationFrame(animate);
	controls.update()
	effect.render( scene, camera );
}
