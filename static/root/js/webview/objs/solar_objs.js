
export class SolarObjs {
    #sun

    constructor(scene) {
        this.create_sun(scene);
    }

    create_sun = (scene) => {
        // Radius of sun as sphere radius
        const geometry = new THREE.SphereGeometry(6.95700e+8, 64, 64);
        const material = new THREE.MeshBasicMaterial({ color: 0xf9d71c });
        this.#sun = new THREE.Mesh(geometry, material);
        scene.add(this.#sun);
    }

    update = () => {
        this.#sun.rotation.x += 0.01;
        this.#sun.rotation.y += 0.01;
    }
}