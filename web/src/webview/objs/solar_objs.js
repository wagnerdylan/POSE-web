
class SolarObjs {

    constructor(scene) {
        this.create_sun(scene);
        this.create_earth(scene);
        this.create_moon(scene);
    }

    create_sun(scene) {
        // Radius of sun as sphere radius
        const geometry = new THREE.SphereGeometry(6.95700e+8, 64, 64);
        const material = new THREE.MeshBasicMaterial({ color: 0xf9d71c, wireframe: true });
        this.sun = new THREE.Mesh(geometry, material);
        scene.add(this.sun);

        this.sun.position.set(0, 0, 0);
    }

    create_earth(scene) {
        // Radius of Earth as sphere radius
        const geometry = new THREE.SphereGeometry(6.3781e+6, 64, 64);
        const material = new THREE.MeshBasicMaterial({ color: 0x0077be, wireframe: true });
        this.earth = new THREE.Mesh(geometry, material);
        scene.add(this.earth);


        // Initial Earth pos just outside of sun.
        this.earth.position.x = 8.95700e+8
    }

    create_moon(scene) {
        // Radius of Moon as sphere radius
        const geometry = new THREE.SphereGeometry(1.7381e+6, 64, 64);
        const material = new THREE.MeshBasicMaterial({ color: 0xc2c5cc, wireframe: true });
        this.moon = new THREE.Mesh(geometry, material);
        scene.add(this.moon);

        // Initial Moon pos just outside of Earth.
        this.moon.position.x = 10.95700e+8
    }

    set_pos(obj, vec) {
        obj.position.set(vec.getX(), vec.getY(), vec.getZ())
    }

    update(solar_obj_update) {
        solar_obj_update.forEach(solar_obj => {
            if (solar_obj.getSolarObj() == 0) {
                this.set_pos(this.sun, solar_obj.getAbsCoord())
            } else if (solar_obj.getSolarObj() == 1) {
                this.set_pos(this.earth, solar_obj.getAbsCoord())
            } else if (solar_obj.getSolarObj() == 2) {
                this.set_pos(this.moon, solar_obj.getAbsCoord())
            }
        });
    }
}

export { SolarObjs };