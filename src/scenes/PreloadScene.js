import Phaser from 'phaser';

export default class PreloadScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PreloadScene' });
    }

    preload() {
    const { width, height } = this.scale;
    const barBg = this.add.rectangle(width/2, height/2, 300, 20, 0x333333);
    const bar = this.add.rectangle(width/2 - 150, height/2, 0, 20, 0xffffff).setOrigin(0, 0.5);

    this.load.on('progress', (value) => {
        bar.width = 300 * value;
    });
    
    this.load.image('background', '/src/assets/background.png');
    this.load.audio('bgm', '/src/assets/sound/backsound.mp3');
    this.load.audio('sfxClick', '/src/assets/sound/click.mp3');

    // pindahan dari VehicleScene
    this.load.image('Mobil', '/src/assets/pilih_kendaraan/Mobil.png');
    this.load.image('Motor', '/src/assets/pilih_kendaraan/Motor.png');

    // pindahan dari LevelsScene
    this.load.image('level1', '/src/assets/levels/1.png');
    this.load.image('level2', '/src/assets/levels/2.png');
    this.load.image('level3', '/src/assets/levels/3.png');
    this.load.image('level4', '/src/assets/levels/4.png');
    this.load.image('level5', '/src/assets/levels/5.png');
}

    create() {
        this.scene.launch('MusicScene');
        this.scene.start('WelcomeScene');

    }

    update() {}
}
