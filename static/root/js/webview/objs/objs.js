
import * as SolarObjs from './solar_objs.js';

export class Objs {
    #solar_objs

    constructor(scene) {
        this.#solar_objs = new SolarObjs.SolarObjs(scene);
    }

    update = () => {
        this.#solar_objs.update();
    }
}