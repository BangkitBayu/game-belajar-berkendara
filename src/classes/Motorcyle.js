import BaseVehicle from "./BaseVehicle";

/**
 * Class motorcycle sebagai class turunan base vehicle untuk membuat model motor
 */

export default class Motorcyle extends BaseVehicle {
    /**
     * @param {Phaser.Scene} scene - Scene Phaser
     * @param {number} x - Posisi X awal
     * @param {number} y - Posisi Y awal
     * @param {string} texture - Key aset gambar motor
     * @param {Object} [sfxKeys={}] - Objek berisi key audio yang diterima dari instance
     */

    constructor(scene, x, y, texture, sfxKeys = {}) {
        super(scene, x, y, texture, sfxKeys)

        this.speed = 260;
        this.turnSpeed = 150;

        this.body.setSize(50, 100);
    }
}