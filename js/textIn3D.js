/**
 * Referance: https://threejs.org/examples/#css3d_periodictable
 * Database: The Museum of Modern Art (MoMA) Collection https://github.com/MuseumofModernArt/collection
 * Goal: Visualize text in 3D
 */

let camera, scene, renderer;
let container, stats, controls;

let init = () => {

    // set up container
    container = document.createElement( "div" );
    document.body.appendChild( container );

    // set up performance monitor using stats.js
    stats = new Stats();
    container.appendChild(stats.dom);

    // set up the scene (CSS3D doesn't need lighting)
    camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.set(0, 0, 3000);

    scene = new THREE.Scene();
    
    // Use CSS3D renderer
    renderer = new THREE.CSS3DRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );

    // set up group 
    let group = new THREE.Group();

    // data display
    JSONProcessor("../../data/Artists.json").then(data => {

        let maleCount = 0;
        
        //choose a random start point
        let randomSeed = Math.floor( Math.random() * (data.length - 900) )

        for ( let i = randomSeed; i < randomSeed+900; i++ ) {

            //create textContainer
            let textContainer = document.createElement( 'div' );
            if( data[i].Gender == "Female" ){
                
                textContainer.style.backgroundColor = `rgba(255,100,100, ${Math.random() * 0.5 + 0.25 })`;
                textContainer.className = 'textContainer female';
            
            }else{
                textContainer.style.backgroundColor = `rgba(100,100,255, ${Math.random() * 0.5 + 0.25 })`;
                textContainer.className = 'textContainer male';
                maleCount++;

            }

            //create children elements
            let name = document.createElement( 'div' );
            let a = document.createElement( 'A' );
            let t = document.createTextNode( data[i].DisplayName );
            a.setAttribute( 'href', `https://www.google.com/search?q=${data[i].DisplayName}` );
            a.setAttribute( 'target', `_blank` );

            a.appendChild( t )
            name.appendChild( a );
            name.className = 'name';
            // name.innerHTML = data[i].DisplayName;
            textContainer.appendChild( name );

            let details = document.createElement( 'div' );
            details.className = 'details';
            details.innerHTML = `${data[i].ArtistBio} <br>${data[i].Nationality}`;
            details.style.display = 'none';
            textContainer.appendChild( details ); //end of container
            
            //create CSS3D object
            let object = new THREE.CSS3DObject( textContainer );
            object.position.x = ( ( ( i - randomSeed ) % 15 ) * 200 ) - 1400;
            object.position.y = ( - ( Math.floor( ( i -randomSeed ) / 15 ) % 15 ) * 200 ) + 1400;
            object.position.z = ( Math.floor( ( i -randomSeed ) / 225 ) ) * 200 - 500;
            group.add( object )
            
      }; // end of loop

      group.rotation.y = Math.PI/10;

      //background color changes depends on the ratio
      document.body.style.backgroundColor = `rgb( ${ ( 900-maleCount ) / 900 * 255 }, 0, ${ ( maleCount ) / 900 * 255 } )`
    
    }); // end of data display


    // // set up 3D objects  
    // var geometry = new THREE.BufferGeometry();
    // var vertices = [];
    // var sprite = new THREE.TextureLoader().load("../../data/disc.png");
    // for (var i = 0; i < 10000; i++) {
    //     var x = 2000 * Math.random() - 1000;
    //     var y = 2000 * Math.random() - 1000;
    //     var z = 2000 * Math.random() - 1000;
    //     vertices.push(x, y, z);
    // }
    // geometry.addAttribute(
    //     "position",
    //     new THREE.Float32BufferAttribute(vertices, 3)
    // );
    // material = new THREE.PointsMaterial({
    //     size: 35,
    //     sizeAttenuation: false,
    //     map: sprite,
    //     alphaTest: 0.5,
    //     transparent: true
    // });
    // material.color.setHSL(1.0, 0.3, 0.7);
    // var particles = new THREE.Points(geometry, material);
    // scene.add(particles);
    
    // add data(CSS3D objects group to the scene)
    scene.add(group);

    //set up trackball controls
    controls = new THREE.TrackballControls( camera, renderer.domElement );
    controls.rotateSpeed = 0.5;
    controls.minDistance = 50;
	controls.maxDistance = 6000;
    controls.addEventListener( 'change', render );
    
    //responsive
    window.addEventListener( 'resize', onWindowResize, false );
};


let render = () => {
  
    renderer.render( scene, camera );
    stats.update();

};


let animate = () => {

    requestAnimationFrame( animate );
    render();
    controls.update();

};


let onWindowResize = () => {
    // windowHalfX = window.innerWidth / 2;
    camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
	render();

}


// data processor
let JSONProcessor = url => {
    
    const JSONProcessor = new Promise( (resolve, reject) => {
    
        let JSONloader = new THREE.FileLoader();
        JSONloader.load(url, data => {
        resolve(JSON.parse(data));
    
    });
  
});

    return JSONProcessor;

};


window.onload = () => {
    
    init();
    animate();

};
