function OBJViewerEnable(classname){
	var models=document.getElementsByClassName(classname);
	for(var i=0;i<models.length;i++){
		OBJViewer(models[i],models[i].getAttribute("data-src"),models[i].getAttribute("mtl-src"));
	}
}

function OBJViewer(elem,model,mtlsrc){
	if(!WEBGL.isWebGLAvailable()){
		elem.appendChild(WEBGL.getWebGLErrorMessage());
		return;
	}
	var renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});
	var camera=new THREE.PerspectiveCamera(50,elem.clientWidth/elem.clientHeight,1,1000);
	renderer.setSize(elem.clientWidth,elem.clientHeight);
	elem.appendChild(renderer.domElement);
	window.addEventListener('resize',function(){renderer.setSize(elem.clientWidth,elem.clientHeight);camera.aspect=elem.clientWidth/elem.clientHeight;camera.updateProjectionMatrix();},false);
	var controls=new THREE.OrbitControls(camera,renderer.domElement);
	controls.enableDamping=true;
	controls.rotateSpeed=0.05;
	controls.dampingFactor=0.1;
	controls.enableZoom=false;
	controls.enablePan=false;
	controls.autoRotate=true;
	controls.autoRotateSpeed=0.75;
	
	// Create Scene and Lighting
	var scene=new THREE.Scene();
	scene.add(new THREE.HemisphereLight(0xffffff,0x080820,1.5));
	
	// Load MTL file
	new THREE.MTLLoader().load(mtlsrc, function ( materials ) {

		materials.preload();
		// Load OBJ File (using loaded MTL file materials)
		
		new THREE.OBJLoader()
			.setMaterials( materials )
			.load(model, function ( object ) {

				object.position.y = - 0.95;
				object.scale.setScalar( 0.01 );
				scene.add( object );
				controls.update();
	
		
			}, onProgress );
			
		} );


				//

	window.addEventListener( 'resize', onWindowResize );
	animate();

}

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

window.onload=function(){OBJViewerEnable("objviewer");}