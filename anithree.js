var renderer, scene, camera;
var controls, camera_control, axes;
var sphere1, sphere2;
var plane;

var t=0; // time
var angle;
var f_i=10;
var time_speed=1;
var old_major_ax;

//Constants
m_sun=2*Math.pow(10,33);
c=3*Math.pow(10,10);
G=6.67*Math.pow(10,-8);

init();
animate();


function init() {

	// info
	info=document.getElementById('space2');
	//info = document.createElement('space2');
	//info.style.position = 'absolute';
	//info.style.top = '30px';
	info.style.width = '100%';
	info.style.height = '100%';
	//info.style.textAlign = 'center';
	//info.style.color = '#fff';
	//info.style.fontWeight = 'bold';
	//info.style.backgroundColor = 'transparent';
	//info.style.zIndex = '1';
	//info.style.fontFamily = 'Monospace';
	//info.innerHTML = 'Drag mouse to rotate camera; Scroll to zoom';
	//document.body.appendChild(info);

	// WebGL renderer
	renderer = new THREE.WebGLRenderer();
	// Attach the rendering to html
	renderer.setSize(window.innerWidth/1.5, window.innerHeight/1.7);
	info.appendChild(renderer.domElement);

	// SCENE
	scene = new THREE.Scene();

	// CAMERA
	camera = new THREE.PerspectiveCamera( 45, window.innerWidth/window.innerHeight, 1, 10000 );
	camera.position.set( 30, 30, 80 );
	camera.lookAt( new THREE.Vector3( 0, 0, 0 ) );

	// CAMERA CONTROLS
	camera_control = new THREE.OrbitControls(camera);
	camera_control.minDistance = 5;
	camera_control.maxDistance = 800;

	// GUI
	controls = new function(){
		this.Mass1=40;
		this.Mass2=40;
		this.time_speed=0.1;
		this.howSlow=1;
		this.initialFreq=20;
	};

	var gui = new dat.GUI();
	gui.add(controls, 'Mass1',1,100);
	gui.add(controls, 'Mass2',1,100);
	gui.add(controls, 'time_speed',0.01,1);
	howSlow_control=gui.add(controls, 'howSlow',1,10);
	gui.add(controls, 'initialFreq', 5,50).listen();

	// AXES
	axes = buildAxes(100);
	scene.add(axes);

	// SPHERE
	var geometry = new THREE.SphereGeometry(1, 20, 20, 1, Math.PI * 2, 0, Math.PI * 2);
	var material = new THREE.MeshNormalMaterial();
	sphere1 = new THREE.Mesh( geometry, material);
	sphere2 = new THREE.Mesh( geometry, material);
	scene.add(sphere1);
	scene.add(sphere2);

	// PLANE
	var planeGeometry = new THREE.PlaneGeometry(800, 800, 300, 300);
	var planeMaterial = new THREE.MeshNormalMaterial({color: 0x45BEBF, wireframe: true});
	plane = new THREE.Mesh(planeGeometry, planeMaterial);
	plane.rotation.x = 0.5*Math.PI;
	plane.position.set(0, 0, 0);
	scene.add(plane);

	// BACKGROUND
	var pano;
	var loader = new THREE.TextureLoader();
	loader.load('images/equirectangular-galaxy.png', onTextureLoaded);
	function onTextureLoaded(texture) {
	  var geometry = new THREE.SphereGeometry(1000, 32, 32);
	  var material = new THREE.MeshBasicMaterial({
	    map: texture,
	    side: THREE.BackSide
	  });
	  pano = new THREE.Mesh(geometry, material);
	  pano.position.y = 0;
	  scene.add(pano);
	}

	function buildAxes(length) {
		var axes = new THREE.Object3D();

		axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( length, 0, 0 ), 0xFF0000, false ) ); // +X
		axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( -length, 0, 0 ), 0xFF0000, true) ); // -X
		axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, length, 0 ), 0x00FF00, false ) ); // +Y
		axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, -length, 0 ), 0x00FF00, true ) ); // -Y
		axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 0, length ), 0x0000FF, false ) ); // +Z
		axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 0, -length ), 0x0000FF, true ) ); // -Z

		return axes;

	}

	function buildAxis( src, dst, colorHex, dashed ) {
		var geom = new THREE.Geometry(),
			mat;

		if(dashed) {
			mat = new THREE.LineDashedMaterial({ linewidth: 3, color: colorHex, dashSize: 3, gapSize: 3 });
		} else {
			mat = new THREE.LineBasicMaterial({ linewidth: 3, color: colorHex });
		}

		geom.vertices.push( src.clone() );
		geom.vertices.push( dst.clone() );
		geom.computeLineDistances(); // important

		var axis = new THREE.Line( geom, mat, THREE.LineSegments );

		return axis;
	}
}

