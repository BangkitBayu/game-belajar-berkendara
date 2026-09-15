import BaseScene from './BaseScene';

const LEVELS_DATA = {
    1: {
        iconKey: 'level1',
        objective: '1. Menggunakan helm (double click layar)\n2. Berkendara sesuai batas kecepatan\n3. Menggunakan klakson / bell',
        mainLabel: 'main'
    },
    2: { iconKey: 'level2', objective: '1. Menyalip 2 kendaraan dengan sein\n2. Mematuhi traffic light & rambu lalu lintas', mainLabel: 'main' },
    3: {
        iconKey: 'level3',
        objective: '1. Jaga jarak dengan kendaraan di depan (10 detik)\n2. Memberi jalan ke pejalan kaki di zebra cross',
        mainLabel: 'main'
    },
    4: {
        iconKey: 'level4',
        objective: '1. Beri jalan untuk ambulan\n2. Beri jalan untuk 3 pejalan kaki\n3. Berkendara hingga 500 meter',
        mainLabel: 'main'
    },
    5: { iconKey: 'level5', objective: '1. Berkendara hingga 1000 meter\n2. Hindari genangan air\n3. Patuhi semua rambu', mainLabel: 'main' }
};

export default class LevelsScene extends BaseScene {
    constructor() {
        super({ key: 'LevelsScene' });
    }

