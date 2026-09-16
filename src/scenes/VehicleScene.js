import BaseScene from './BaseScene';
import { LOWER_CASE, TEXT_STYLES } from '../configs/fonts';

export default class VehicleScene extends BaseScene {
    constructor() {
        super({ key: 'VehicleScene' });
    }
 
    create() {
        super.create();
        let gap = 20;

        // Background: stretch horizontal doang, height ikut rasio asli
        const background = this.add.image(0, 0, 'background').setOrigin(0, 0);
        background.displayWidth = this.scale.width;
        background.scaleY = background.scaleX;
        background.setDepth(-1);

        const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
        const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;

        const title = this.add.text(screenCenterX, 100, 'Pilih Kendaraan', TEXT_STYLES.title).setOrigin(0.5);

        this.registry.set('vehicle', { mobil: false, motor: false });

        const pilihKendaraan = (nama) => {
            this.registry.set('vehicle', { mobil: nama === 'mobil', motor: nama === 'motor' });
            this.sound.play('sfxClick');
            this.scene.start('LevelsScene');
        };

        const boxWidth = 225;
        const boxHeight = 225;
        const offset = 5;
        const gapOffset = 50;

        const leftHalfCenterX = screenCenterX / 2;
        const rightHalfCenterX = screenCenterX * 1.5;

        const shadowsBox = this.add.graphics();
        shadowsBox.fillStyle(0x000000, 0.3);

        shadowsBox.fillRoundedRect(
            leftHalfCenterX - boxWidth / 2 + gapOffset + offset,
            screenCenterY - boxHeight / 2 + offset,
            boxWidth,
            boxHeight,
            5
        );

        shadowsBox.fillRoundedRect(
            rightHalfCenterX - boxWidth / 2 - gapOffset + offset,
            screenCenterY - boxHeight / 2 + offset,
            boxWidth,
            boxHeight,
            5
        );

        const graphics = this.add.graphics();
        graphics.fillStyle(0xd3d3d3, 1);

        graphics.fillRoundedRect(
            leftHalfCenterX - boxWidth / 2 + gapOffset,
            screenCenterY - boxHeight / 2,
            boxWidth,
            boxHeight,
            5
        );
        const gambarMobil = this.add.image(leftHalfCenterX + gapOffset, screenCenterY, 'pilih_mobil');
        gambarMobil.setDisplaySize(200, 200);
        gambarMobil.setInteractive({ useHandCursor: true });
        gambarMobil.on('pointerdown', () => pilihKendaraan('mobil'));
        const vehicleNameCar = this.add
            .text(leftHalfCenterX + gapOffset, screenCenterY + 100, 'Mobil', LOWER_CASE.title)
            .setOrigin(0.5);

        graphics.fillRoundedRect(
            rightHalfCenterX - boxWidth / 2 - gapOffset,
            screenCenterY - boxHeight / 2,
            boxWidth,
            boxHeight,
            5
        );
        const gambarMotor = this.add.image(rightHalfCenterX - gapOffset, screenCenterY, 'pilih_motor');
        gambarMotor.setDisplaySize(200, 200);
        gambarMotor.setInteractive({ useHandCursor: true });
        gambarMotor.on('pointerdown', () => pilihKendaraan('motor'));
        const vehicleNameMotor = this.add
            .text(rightHalfCenterX - gapOffset, screenCenterY + 100, 'Motor', LOWER_CASE.title)
            .setOrigin(0.5);

        const size = 70;

        const triangleShadow = this.add.triangle(
            50 + offset,
            this.cameras.main.worldView.y + this.cameras.main.height - 80 + offset,
            0, size * 0.5, size, 0, size, size,
            0x000000, 0.3
        );

        const triangle = this.add.triangle(
            50,
            this.cameras.main.worldView.y + this.cameras.main.height - 80,
            0, size * 0.5, size, 0, size, size,
            0xffffff
        );
        triangle.setStrokeStyle(4, 0x000000);

        triangle.setInteractive({ useHandCursor: true });
        triangle.on('pointerdown', () => {
            this.sound.play('sfxClick');
            this.scene.start('WelcomeScene');
        });
    }

    update() {}
}