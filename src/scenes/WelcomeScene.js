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
        // Jarak antar elemen
        let gap = 20

        let isMuted = StorageManager.show('isSoundOn')

        // Ambil bgm music

        // Untuk memasukkan background
        const background = this.add.image(0, 0, 'background').setOrigin(0, 0)
        background.setDisplaySize(this.scale.width, this.scale.height)

        background.setDepth(-1)
        const soundBtn = this.add.image(this.scale.width - 20, 10, isMuted ? 'iconSoundOn' : 'iconSoundOff').setScale(0.4).setOrigin(1, 0).setInteractive({ useHandCursor: true })

        // Untuk mengambil nilai tengah x dan y
        const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2



        const title = this.add.text(screenCenterX, 200, 'Belajar Berkendara', TEXT_STYLES.title).setOrigin(0.5);

        const logo = this.add.image(screenCenterX, 0, 'logo').setScale(0.2)
        logo.y = (title.y + title.height / 2) + (logo.displayHeight / 2 + gap)

        const description = this.add.text(screenCenterX, 0, 'Klik area kosong untuk memulai permainan', TEXT_STYLES.description).setOrigin(0.5);

        description.y = (logo.y + logo.displayHeight / 2) + (description.height / 2 + gap);

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