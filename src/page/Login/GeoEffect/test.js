

			import * as THREE from 'three';

			import Stats from 'three/examples/jsm/libs/stats.module.js';

			import { GUI } from 'three/examples/jsm/libs/dat.gui.module.js';
			import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
			import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js';
			import { Wireframe } from 'three/examples/jsm/lines/Wireframe.js';
			import { WireframeGeometry2 } from 'three/examples/jsm/lines/WireframeGeometry2.js';

			var wireframe, renderer, scene, camera, camera2, controls;
			var wireframe1;
			var matLine, matLineBasic, matLineDashed;
			var stats;
			var gui;

			// viewport
			var insetWidth;
			var insetHeight;

			init();
			animate();

			function init() {

				renderer = new THREE.WebGLRenderer( { antialias: true } );
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setClearColor( 0x000000, 0.0 );
				renderer.setSize( window.innerWidth, window.innerHeight );
				document.body.appendChild( renderer.domElement );

				scene = new THREE.Scene();

				camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 1000 );
				camera.position.set( - 50, 0, 50 );

				// camera2 = new THREE.PerspectiveCamera( 40, 1, 1, 1000 );
				// camera2.position.copy( camera.position );

				controls = new OrbitControls( camera, renderer.domElement );
				// controls.minDistance = 10;
				// controls.maxDistance = 500;


				// Wireframe ( WireframeGeometry2, LineMaterial )

				var geo = new THREE.IcosahedronBufferGeometry( 20, 1 );

				var geometry = new WireframeGeometry2( geo );

				matLine = new LineMaterial( {

					color: 0xffbb22,
					linewidth: 3, // in pixels
					//resolution:  // to be set by renderer, eventually
					dashed: false

				} );

				wireframe = new Wireframe( geometry, matLine );
				wireframe.computeLineDistances();
				wireframe.scale.set( 1, 1, 1 );
        scene.add( wireframe );
        console.log(wireframe)
				// Line ( THREE.WireframeGeometry, THREE.LineBasicMaterial ) - rendered with gl.LINE

				// geo = new THREE.WireframeGeometry( geo );

				// matLineBasic = new THREE.LineBasicMaterial( { color: 0x4080ff } );
				// matLineDashed = new THREE.LineDashedMaterial( { scale: 2, dashSize: 1, gapSize: 1 } );

				// wireframe1 = new THREE.LineSegments( geo, matLineBasic );
				// wireframe1.computeLineDistances();
				// wireframe1.visible = false;
				// scene.add( wireframe1 );

				//

				window.addEventListener( 'resize', onWindowResize, false );
				onWindowResize();

				// stats = new Stats();
				// document.body.appendChild( stats.dom );

				// initGui();

			}

			function onWindowResize() {

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();

				renderer.setSize( window.innerWidth, window.innerHeight );

				insetWidth = window.innerHeight / 4; // square
				insetHeight = window.innerHeight / 4;

				// camera2.aspect = insetWidth / insetHeight;
				// camera2.updateProjectionMatrix();

			}

			function animate() {

				requestAnimationFrame( animate );

				// stats.update();

				// main scene

				renderer.setClearColor( 0x000000, 0 );

				renderer.setViewport( 0, 0, window.innerWidth, window.innerHeight );

        // renderer will set this eventually
        
        wireframe.rotation.x += 0.005
        wireframe.rotation.y += 0.005
				matLine.resolution.set( window.innerWidth, window.innerHeight ); // resolution of the viewport

				renderer.render( scene, camera );

				// inset scene

				renderer.setClearColor( 0x222222, 1 );

				renderer.clearDepth(); // important!

				renderer.setScissorTest( true );

				renderer.setScissor( 20, 20, insetWidth, insetHeight );

				renderer.setViewport( 20, 20, insetWidth, insetHeight );

				// camera2.position.copy( camera.position );
				// camera2.quaternion.copy( camera.quaternion );

				// renderer will set this eventually
				matLine.resolution.set( insetWidth, insetHeight ); // resolution of the inset viewport

				// renderer.render( scene, camera2 );

				renderer.setScissorTest( false );

			}

			//

			function initGui() {

				gui = new GUI();

				var param = {
					'line type': 0,
					'width (px)': 5,
					'dashed': false,
					'dash scale': 1,
					'dash / gap': 1
				};


				gui.add( param, 'line type', { 'LineGeometry': 0, 'gl.LINE': 1 } ).onChange( function ( val ) {

					switch ( val ) {

						case '0':
							wireframe.visible = true;

							wireframe1.visible = false;

							break;

						case '1':
							wireframe.visible = false;

							wireframe1.visible = true;

							break;

					}

				} );

				gui.add( param, 'width (px)', 1, 10 ).onChange( function ( val ) {

					matLine.linewidth = val;

				} );

				gui.add( param, 'dashed' ).onChange( function ( val ) {

					matLine.dashed = val;

					// dashed is implemented as a defines -- not as a uniform. this could be changed.
					// ... or THREE.LineDashedMaterial could be implemented as a separate material
					// temporary hack - renderer should do this eventually
					if ( val ) matLine.defines.USE_DASH = ""; else delete matLine.defines.USE_DASH;
					matLine.needsUpdate = true;

					wireframe1.material = val ? matLineDashed : matLineBasic;

				} );

				gui.add( param, 'dash scale', 0.5, 1, 0.1 ).onChange( function ( val ) {

					matLine.dashScale = val;
					matLineDashed.scale = val;

				} );

				gui.add( param, 'dash / gap', { '2 : 1': 0, '1 : 1': 1, '1 : 2': 2 } ).onChange( function ( val ) {

					switch ( val ) {

						case '0':
							matLine.dashSize = 2;
							matLine.gapSize = 1;

							matLineDashed.dashSize = 2;
							matLineDashed.gapSize = 1;

							break;

						case '1':
							matLine.dashSize = 1;
							matLine.gapSize = 1;

							matLineDashed.dashSize = 1;
							matLineDashed.gapSize = 1;

							break;

						case '2':
							matLine.dashSize = 1;
							matLine.gapSize = 2;

							matLineDashed.dashSize = 1;
							matLineDashed.gapSize = 2;

							break;

					}

				} );

			}

		