function animate(time) {
	requestAnimationFrame(animate);
	if (isNaN(time)){
  		time=0;
	}
	//Mass update
	nu=controls.Mass1*controls.Mass2/(Math.pow(controls.Mass1+controls.Mass2,2));
	M_c=Math.pow(nu,3/5)*m_sun*(controls.Mass1+controls.Mass2);

	//pass variable
	M_c_pass=M_c;
	M1_pass=controls.Mass1;
	M2_pass=controls.Mass2;
	nu_pass=nu;
	freq_pass=controls.initialFreq;

	//time update
	t_coal=5/(256*Math.pow(Math.PI,8/3))*Math.pow(Math.pow(c,3)/(G*m_sun*(controls.Mass1+controls.Mass2)),5/3)/(nu*Math.pow(controls.initialFreq,8/3));
	t=(time/1000*controls.time_speed)%t_coal;
	semi_major_axis=Math.pow(c,2)/(2*G*25*m_sun)*Math.pow(G*m_sun*(controls.Mass1+controls.Mass2)/Math.pow(controls.initialFreq*2*Math.PI,2),1/3);
	major_axis=2*semi_major_axis;
	start1=major_axis*controls.Mass2/(controls.Mass1+controls.Mass2);
	start2=major_axis*controls.Mass1/(controls.Mass1+controls.Mass2);

	if (t_coal-t>0){
		new_radius1=start1*Math.pow(1-t/t_coal,1/4);
		new_radius2=start2*Math.pow(1-t/t_coal,1/4);	
		new_angle=Math.pow(5*G*M_c/Math.pow(c,3),-5/8)/controls.howSlow*Math.pow(t_coal-t,5/8);
		sphere2.position.set(-new_radius2*Math.cos(new_angle),0,new_radius2*Math.sin(new_angle));
		sphere1.position.set(+new_radius1*Math.cos(new_angle),0,-new_radius1*Math.sin(new_angle));
	}
	else{
		t=0;
	}
	sphere1.rotation.y+=0.1;
	sphere2.rotation.y+=0.1;
	
	//sphere radius update
	sphere1.scale.x=controls.Mass1/25;
	sphere1.scale.y=controls.Mass1/25;
	sphere1.scale.z=controls.Mass1/25;
	sphere2.scale.x=controls.Mass2/25;
	sphere2.scale.y=controls.Mass2/25;
	sphere2.scale.z=controls.Mass2/25;

	// distance update
	old_major_ax=controls.major_ax;

	//wave freq
	f=1/Math.PI*Math.pow(5/256/(t_coal-t),3/8)*Math.pow(G*M_c/Math.pow(c,3),-5/8);
	// H plus MAGNITUDE (X2000)
	var magnitude=2000*Math.pow(G*M_c/Math.pow(c,2),5/4)*Math.pow(5/(t_coal-t)/c,1/4)/(2*G*25*m_sun/c/c)

	// WAVE UPDATE
	//var center1 = new THREE.Vector2(sphere1.position.x,sphere1.position.z);
	//var center2 = new THREE.Vector2(sphere2.position.x,sphere2.position.z);
	var center0 = new THREE.Vector2(0,0);
	var vLength = plane.geometry.vertices.length;

	for (var i = 0; i < vLength; i++) {
		var v = plane.geometry.vertices[i];
		//var dist1 = new THREE.Vector2(v.x, v.y).sub(center1).add(new THREE.Vector2(0.001,0.001));
		//var dist2 = new THREE.Vector2(v.x, v.y).sub(center2).add(new THREE.Vector2(0.001,0.001));
		var dist0 = new THREE.Vector2(v.x, v.y).sub(center0).add(new THREE.Vector2(0.001,0.001));
		var size = 5;

		if (dist0.length()<(1.1*start1+1.1*start2)){
			v.z=0;
		}
		else{
			v.z=magnitude/dist0.length()*Math.cos(dist0.length()/size+new_angle);;
		}
	}

	camera_control.update();
	plane.geometry.verticesNeedUpdate = true;
	renderer.render( scene, camera );
}