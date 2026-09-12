import Phaser from 'phaser';
import { TEXT_STYLES } from '../configs/fonts';

export default class VehicleScene extends Phaser.Scene {
    constructor() {
        super({ key: 'VehicleScene' });
    }

    preload() {
        // Image asset
        this.load.image('background', '/src/assets/background.png');

        // Sound asset
        this.load.audio('backsound', '/src/assets/sound/backsound.mp3');
        this.load.audio('click', '/src/assets/sound/click.mp3');
        
        // Vehicle asset
        this.load.image('Mobil', '/src/assets/pilih_kendaraan/Mobil.png');
        this.load.image('Motor', '/src/assets/pilih_kendaraan/Motor.png');
    }

    create() {
        let gap = 20;

        const background = this.add.image(0, 0, 'background').setOrigin(0, 0);
        background.setDisplaySize(this.scale.width, this.scale.height);
        background.setDepth(-1);

        // musik — guard biar gak crash kalau gagal load
        if (this.cache.audio.exists('backsound')) {
            const backsound = this.sound.add('backsound', { loop: true });
            backsound.play();
        } else {
            console.warn('backsound belum keload, cek Network tab / path file');
        }

        let clickSfx = null;
        if (this.cache.audio.exists('click')) {
            clickSfx = this.sound.add('click');
        }

        // Untuk mengambil nilai tengah x dan y
        const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
        const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;

        const title = this.add.text(screenCenterX, 100, 'Pilih Kendaraan', TEXT_STYLES.title).setOrigin(0.5);

        // kotak
        const boxWidth = 225;
        const boxHeight = 225;
        const offset = 5;

        const leftHalfCenterX = screenCenterX / 2;
        const rightHalfCenterX = screenCenterX * 1.5;

        const shadowsBox = this.add.graphics();

        shadowsBox.fillStyle(0x000000, 0.3);

        // shadow box
        shadowsBox.fillRoundedRect(
            leftHalfCenterX - boxWidth / 2 + offset,
            screenCenterY - boxHeight / 2 + offset,
            boxWidth,
            boxHeight,
            5
        );

        shadowsBox.fillRoundedRect(
            rightHalfCenterX - boxWidth / 2 + offset,
            screenCenterY - boxHeight / 2 + offset,
            boxWidth,
            boxHeight,
            5
        );

        const graphics = this.add.graphics();
        graphics.fillStyle(0xd3d3d3, 1);

        // kotak di half kiri
        graphics.fillRoundedRect(leftHalfCenterX - boxWidth / 2, screenCenterY - boxHeight / 2, boxWidth, boxHeight, 5);

        // kotak di half kanan
        graphics.fillRoundedRect(
            rightHalfCenterX - boxWidth / 2,
            screenCenterY - boxHeight / 2,
            boxWidth,
            boxHeight,
            5
        );

        // tombol back segitiga
        const size = 70;

        // shadow dulu
        const triangleShadow = this.add.triangle(
            50 + offset,
            this.cameras.main.worldView.y + this.cameras.main.height - 80 + offset,
            0,
            size * 0.5,
            size,
            0,
            size,
            size,
            0x000000,
            0.3
        );

        const triangle = this.add.triangle(
            50,
            this.cameras.main.worldView.y + this.cameras.main.height - 80,
            0,
            size * 0.5,
            size,
            0,
            size,
            size,
            0xffffff
        );
        triangle.setStrokeStyle(4, 0x000000);

        triangle.setInteractive({ useHandCursor: true });
        triangle.on('pointerdown', () => {
            if (clickSfx) clickSfx.play();
            this.scene.start('WelcomeScene');
        });
    }

    update() {}
}
