console.log("3d")
/**
 * referance: https://threejs.org/examples/?q=control#misc_controls_map
 */
let camera, scene, renderer;
let container, stats, controls;

let init = () => {
  
    // set up container
    container = document.createElement("div");
    document.body.appendChild(container);

    // set up performance monitor
    stats = new Stats();
    container.appendChild(stats.dom);
    
    // set up scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xcccccc );

    camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 1800 );
    camera.position.set( 400, 200, 0 );    


    let directionalLight = new THREE.DirectionalLight( 0xffffff, 0.125 );
    directionalLight.position.x = Math.random() - 0.5;
    directionalLight.position.y = Math.random() - 0.5;
    directionalLight.position.z = Math.random() - 0.5;
    directionalLight.position.normalize();
    scene.add( directionalLight );
    
    let AmbientLight = new THREE.AmbientLight(0x404040);
    scene.add(AmbientLight);
    
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

  	// set up map controls. Space Panning is very nice for data viz.
    controls = new THREE.MapControls( camera, renderer.domElement );
    controls.addEventListener( 'change', render ); // call this only in static scenes (i.e., if there is no animation loop)
    controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
    controls.dampingFactor = 0.25;
    controls.screenSpacePanning = true; // here
    controls.minDistance = 100;
    controls.maxDistance = 800;
    controls.maxPolarAngle = Math.PI / 2;

    // set up 3D objects
    // ground with grid
    let gridHelper = new THREE.GridHelper( 1620, 81 );
    scene.add( gridHelper );

    let planeGeo = new THREE.PlaneBufferGeometry( 1620, 1620, 1 );
    let planeMesh = new THREE.Mesh( planeGeo,  new THREE.MeshBasicMaterial( { visible: false } ) );
    planeMesh.rotation.x = Math.PI / 2;
    scene.add( planeMesh );

    // bar objects
    
    // bar unit
    let barGeo = new THREE.BoxBufferGeometry( 1, 1, 1 );
    barGeo.translate( 0, 0.5, 0 ); //center the the bar at Y axis, so it raise from the ground
    let barMat = new THREE.MeshLambertMaterial( { color: 0xffffff } );

    // transform unit based on the database
    for ( let i = 0; i < 500; i ++ ) {

        let data = {
          "posX": Math.floor( (Math.random() * 1600 - 800) / 20 ) * 20,
          "posY": Math.floor( (Math.random() * 1600 - 800) / 20 ) * 20,
          "mag":Math.random() * 80 + 10,
          "d":20
        }
        let barMesh = new THREE.Mesh( barGeo, barMat );
        barMesh.position.x = data.posX;
        barMesh.position.y = 0;
        barMesh.position.z = data.posY;
        barMesh.scale.x = data.d;
        barMesh.scale.y = data.mag;
        barMesh.scale.z = data.d;
        barMesh.updateMatrix();
        barMesh.matrixAutoUpdate = false;
        scene.add( barMesh );

    }

    //responsive
    window.addEventListener( 'resize', onWindowResize, false );

};


let animate = () => {
  
    requestAnimationFrame(animate);
    render();

};


let onWindowResize = () => {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
    render();

}

let render = () => {

  renderer.render(scene, camera);
  stats.update();

};


window.onload = () => {
  init();
  animate();
};
