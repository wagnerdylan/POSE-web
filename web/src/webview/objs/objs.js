
import { SolarObjs } from './solar_objs.js';

class Objs {

    constructor(scene) {
        this.solar_objs = new SolarObjs(scene);
    }

    update() {
        this.solar_objs.update();
    }
}

export { Objs };