
import './style.css'

/*document.querySelector('#app').innerHTML = `
  <h1>Hello Vite!</h1>
  <a href="https://vitejs.dev/guide/features.html" target="_blank">Documentation</a>
`*/
//import * as THREE from 'three/build/three.module.js';
import { BufferGeometry, Line, LineBasicMaterial, PerspectiveCamera, Scene, Vector3, WebGLRenderer } from 'three';

let camera: { position: { set: (arg0: number, arg1: number, arg2: number) => void; }; lookAt: (arg0: number, arg1: number, arg2: number) => void; }, scene: { add: (arg0: any) => void; }, renderer: { setSize: (arg0: number, arg1: number) => void; render: (arg0: any, arg1: any) => void; setAnimationLoop: (arg0: (time: any) => void) => void; domElement: any; };
let geometry: any, material: any, line: any;

init();

function init() {

  camera = new PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 500 );
  camera.position.set( 0, 0, 100 );
  camera.lookAt( 0, 0, 0 );
	scene = new Scene();

  let points = [];
  points.push( new Vector3( - 10, 0, 0 ) );
  points.push( new Vector3( 0, 10, 0 ) );
  points.push( new Vector3( 10, 0, 0 ) );
  
  geometry = new BufferGeometry().setFromPoints( points );
  material = new LineBasicMaterial( { color: 0xffffff } );

  line = new Line( geometry, material );
	scene.add( line );

	renderer = new WebGLRenderer( { antialias: true } );
	renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.render( scene, camera );
	renderer.setAnimationLoop( animation );
	document.body.appendChild( renderer.domElement );

}

function animation( time: any ) {

	//mesh.rotation.x = time / 2000;
	//mesh.rotation.y = time / 1000;

	renderer.render( scene, camera );

}