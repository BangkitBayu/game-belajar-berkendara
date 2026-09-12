import Phaser from "phaser";

export default class LevelsScene extends Phaser.Scene {
    constructor() {
        super({ key: "LevelsScene" })
    }

    preload() {
        this.load.image('background', '/src/assets/background.png')
        this.load.audio('backsound', '/src/assets?sound/backsound.mp3')
        this.load.image('level1', '/src/assets/levels/1.png')
        this.load.image('level2', '/src/assets/levels/2.png')
        this.load.image('level3', '/src/assets/levels/3.png')
        this.load.image('level4', '/src/assets/levels/4.png')
        this.load.image('level5', '/src/assets/levels/5.png')
    }

    create() {
        const warna = 0xFFFFFF;
        // Untuk memasukkan background
        const background = this.add.image(0, 0, 'background').setOrigin(0, 0)
        background.setDisplaySize(this.scale.width, this.scale.height)
        background.setDepth(-1)

        // // Untuk memasukkan musik
        // const backsound = this.sound.add('backsound', { loop: true })
        // backsound.play();

        // Untuk mengambil nilai tengah x dan y
        const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2
        const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2

    const level1 = this.add.circle(screenCenterX-450, screenCenterY, 75, warna)
    const level2 = this.add.circle(screenCenterX-225, screenCenterY, 75, warna)
    const level3 = this.add.circle(screenCenterX, screenCenterY, 75, warna)
    const level4 = this.add.circle(screenCenterX+225, screenCenterY, 75, warna)
    const level5 = this.add.circle(screenCenterX+450, screenCenterY, 75, warna)

    const level1Icon = this.add.image(screenCenterX - 450, screenCenterY, 'level1')
level1Icon.setDisplaySize(100, 100)
        const level2Icon = this.add.image(screenCenterX-225, screenCenterY, 'level2')
level2Icon.setDisplaySize(100, 100)
        const level3Icon = this.add.image(screenCenterX, screenCenterY, 'level3')
level3Icon.setDisplaySize(100, 100)
        const level4Icon = this.add.image(screenCenterX+225, screenCenterY, 'level4')
level4Icon.setDisplaySize(100, 100)
        const level5Icon = this.add.image(screenCenterX+450, screenCenterY, 'level5')
level5Icon.setDisplaySize(100, 100)
    }

    update() {

    }
}