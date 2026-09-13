import Phaser from 'phaser';

const LEVELS_DATA = {
    1: { iconKey: 'level1', objective: 'ini level 1', mainLabel: 'main' },
    2: { iconKey: 'level2', objective: 'ini level 2', mainLabel: 'main' },
    3: { iconKey: 'level3', objective: 'ini level 3', mainLabel: 'main' },
    4: { iconKey: 'level4', objective: 'ini level 4', mainLabel: 'main' },
    5: { iconKey: 'level5', objective: 'ini level 5', mainLabel: 'main' },
};

export default class LevelsScene extends Phaser.Scene {
    constructor() {
        super({ key: 'LevelsScene' });
    }

    create() {
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
            { circle: level5, x: screenCenterX + 450, num: 5 },
        ];

        levelPositions.forEach(({ circle, x, num }) => {
            circle.setInteractive({ useHandCursor: true });
            circle.on('pointerdown', () => {
                this.sound.play('sfxClick');
                this.toggleLevelMenu(x, screenCenterY, num);
            });
        });

        //tombol back bentuk segitiga
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
            this.sound.play('sfxClick');
            this.scene.start('WelcomeScene');
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

    showLevelMenu(x, y, levelNumber) {
    const data = LEVELS_DATA[levelNumber];

    const container = this.add.container(x, y - 180);
    container.levelNumber = levelNumber;

    // ukuran tabel
    const colKendaraanWidth = 70;
    const colObjektifWidth = 100;
    const rowHeight = 70;
    const tableWidth = colKendaraanWidth + colObjektifWidth;

    // border luar tabel
    const tableBorder = this.add.rectangle(0, 0, tableWidth, rowHeight, 0xffffff)
        .setStrokeStyle(3, 0x000000);

    // garis pemisah kolom
    const divider = this.add.rectangle(-tableWidth / 2 + colKendaraanWidth, 0, 3, rowHeight, 0x000000);

    // kolom kiri: icon kendaraan
    const kendaraanIcon = this.add.image(-tableWidth / 2 + colKendaraanWidth / 2, 0, data.iconKey)
        .setDisplaySize(45, 45);

    // kolom kanan: teks objektif
    const objektifText = this.add.text(
        -tableWidth / 2 + colKendaraanWidth + colObjektifWidth / 2,
        0,
        data.objective,
        { fontSize: '12px', color: '#000000', align: 'center', wordWrap: { width: colObjektifWidth - 10 } }
    ).setOrigin(0.5);

    // tombol Main: kotak, sudut kanan-bawah dipotong
    const mainBtnSize = 60;
    const cut = 20;
    const mainBtnX = tableWidth / 2 - mainBtnSize / 2 + 10;
    const mainBtnY = rowHeight / 2 + mainBtnSize / 2 + 20;

    const mainBtn = this.add.polygon(
        mainBtnX,
        mainBtnY,
        [
            -mainBtnSize / 2, -mainBtnSize / 2,
            mainBtnSize / 2, -mainBtnSize / 2,
            mainBtnSize / 2, mainBtnSize / 2 - cut,
            mainBtnSize / 2 - cut, mainBtnSize / 2,
            -mainBtnSize / 2, mainBtnSize / 2,
        ],
        0xffffff
    ).setStrokeStyle(3, 0x000000);

    const mainText = this.add.text(mainBtnX, mainBtnY, 'Main', { fontSize: '12px', color: '#000000' }).setOrigin(0.5);

    mainBtn.setInteractive({ useHandCursor: true });
    mainBtn.on('pointerdown', () => {
        this.sound.play('sfxClick');
        // TODO: mulai level di sini
    });

    container.add([tableBorder, divider, kendaraanIcon, objektifText, mainBtn, mainText]);
    container.setScale(0);

    this.tweens.add({
        targets: container,
        scale: 1,
        duration: 200,
        ease: 'Back.Out',
    });

    return container;
}
 
    update() {}
}