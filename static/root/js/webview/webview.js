
import * as Objs from './objs/objs.js';

const DEFAULT_SCALE = 2000000;

var web_view = {

    create_scene: function () {
        this.scene = new THREE.Scene();

        var width = DEFAULT_SCALE * window.innerWidth;
        var height = DEFAULT_SCALE * window.innerHeight;
        this.camera = new THREE.OrthographicCamera(width / - 2, width / 2, height / 2, height / - 2, 1, 1000e+8);
        //this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000e+8);

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        // Append the webview to the main div
        document.getElementById("main").appendChild(this.renderer.domElement);

        this.controls = new THREE.OrbitControls(this.camera, document.querySelector('#main'));
        this.controls.screenSpacePanning = true;
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.enableZoom = true;
        this.controls.target.set(0, 0, 0);

        this.init_view();
    },

    init_view: function () {

        this.camera.position.z = 13.95700e+8;

        this.objs = new Objs.Objs(this.scene);
    },

    animate: function () {
        requestAnimationFrame(this.animate.bind(this));

        this.objs.update();
        this.controls.update();

        this.renderer.render(this.scene, this.camera);
    },

    launch: function () {
        web_view.create_scene();
        web_view.animate();
    }
}

web_view.launch();