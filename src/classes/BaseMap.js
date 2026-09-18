import Phaser from "phaser";
/**
 * Class base map untuk membuat dasar jalan
 */

export default class BaseMap {
    /**
    * @param {Phaser.Scene} scene - Scene phaser yang sedang berjalan.
    * @param {object} config - Konfigurasi jalan
    */

    constructor(scene, config = {}) {
        this.scene = scene

        this.x = config.x
        this.y = config.y

        this.width = config.width //Lebar layar
        this.height = config.height //tinggi layar
        this.roadWidth = config.roadWidth //lebar jalan
        this.sideWalkWidth = config.sideWalkWidth // lebar trotoar

        this.centerX = this.width / 2 //posisi tengah koordinat x

        this.roadLeft = this.centerX - (this.roadWidth / 2);
        this.roadRight = this.centerX + (this.roadWidth / 2);

        this.graphics = this.scene.add.graphics();
        this.boundsGroup = this.scene.physics.add.staticGroup();
    }

    /**
    * Method untuk menambahkan collider
    * @param {int} x - posisi dalam x koordinat
    * @param {int} y - posisi dalam y koordinat
    * @param {int} width - lebar
    * @param {int} height - tinggi
    */

    addStaticBound(x, y, w, h) {
        const bound = this.scene.add.zone(x, y, w, h)
        this.scene.physics.add.existing(bound, true)
        this.boundsGroup.add(bound)
    }

    /**
     * Method untuk menggambar peta
     */
    draw() {
        throw new Error("Using in subclass")
    }
}