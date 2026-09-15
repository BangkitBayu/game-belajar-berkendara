import BaseScene from './BaseScene';
import { TEXT_STYLES } from "../configs/fonts";
import StorageManager from '../StorageManager';

export default class WelcomeScene extends BaseScene {
    constructor() {
        super({ key: "WelcomeScene" })
    }

    preload() {
        // Image asset
        this.load.image('background', '/src/assets/background.png')
        this.load.image('logo', '/src/assets/logo.png')
        this.load.image('iconSoundOn', '/src/assets/sound-on.png')
        this.load.image('iconSoundOff', '/src/assets/sound-off.png')
    }

    create() {
        super.create();

        let isMuted = StorageManager.show('isSoundOn')

        const width = this.scale.width;
        const height = this.scale.height;
        const centerX = width / 2;

        // 1. BACKGROUND: Stretch cuman ke kanan & kiri (tinggi terkunci mengikuti skala rasio asli)
        const background = this.add.image(0, 0, 'background').setOrigin(0, 0);
        background.displayWidth = width;       // Penuhi lebar ke samping
        background.scaleY = background.scaleX; // Cegah stretch/penyok ke atas-bawah
        background.setDepth(-1);

        // 2. SKALA ELEMEN UI (Proporsional berdasarkan layar)
        const baseWidth = 1280;
        const baseHeight = 720;
        const scaleFactor = Math.min(width / baseWidth, height / baseHeight);

        // 3. SOUND BUTTON
        const soundBtn = this.add.image(width - (20 * scaleFactor), 20 * scaleFactor, isMuted ? 'iconSoundOn' : 'iconSoundOff')
            .setScale(0.4 * scaleFactor)
            .setOrigin(1, 0)
            .setInteractive({ useHandCursor: true });

        // 4. TITLE
        const title = this.add.text(centerX, height * 0.25, 'Belajar Berkendara', TEXT_STYLES.title)
            .setOrigin(0.5)
            .setScale(scaleFactor);

        // 5. LOGO
        const logo = this.add.image(centerX, height * 0.50, 'logo')
            .setOrigin(0.5)
            .setScale(0.2 * scaleFactor);

        // 6. DESCRIPTION
        const description = this.add.text(centerX, height * 0.80, 'Klik area kosong untuk memulai permainan', TEXT_STYLES.description)
            .setOrigin(0.5)
            .setScale(scaleFactor);

        // Events
        soundBtn.on('pointerdown', (pointer, localX, localY, event) => {
            event.stopPropagation()
            const musicScene = this.scene.get('MusicScene')
            isMuted = musicScene.toggleMuted()
            soundBtn.setTexture(isMuted ? 'iconSoundOn' : 'iconSoundOff')
        })

        this.input.once('pointerdown', () => {
            this.sound.play('sfxClick')
            this.scene.start('VehicleScene')
        })
    }

    update() {

    }
}