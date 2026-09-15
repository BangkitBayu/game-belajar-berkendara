import BaseScene from './BaseScene';
import { LOWER_CASE, TEXT_STYLES } from '../configs/fonts';

export default class VehicleScene extends BaseScene {
    constructor() {
        super({ key: 'VehicleScene' });
    }

    create() {
        super.create();

        const width = this.scale.width;
        const height = this.scale.height;
        const centerX = width / 2;
        const centerY = height / 2;

        const background = this.add.image(0, 0, 'background').setOrigin(0, 0);
        background.setDisplaySize(width, height);
        background.setDepth(-1);

        const baseWidth = 1280;
        const baseHeight = 720;
        const scaleFactor = Math.max(0.5, Math.min(width / baseWidth, height / baseHeight));

        const title = this.add.text(centerX, height * 0.15, 'Pilih Kendaraan', TEXT_STYLES.title)
            .setOrigin(0.5)
            .setScale(scaleFactor);

        this.registry.set('vehicle', { mobil: false, motor: false });

        const pilihKendaraan = (nama) => {
            this.registry.set('vehicle', { mobil: nama === 'mobil', motor: nama === 'motor' });
            this.sound.play('sfxClick');
            this.scene.start('LevelsScene');
        };

        const boxWidth = 225 * scaleFactor;
        const boxHeight = 225 * scaleFactor;
        const offset = 5 * scaleFactor;
        const spacing = width * 0.2;

        const createVehicleCard = (x, y, assetKey, labelText, vehicleType) => {
            const container = this.add.container(x, y);

            const shadow = this.add.graphics();
            shadow.fillStyle(0x000000, 0.3);
            shadow.fillRoundedRect(-boxWidth / 2 + offset, -boxHeight / 2 + offset, boxWidth, boxHeight, 5 * scaleFactor);

            const box = this.add.graphics();
            box.fillStyle(0xd3d3d3, 1);
            box.fillRoundedRect(-boxWidth / 2, -boxHeight / 2, boxWidth, boxHeight, 5 * scaleFactor);

            const img = this.add.image(0, -10 * scaleFactor, assetKey);
            img.setDisplaySize(180 * scaleFactor, 180 * scaleFactor);

            const label = this.add.text(0, boxHeight / 2 - 25 * scaleFactor, labelText, LOWER_CASE.title)
                .setOrigin(0.5)
                .setScale(scaleFactor);

            container.add([shadow, box, img, label]);

            const hitArea = new Phaser.Geom.Rectangle(-boxWidth / 2, -boxHeight / 2, boxWidth, boxHeight);
            container.setInteractive(hitArea, Phaser.Geom.Rectangle.Contains);
            container.input.cursor = 'pointer';
            container.on('pointerdown', () => pilihKendaraan(vehicleType));

            return container;
        };

        createVehicleCard(centerX - spacing, centerY, 'pilih_mobil', 'Mobil', 'mobil');
        createVehicleCard(centerX + spacing, centerY, 'pilih_motor', 'Motor', 'motor');

        const triSize = 60 * scaleFactor;
        const triX = 50 * scaleFactor;
        const triY = height * 0.88;

        this.add.triangle(
            triX + offset, triY + offset,
            0, triSize * 0.5,
            triSize, 0,
            triSize, triSize,
            0x000000, 0.3
        );

        const triangle = this.add.triangle(
            triX, triY,
            0, triSize * 0.5,
            triSize, 0,
            triSize, triSize,
            0xffffff
        );
        triangle.setStrokeStyle(4 * scaleFactor, 0x000000);
        triangle.setInteractive({ useHandCursor: true });

        triangle.on('pointerdown', () => {
            this.sound.play('sfxClick');
            this.scene.start('WelcomeScene');
        });
    }

    update() {}
}