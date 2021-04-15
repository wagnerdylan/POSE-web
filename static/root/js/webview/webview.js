
import * as Objs from './objs/objs.js';

const tracking_enum = Object.freeze({ 'SUN': { id: 0, scale: 2000000 }, "EARTH": { id: 1, scale: 20000 }, "MOON": { id: 2, scale: 10000 }, "OBJECT": { id: 3, scale: 1, obj_id: null } });

var web_camera = {
    tracking: { updated: true, obj: tracking_enum.SUN },

    init_camera: function () {
        // Three JS camera default tracking sun
        this.camera = new THREE.OrthographicCamera(this.tracking.obj.scale * window.innerWidth / - 2, this.tracking.obj.scale * window.innerWidth / 2, this.tracking.obj.scale * window.innerHeight / 2, this.tracking.obj.scale * window.innerHeight / - 2, 0.1, 6.95700e+25);
        this.camera.position.z = 1;

        this.controls = new THREE.OrbitControls(this.camera, document.querySelector('#main'));
        this.controls.screenSpacePanning = true;
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.enableZoom = true;
        this.controls.target.set(0, 0, 0);
    },

    set_tracking: function (to_track, obj_id = null) {
        this.tracking.obj = to_track;

        if (to_track.id == tracking_enum.OBJECT.id) {
            this.tracking.obj.obj_id = obj_id;
        }

        this.tracking.updated = true;
    },

    adjust_camera: function (objs, reset) {
        reset = reset || false;

        var obj_pos = null;
        switch (this.tracking.obj.id) {
            case tracking_enum.SUN.id:
                obj_pos = objs.solar_objs.sun.position;
                break;
            case tracking_enum.EARTH.id:
                obj_pos = objs.solar_objs.earth.position;
                break;
            case tracking_enum.MOON.id:
                obj_pos = objs.solar_objs.moon.position;
                break;
            case tracking_enum.OBJECT.id:
                break;
            default:
                break;
        }

        if (reset) {
            this.camera.left = this.tracking.obj.scale * window.innerWidth / - 2;
            this.camera.right = this.tracking.obj.scale * window.innerWidth / 2;
            this.camera.top = this.tracking.obj.scale * window.innerHeight / 2;
            this.camera.bottom = this.tracking.obj.scale * window.innerHeight / - 2;

            this.camera.updateProjectionMatrix();
        }

        this.controls.target.set(obj_pos.x, obj_pos.y, obj_pos.z);
    },

    update: function (objs) {

        // Set the camera frustum properties 
        this.adjust_camera(objs, this.tracking.updated);
        this.tracking.updated = false;

        this.controls.update();
    }
}

var web_view = {

    create_scene: function () {
        this.scene = new THREE.Scene();

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        // Append the webview to the main div
        document.getElementById("main").appendChild(this.renderer.domElement);

        // Init camera and controls
        this.web_camera = web_camera;
        this.web_camera.init_camera();

        this.web_camera.set_tracking(tracking_enum.SUN);

        this.init_view();
    },

    init_view: function () {
        this.objs = new Objs.Objs(this.scene);
    },

    animate: function () {
        requestAnimationFrame(this.animate.bind(this));

        this.objs.update();
        // Pass objs to web camera as tracking needs to be updated
        this.web_camera.update(this.objs);

        this.renderer.render(this.scene, this.web_camera.camera);
    },

    launch: function () {
        web_view.create_scene();
        web_view.animate();
    }
}

web_view.launch();