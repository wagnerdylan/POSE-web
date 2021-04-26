
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import { Objs } from './objs/objs.js';
import { web_controller } from './controller/webcontroller.js';
import { init_ui_menu } from './ui/ui_menubar.js';
import { NumberKeyframeTrack } from 'three';

const tracking_enum = Object.freeze({ 'SUN': { id: 0, scale: 2000000 }, "EARTH": { id: 1, scale: 20000 }, "MOON": { id: 2, scale: 10000 }, "OBJECT": { id: 3, scale: 1, obj_id: null } });

var web_camera = {
    // Object within the scene which camera should track/focus on
    tracking: { updated: true, obj: tracking_enum.SUN },

    /**
     * Initialize camera and controls for POSE webview
     */
    init_camera: function () {
        // Three JS camera default tracking sun
        this.camera = new THREE.OrthographicCamera(this.tracking.obj.scale * window.innerWidth / - 2, this.tracking.obj.scale * window.innerWidth / 2, this.tracking.obj.scale * window.innerHeight / 2, this.tracking.obj.scale * window.innerHeight / - 2, 0.1, 6.95700e+25);
        this.camera.position.z = 1;

        this.controls = new OrbitControls(this.camera, document.querySelector('#main'));
        this.controls.screenSpacePanning = false;
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.enableZoom = true;
    },

    /**
     * Set the the object which the camera should focus on/track.
     * @param {tracking_enum} to_track Tracking enum variant 
     * @param {Number} obj_id If tracking enum is OBJECT use this value for specific sim object tracking 
     */
    set_tracking: function (to_track, obj_id = null) {
        this.tracking.obj = to_track;

        if (to_track.id == tracking_enum.OBJECT.id) {
            this.tracking.obj.obj_id = obj_id;
        }

        this.tracking.updated = true;
    },

    /**
     * Adjust the camera to track focused object
     * @param {Objs} objs All objects within the scene, used for positions 
     * @param {*} reset If a view reset was selected, true if camera viewport should be modified
     */
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
                // TODO find object pos within objs
                break;
            default:
                break;
        }

        // Set the viewing to proper size for focused object
        if (reset) {
            this.camera.left = this.tracking.obj.scale * window.innerWidth / - 2;
            this.camera.right = this.tracking.obj.scale * window.innerWidth / 2;
            this.camera.top = this.tracking.obj.scale * window.innerHeight / 2;
            this.camera.bottom = this.tracking.obj.scale * window.innerHeight / - 2;

            this.camera.updateProjectionMatrix();

            // Reset controls including zoom, prevents odd behaviour
            this.controls.reset();
        }

        // Set the target of OrbitControls
        this.controls.target.set(obj_pos.x, obj_pos.y, obj_pos.z);
    },

    /**
     * Updates camera to match objects within the scene
     * @param {Objs} objs All objects within the scene
     */
    update: function (objs) {
        // Set the camera frustum properties 
        this.adjust_camera(objs, this.tracking.updated);
        this.tracking.updated = false;
    },

    /**
     * Animate function, used for controls animation
     */
    animate: function () {
        this.controls.update();
    }
}

var web_view = {

    /**
     * Create initial webview scene
     */
    create_scene: function () {
        this.scene = new THREE.Scene();

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        // Append the webview to the main div
        document.getElementById("main").appendChild(this.renderer.domElement);

        // Init camera and controls
        this.web_camera = web_camera;
        this.web_camera.init_camera();

        this.init_view();

        // REMOVE, make null initially 
        this.sim_data_generator = web_controller.sim_data_buffer.get_sim_data_range(0.0, 0.0);
    },

    /**
     * Initialize initial scene objects
     */
    init_view: function () {
        this.objs = new Objs(this.scene);
    },

    /**
     * Updates relevant objects within the scene
     * @param {*} sim_data Data used to update scene objects, this data is from the backend simulation or driver app
     */
    update: function (sim_data) {
        this.objs.update(sim_data);
    },

    /**
     * Animate and render webview scene
     */
    animate: function () {
        requestAnimationFrame(this.animate.bind(this));

        this.web_camera.animate();
        // Pass objs to web camera as tracking needs to be updated
        this.web_camera.update(this.objs);

        // TODO hook data update to periodic timer for adjustable playback speeds
        var sim_data_gen = this.sim_data_generator.next();
        // if sim_data_gen.done == true, request has been complete
        if (sim_data_gen.value != null) {
            this.update(sim_data_gen.value);
        }

        this.renderer.render(this.scene, this.web_camera.camera);
    },

    /**
     * Launches the webview
     */
    launch: function () {
        web_view.create_scene();
        web_view.animate();
    }
}

$(window).load(function () {
    web_controller.setup();
    web_view.launch();

    init_ui_menu();
});

export { web_view, web_camera, tracking_enum };