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
        this.createColliders()
    }

    /**
     * Method untuk menggambar layer jalan
     */

    draw() {
        try {

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

            // 4. Garis Putus-Putus Tengah Jalan
            console.log("Menggamber markah mulai")
            this.graphics.fillStyle(0xffffff, 1);
            for (let currentY = this.y; currentY < this.y + this.height; currentY += 70) {
                console.log(currentY)
                this.graphics.fillRect(this.centerX - 3, currentY, 6, 40);
            }
        } catch (error) {
            console.error(error)
        }
    }

    /**
    * Method untuk membuat colliders
    */
    createColliders() {
        const centerY = this.y + (this.height / 2);

        this.addStaticBound(this.roadLeft - (this.sidewalkWidth / 2), centerY, this.sidewalkWidth, this.height);
        this.addStaticBound(this.roadRight + (this.sidewalkWidth / 2), centerY, this.sidewalkWidth, this.height);
    }
}