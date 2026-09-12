import Phaser from "phaser";
import { TEXT_STYLES } from "../configs/fonts";

export default class WelcomeScene extends Phaser.Scene {
    constructor() {
        super({ key: "WelcomeScene" })
    }

    preload() {
        // Image asset
        this.load.image('background', '/src/assets/background.png')

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

    }

    update() {

    }
}