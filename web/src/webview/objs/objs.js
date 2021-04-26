
import { SolarObjs } from './solar_objs.js';

class Objs {

    constructor(scene) {
        this.solar_objs = new SolarObjs(scene);

        // DEBUG object REMOVE
        const geometry = new THREE.PlaneGeometry(999999999, 999999999, 32);
        const material = new THREE.MeshBasicMaterial({ color: 0x808080, side: THREE.DoubleSide, wireframe: true });
        const plane = new THREE.Mesh(geometry, material);
        scene.add(plane);
        plane.position.set(-124443530000.0, -84562370000.0, 0.0);
    }

    update(sim_data) {
        // Update solar objs
        this.solar_objs.update(sim_data.getSolarObjUpdateList());
    }
}

export { Objs };