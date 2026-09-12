import Phaser from "phaser";

export default class WelcomeScene extends Phaser.Scene {
    constructor() {
        super({ key: "WelcomeScene" })
    }

    preload() {
        this.load.image('background', '/src/assets/background.png')
        this.load.audio('backsound', '/src/assets/sound/backsound.mp3')
    }

    create() {
        // Untuk memasukkan background
        const background = this.add.image(0, 0, 'background').setOrigin(0, 0)
        background.setDisplaySize(this.scale.width, this.scale.height)
        background.setDepth(-1)

        // Untuk memasukkan musik
        const backsound = this.sound.add('backsound', { loop: true })
        backsound.play();

        // Untuk mengambil nilai tengah x dan y
        const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2
        const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2

        document.fonts.load('16px "Pixelify Sans"').then(() => {
            this.add.text(screenCenterX, screenCenterY, 'Belajar Berkendara', {
                fontFamily: 'Pixelify Sans',
                fontSize: '64px',
                fontStyle: 'bold',
                color: '#FFB133'
            }).setOrigin(0.5)
        })
        document.fonts.load('16px "Pixelify Sans"').then(() => {
            this.add.text(screenCenterX, screenCenterY + 100, 'Klik area kosong untuk memulai permainan', {
                fontFamily: 'Pixelify Sans',
                fontSize: '42px',
                fontStyle: 'medium',
                color: '#ffffff'
            }).setOrigin(0.5)
        })
    }

    update() {

    }
}