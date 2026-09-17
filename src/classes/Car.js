import BaseVehicle from "./BaseVehicle";

/**
 * Class car sebagai class turunan base vehicle untuk membuat model mobil
 */


export default class Car extends BaseVehicle {

    /**
   * @param {Phaser.Scene} scene - Scene Phaser
   * @param {number} x - Posisi X awal
   * @param {number} y - Posisi Y awal
   * @param {string} texture - Key aset gambar mobil
   * @param {Object} [sfxKeys={}] - Objek berisi key audio yang diterima dari instance
   */

    constructor(scene, x, y, texture, sfxKeys = {}) {
        super(scene, x, y, texture, sfxKeys)

        this.speed = 250;
        this.turnSpeed = 120;

        this.body.setSize(50, 100);
    }
}