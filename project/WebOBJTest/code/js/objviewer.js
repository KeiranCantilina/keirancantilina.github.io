// Written by Keiran Cantilina 
// 2023-10-25

import { MTLLoader } from './mtlloader.js'

let camera, scene, renderer;

// Interface with html
function OBJViewerEnable(classname){
	var models=document.getElementsByClassName(classname);
	for(var i=0;i<models.length;i++){
		OBJViewer(models[i],models[i].getAttribute("data-src"),models[i].getAttribute("mtl-src"));
	}
}

var WEBGL={isWebGLAvailable:function(){try{var canvas=document.createElement('canvas');return!!(window.WebGLRenderingContext&&(canvas.getContext('webgl')||canvas.getContext('experimental-webgl')));}catch(e){return false;}},isWebGL2Available:function(){try{var canvas=document.createElement('canvas');return!!(window.WebGL2RenderingContext&&canvas.getContext('webgl2'));}catch(e){return false;}},getWebGLErrorMessage:function(){return this.getErrorMessage(1);},getWebGL2ErrorMessage:function(){return this.getErrorMessage(2);},getErrorMessage:function(version){var names={1:'WebGL',2:'WebGL 2'};var contexts={1:window.WebGLRenderingContext,2:window.WebGL2RenderingContext};var message='Your $0 does not seem to support <a href="http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation" style="color:#000">$1</a>';var element=document.createElement('div');element.id='webglmessage';element.style.fontFamily='monospace';element.style.fontSize='13px';element.style.fontWeight='normal';element.style.textAlign='center';element.style.background='#fff';element.style.color='#000';element.style.padding='1.5em';element.style.width='400px';element.style.margin='5em auto 0';if(contexts[version]){message=message.replace('$0','graphics card');}else{message=message.replace('$0','browser');}
message=message.replace('$1',names[version]);element.innerHTML=message;return element;}};



function OBJViewer(elem,model,mtlsrc){
	
	// Throw error message if no webgl
	if(!WEBGL.isWebGLAvailable()){
		elem.appendChild(WEBGL.getWebGLErrorMessage());
		return;
	}
	
	// Make camera and configure
	
	var camera=new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 20 );
	camera.position.z = 2.5;
	
	// Create Scene and Lighting
	var scene=new THREE.Scene();
	camera.add(new THREE.HemisphereLight(0xffffff,0x080820,1.5));
	scene.add( camera );
	
	// Load MTL file
	new MTLLoader().load(mtlsrc, function ( materials ) {

		materials.preload();
		
		// Load OBJ File (using loaded MTL file materials)
		new THREE.OBJLoader()
			.setMaterials( materials )
			.load(model, function ( object ) {
				
				// Position object and add to scene
				object.position.y = - 0.95;
				object.scale.setScalar( 0.01 );
				scene.add( object );
				controls.update();
	
		
			}, onProgress );
			
		} );

	// Create renderer and config controls
	renderer = new THREE.WebGLRenderer( { antialias: true, alpha:true} );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );
				//
	const controls = new  THREE.OrbitControls( camera, renderer.domElement);
	controls.enableDamping=true;
	controls.rotateSpeed=0.05;
	controls.dampingFactor=0.1;
	controls.enableZoom=true;
	controls.enablePan=true;
	controls.autoRotate=true;
	controls.autoRotateSpeed=0.75;
				

	// Make sure we resize with window resizing
	window.addEventListener( 'resize', onWindowResize );
	
	// Spinny time
	animate();

}

// Window resize function
function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

}

			//

function animate() {

	requestAnimationFrame( animate );
	renderer.render( scene, camera );

}

// Make sure we run when the window loads
window.onload=function(){OBJViewerEnable("objviewer");}