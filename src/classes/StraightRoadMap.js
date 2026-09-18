import BaseMap from "./BaseMap";

/**
 * Class untuk membuat jalan lurus
 */

export default class StraightRoadMap extends BaseMap {
    /**
     *
     * @param {Phaser.Scene} scene
     * @param {Object} config
     */
    constructor(scene, config = {}) {
        super(scene, config)
        this.draw()

    }

    /**
     * Method untuk menggambar layer jalan
     */

    draw() {
        this.graphics.clear();

        this.graphics.clear();

        // 1. Rumput / Latar Belakang (Gambar paling pertama agar di bawah)
        this.graphics.fillStyle(0x3e7b37, 1); // Warna hijau rumput
        this.graphics.fillRect(0, 0, this.width, this.height);

        // 2. Trotoar Kiri & Kanan
        this.graphics.fillStyle(0xcccccc, 1);
        this.graphics.fillRect(this.roadLeft - this.sidewalkWidth, 0, this.sidewalkWidth, this.height);
        this.graphics.fillRect(this.roadRight, 0, this.sidewalkWidth, this.height);

        // 3. Aspal Jalan Utama
        this.graphics.fillStyle(0x2d3436, 1);
        this.graphics.fillRect(this.roadLeft, 0, this.roadWidth, this.height);
    }

    /**
    * Method untuk membuat colliders
    */
    createColliders() {
        this.addStaticBound(this.roadLeft - (this.sidewalkWidth / 2), this.height / 2, this.sidewalkWidth, this.height);
        this.addStaticBound(this.roadRight + (this.sidewalkWidth / 2), this.height / 2, this.sidewalkWidth, this.height);
    }
}