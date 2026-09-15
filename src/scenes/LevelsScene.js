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

        // background
        const background = this.add.image(0, 0, 'background').setOrigin(0, 0);
        background.setDisplaySize(this.scale.width, this.scale.height);
        background.setDepth(-1);

        // titik tengah
        const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
        const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;

        // garis penghubung antar level
        const graphics = this.add.graphics();
        graphics.fillStyle(0xd3d3d3, 1);

        const offset = 5;

        // shadow line
        graphics.fillStyle(0x000000, 0.3);
        graphics.fillRoundedRect(screenCenterX - 450 + offset, screenCenterY + offset, 225, 10, 5);
        graphics.fillRoundedRect(screenCenterX - 225 + offset, screenCenterY + offset, 225, 10, 5);
        graphics.fillRoundedRect(screenCenterX + offset, screenCenterY + offset, 225, 10, 5);
        graphics.fillRoundedRect(screenCenterX + 225 + offset, screenCenterY + offset, 225, 10, 5);

        // line asli
        graphics.fillStyle(0xd3d3d3, 1);
        graphics.fillRoundedRect(screenCenterX - 450, screenCenterY, 225, 10, 5);
        graphics.fillRoundedRect(screenCenterX - 225, screenCenterY, 225, 10, 5);
        graphics.fillRoundedRect(screenCenterX, screenCenterY, 225, 10, 5);
        graphics.fillRoundedRect(screenCenterX + 225, screenCenterY, 225, 10, 5);
        // lingkaran level

        const shadowLevel1 = this.add.circle(screenCenterX - 450 + offset, screenCenterY + offset, 75, 0x000000, 0.3);
        const level1 = this.add.circle(screenCenterX - 450, screenCenterY, 75, warna);

        const shadowLevel2 = this.add.circle(screenCenterX - 225 + offset, screenCenterY + offset, 75, 0x000000, 0.3);
        const level2 = this.add.circle(screenCenterX - 225, screenCenterY, 75, warna);

        const shadowLevel3 = this.add.circle(screenCenterX + offset, screenCenterY + offset, 75, 0x000000, 0.3);
        const level3 = this.add.circle(screenCenterX, screenCenterY, 75, warna);

        const shadowLevel4 = this.add.circle(screenCenterX + 225 + offset, screenCenterY + offset, 75, 0x000000, 0.3);
        const level4 = this.add.circle(screenCenterX + 225, screenCenterY, 75, warna);

        const shadowLevel5 = this.add.circle(screenCenterX + 450 + offset, screenCenterY + offset, 75, 0x000000, 0.3);
        const level5 = this.add.circle(screenCenterX + 450, screenCenterY, 75, warna);

        // icon level
        const level1Icon = this.add.image(screenCenterX - 450, screenCenterY, 'level1');
        level1Icon.setDisplaySize(100, 100);

        const level2Icon = this.add.image(screenCenterX - 225, screenCenterY, 'level2');
        level2Icon.setDisplaySize(100, 100);

        const level3Icon = this.add.image(screenCenterX, screenCenterY, 'level3');
        level3Icon.setDisplaySize(100, 100);

        const level4Icon = this.add.image(screenCenterX + 225, screenCenterY, 'level4');
        level4Icon.setDisplaySize(100, 100);

        const level5Icon = this.add.image(screenCenterX + 450, screenCenterY, 'level5');
        level5Icon.setDisplaySize(100, 100);

        const levelPositions = [
            { circle: level1, x: screenCenterX - 450, num: 1 },
            { circle: level2, x: screenCenterX - 225, num: 2 },
            { circle: level3, x: screenCenterX, num: 3 },
            { circle: level4, x: screenCenterX + 225, num: 4 },
            { circle: level5, x: screenCenterX + 450, num: 5 }
        ];

        levelPositions.forEach(({ circle, num }) => {
            circle.setInteractive({ useHandCursor: true });
            circle.on('pointerdown', () => {
                this.sound.play('sfxClick');
                this.toggleLevelMenu(screenCenterX, screenCenterY, num);
            });
        });

        //tombol back bentuk segitiga
        const size = 70;

        // shadow
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

        const container = this.add.container(screenCenterX, screenCenterY - 180);
        container.levelNumber = levelNumber;

        const circleRadius = 75;
        const level1X = -450;
        const level3X = 0;
        const level5X = 450;

        const rowHeight = 140;
        const squareSize = 140;
        const gap = 20;

        // pilih icon kendaraan sesuai pilihan user di VehicleScene
        const vehicle = this.registry.get('vehicle');
        const vehicleKey = vehicle && vehicle.motor ? 'motor' : 'mobil';

        // kotak icon
        const square = this.add.rectangle(level1X, 0, squareSize, rowHeight, 0xffffff).setStrokeStyle(3, 0x000000);
        const squareIcon = this.add.image(level1X, 0, vehicleKey).setDisplaySize(90, 90);

        // persegi objektif
        const objLeftX = level1X + squareSize / 2;
        const objRightX = level5X + circleRadius;
        const objWidth = objRightX - objLeftX;
        const objLocalX = (objLeftX + objRightX) / 2;

        const objRect = this.add.rectangle(objLocalX, 0, objWidth, rowHeight, 0xffffff).setStrokeStyle(3, 0x000000);
        const objText = this.add
            .text(objLocalX, 0, data.objective, {
                fontSize: '12px',
                color: '#000000',
                align: 'center',
                wordWrap: { width: objWidth - 20 }
            })
            .setOrigin(0.5);

        // tombol Main (bentuk pedal gas: persegi, pojok kiri-bawah kepotong miring)
        const circleLocalY = 180;
        const mainBtnHeight = 60;
        const cut = 20;
        const gapFromCircle = 40;

        const mainBtnTop = circleLocalY + circleRadius + gapFromCircle;
        const mainBtnBottom = mainBtnTop + mainBtnHeight;
        const mainBtnLeftX = level3X - circleRadius;
        const mainBtnRightX = objRightX; // presisi, sama persis sisi kanan objRect

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
