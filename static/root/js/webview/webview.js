
import * as Objs from './objs/objs.js';

var web_view = {

    create_scene: function () {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000e+8);
        this.renderer = new THREE.WebGLRenderer();

        this.renderer.setSize(window.innerWidth, window.innerHeight);
        // Append the webview to the main div
        document.getElementById("main").appendChild(this.renderer.domElement);

        this.init_view();
    },

    init_view: function () {

        this.camera.position.z = 13.95700e+8;

        this.objs = new Objs.Objs(this.scene);
    },

    animate: function () {
        requestAnimationFrame(this.animate.bind(this));

        this.objs.update();

        this.renderer.render(this.scene, this.camera);
    },

    launch: function () {
        web_view.create_scene();
        web_view.animate();
    }
}

web_view.launch()