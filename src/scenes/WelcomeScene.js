import Phaser from "phaser";
import { TEXT_STYLES } from "../configs/fonts";

export default class WelcomeScene extends Phaser.Scene {
    constructor() {
        super({ key: "WelcomeScene" })
    }

    preload() {
        // Image asset
        this.load.image('background', '/src/assets/background.png')
        this.load.image('logo', '/src/assets/logo.png')

        // Sound asset
        this.load.audio('backsound', '/src/assets/sound/backsound.mp3')
        this.load.audio('click', '/src/assets/sound/click.mp3');
    }

    create() {
        // Jarak antar elemen
        let gap = 20

        // Untuk memasukkan background
        const background = this.add.image(0, 0, 'background').setOrigin(0, 0)
        background.setDisplaySize(this.scale.width, this.scale.height)
        background.setDepth(-1)

        // Untuk memasukkan musik
        const backsound = this.sound.add('backsound', { loop: true })
        backsound.play();

        const clickSfx = this.sound.add('click')

        // Untuk mengambil nilai tengah x dan y
        const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2
        const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2

        const title = this.add.text(screenCenterX, 200, 'Belajar Berkendara', TEXT_STYLES.title).setOrigin(0.5);

        const logo = this.add.image(screenCenterX, 0, 'logo').setScale(0.2)
        logo.y = (title.y + title.height / 2) + (logo.displayHeight / 2 + gap)

        const description = this.add.text(screenCenterX, 0, 'Klik area kosong untuk memulai permainan', TEXT_STYLES.description).setOrigin(0.5);

        description.y = (logo.y + logo.displayHeight / 2) + (description.height / 2 + gap);

        this.input.once('pointerdown', () => {
            clickSfx.play();
            this.scene.start('LevelsScene')
        })
    }

    update() {

    }
}