    create() {
        super.create();
        const warna = 0xffffff;

        const width = this.scale.width;
        const height = this.scale.height;
        const screenCenterX = width / 2;
        const screenCenterY = height / 2;

        const baseWidth = 1280;
        const baseHeight = 720;
        const scaleFactor = Math.max(0.5, Math.min(width / baseWidth, height / baseHeight));
        this.scaleFactor = scaleFactor;

        const background = this.add.image(0, 0, 'background').setOrigin(0, 0);
        background.setDisplaySize(width, height);
        background.setDepth(-1);

        const offset = 5 * scaleFactor;
        const stepX = 225 * scaleFactor;
        const lineY = screenCenterY;
        const circleRadius = 75 * scaleFactor;

        const graphics = this.add.graphics();
        
        graphics.fillStyle(0x000000, 0.3);
        for (let i = -2; i <= 1; i++) {
            graphics.fillRoundedRect(screenCenterX + (i * stepX) + offset, lineY + offset, stepX, 10 * scaleFactor, 5 * scaleFactor);
        }

        graphics.fillStyle(0xd3d3d3, 1);
        for (let i = -2; i <= 1; i++) {
            graphics.fillRoundedRect(screenCenterX + (i * stepX), lineY, stepX, 10 * scaleFactor, 5 * scaleFactor);
        }

        for (let i = 0; i < 5; i++) {
            const num = i + 1;
            const x = screenCenterX + ((i - 2) * stepX);
            const y = lineY;

            this.add.circle(x + offset, y + offset, circleRadius, 0x000000, 0.3);

            const circle = this.add.circle(x, y, circleRadius, warna);

            const icon = this.add.image(x, y, `level${num}`);
            icon.setDisplaySize(100 * scaleFactor, 100 * scaleFactor);

            circle.setInteractive({ useHandCursor: true });
            circle.on('pointerdown', () => {
                this.sound.play('sfxClick');
                this.toggleLevelMenu(screenCenterX, screenCenterY, num);
            });
        }

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
            this.scene.start('VehicleScene');
        });
    }

    toggleLevelMenu(x, y, levelNumber) {
        if (this.activeLevelMenu) {
            const wasSameLevel = this.activeLevelMenu.levelNumber === levelNumber;
            this.activeLevelMenu.destroy();
            this.activeLevelMenu = null;
            if (wasSameLevel) return;
        }
        this.activeLevelMenu = this.showLevelMenu(x, y, levelNumber);
    }

    showLevelMenu(screenCenterX, screenCenterY, levelNumber) {
        const data = LEVELS_DATA[levelNumber];
        const scale = this.scaleFactor;

        const container = this.add.container(screenCenterX, screenCenterY - (180 * scale));
        container.levelNumber = levelNumber;

        const circleRadius = 75 * scale;
        const level1X = -450 * scale;
        const level3X = 0;
        const level5X = 450 * scale;

        const rowHeight = 140 * scale;
        const squareSize = 140 * scale;

        const vehicle = this.registry.get('vehicle');
        const vehicleKey = vehicle && vehicle.motor ? 'motor' : 'mobil';

        const square = this.add.rectangle(level1X, 0, squareSize, rowHeight, 0xffffff).setStrokeStyle(3 * scale, 0x000000);
        const squareIcon = this.add.image(level1X, 0, vehicleKey).setDisplaySize(90 * scale, 90 * scale);

        const objLeftX = level1X + squareSize / 2;
        const objRightX = level5X + circleRadius;
        const objWidth = objRightX - objLeftX;
        const objLocalX = (objLeftX + objRightX) / 2;

        const objRect = this.add.rectangle(objLocalX, 0, objWidth, rowHeight, 0xffffff).setStrokeStyle(3 * scale, 0x000000);
        const objText = this.add.text(objLocalX, 0, data.objective, {
            fontSize: `${12 * scale}px`,
            color: '#000000',
            align: 'center',
            wordWrap: { width: objWidth - (20 * scale) }
        }).setOrigin(0.5);

        const circleLocalY = 180 * scale;
        const mainBtnHeight = 60 * scale;
        const cut = 20 * scale;
        const gapFromCircle = 40 * scale;

        const mainBtnTop = circleLocalY + circleRadius + gapFromCircle;
        const mainBtnBottom = mainBtnTop + mainBtnHeight;
        const mainBtnLeftX = level3X - circleRadius;
        const mainBtnRightX = objRightX;

<<<<<<< HEAD
        const mainBtn = this.add
            .polygon(
                0,
                0,
                [
                    mainBtnLeftX,
                    mainBtnTop, // kiri-atas
                    mainBtnRightX,
                    mainBtnTop, // kanan-atas   ← sejajar sisi kanan objRect
                    mainBtnRightX,
                    mainBtnBottom, // kanan-bawah ← sejajar sisi kanan objRect
                    mainBtnLeftX + cut,
                    mainBtnBottom, // potongan bawah
                    mainBtnLeftX,
                    mainBtnBottom - cut // potongan kiri
                ],
                0xffffff
            )
            .setOrigin(0, 0)
            .setStrokeStyle(3, 0x000000);

        const mainBtnCenterX = (mainBtnLeftX + mainBtnRightX) / 2;
        const mainBtnCenterY = (mainBtnTop + mainBtnBottom) / 2;
        const mainText = this.add.text(mainBtnCenterX, mainBtnCenterY, 'Main', { fontSize: '16px', color: '#000000' }).setOrigin(0.5);
=======
        const mainBtn = this.add.polygon(
            0, 0,
            [
                mainBtnLeftX, mainBtnTop,
                mainBtnRightX, mainBtnTop,
                mainBtnRightX, mainBtnBottom,
                mainBtnLeftX + cut, mainBtnBottom,
                mainBtnLeftX, mainBtnBottom - cut
            ],
            0xffffff
        ).setOrigin(0, 0).setStrokeStyle(3 * scale, 0x000000);

        const mainBtnCenterX = (mainBtnLeftX + mainBtnRightX) / 2;
        const mainBtnCenterY = (mainBtnTop + mainBtnBottom) / 2;
        const mainText = this.add.text(mainBtnCenterX, mainBtnCenterY, 'Main', {
            fontSize: `${16 * scale}px`,
            color: '#000000'
        }).setOrigin(0.5);
>>>>>>> 369bfae9487844f90a392ce70ef2332be327d199

        mainBtn.setInteractive({ useHandCursor: true });
        mainBtn.on('pointerdown', () => {
            this.sound.play('sfxClick');
            const targetScene = `Level${levelNumber}Scene`;
            if (this.scene.get(targetScene)) {
                this.scene.start(targetScene);
            } else {
                alert(`Level ${levelNumber} belum tersedia`);
            }
        });

        container.add([square, squareIcon, objRect, objText, mainBtn, mainText]);
        
        container.setScale(0);
        this.tweens.add({
            targets: container,
            scale: 1,
            duration: 200,
            ease: 'Back.Out'
        });

        return container;
    }

    update() {}
}
