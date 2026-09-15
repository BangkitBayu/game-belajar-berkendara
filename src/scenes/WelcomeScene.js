import BaseScene from './BaseScene';
import { TEXT_STYLES } from "../configs/fonts";
import StorageManager from '../StorageManager';

export default class WelcomeScene extends BaseScene {
    constructor() {
        super({ key: "WelcomeScene" });
    }

    preload() {
        // Path tetep nganggo aslimu
        this.load.image('background', '/src/assets/background.png');
        this.load.image('logo', '/src/assets/logo.png');
        this.load.image('iconSoundOn', '/src/assets/sound-on.png');
        this.load.image('iconSoundOff', '/src/assets/sound-off.png');
    }

    create() {
        super.create();

        let isMuted = StorageManager.show('isSoundOn');

        const width = this.scale.width;
        const height = this.scale.height;
        const centerX = width / 2;

        const background = this.add.image(0, 0, 'background').setOrigin(0, 0);
        background.setDisplaySize(width, height);
        background.setDepth(-1);

        const baseWidth = 1280;
        const baseHeight = 720;
        const scaleFactor = Math.max(0.5, Math.min(width / baseWidth, height / baseHeight));

        // Muted -> Icon sound-off
        const soundBtn = this.add.image(
            width - (20 * scaleFactor), 
            20 * scaleFactor, 
            isMuted ? 'iconSoundOff' : 'iconSoundOn'
        )
            .setScale(0.4 * scaleFactor)
            .setOrigin(1, 0)
            .setInteractive({ useHandCursor: true });

        const title = this.add.text(centerX, height * 0.2, 'Belajar Berkendara', TEXT_STYLES.title)
            .setOrigin(0.5)
            .setScale(scaleFactor);

        const logo = this.add.image(centerX, height * 0.5, 'logo')
            .setOrigin(0.5)
            .setScale(0.2 * scaleFactor);

        const description = this.add.text(centerX, height * 0.8, 'Klik area kosong untuk memulai permainan', TEXT_STYLES.description)
            .setOrigin(0.5)
            .setScale(scaleFactor);

        soundBtn.on('pointerdown', (pointer, localX, localY, event) => {
            event.stopPropagation();
            const musicScene = this.scene.get('MusicScene');
            if (musicScene) {
                isMuted = musicScene.toggleMuted();
                soundBtn.setTexture(isMuted ? 'iconSoundOff' : 'iconSoundOn');
            }
        });

        this.input.once('pointerdown', () => {
            this.sound.play('sfxClick');
            this.scene.start('VehicleScene');
        });
    }

    update() {}
}