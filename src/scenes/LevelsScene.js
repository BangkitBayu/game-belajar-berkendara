import Phaser from "phaser";

export default class LevelsScene extends Phaser.Scene {
    constructor() {
        super({ key: "LevelsScene" })
    }

    preload() {
        this.load.on('loaderror', (file) => {
            console.log('GAGAL LOAD:', file.key, file.src)
        })

        this.load.image('background', '/src/assets/background.png')
        this.load.audio('backsound', '/src/assets/sound/backsound.mp3')
        this.load.image('level1', '/src/assets/levels/1.png')
        this.load.image('level2', '/src/assets/levels/2.png')
        this.load.image('level3', '/src/assets/levels/3.png')
        this.load.image('level4', '/src/assets/levels/4.png')
        this.load.image('level5', '/src/assets/levels/5.png')
    }

    create() {
        const warna = 0xFFFFFF;

        // background
        const background = this.add.image(0, 0, 'background').setOrigin(0, 0)
        background.setDisplaySize(this.scale.width, this.scale.height)
        background.setDepth(-1)

        // musik — cek dulu key-nya ada di cache biar gak crash kalau gagal load
        if (this.cache.audio.exists('backsound')) {
            const backsound = this.sound.add('backsound', { loop: true })
            backsound.play()
        } else {
            console.warn('backsound belum keload, cek Network tab / path file')
        }

        // titik tengah
        const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2
        const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2

        // garis penghubung antar level
        const graphics = this.add.graphics()
        graphics.fillStyle(0xD3D3D3, 1)
        graphics.fillRoundedRect(screenCenterX-450, screenCenterY, 225, 10, 5)
        graphics.fillRoundedRect(screenCenterX-225, screenCenterY, 225, 10, 5)
        graphics.fillRoundedRect(screenCenterX, screenCenterY, 225, 10, 5)
        graphics.fillRoundedRect(screenCenterX+225, screenCenterY, 225, 10, 5)

        // lingkaran level + shadow manual
        const offset = 5

        const shadow1 = this.add.circle(screenCenterX-450+offset, screenCenterY+offset, 75, 0x000000, 0.3)
        const level1 = this.add.circle(screenCenterX-450, screenCenterY, 75, warna)

        const shadow2 = this.add.circle(screenCenterX-225+offset, screenCenterY+offset, 75, 0x000000, 0.3)
        const level2 = this.add.circle(screenCenterX-225, screenCenterY, 75, warna)

        const shadow3 = this.add.circle(screenCenterX+offset, screenCenterY+offset, 75, 0x000000, 0.3)
        const level3 = this.add.circle(screenCenterX, screenCenterY, 75, warna)

        const shadow4 = this.add.circle(screenCenterX+225+offset, screenCenterY+offset, 75, 0x000000, 0.3)
        const level4 = this.add.circle(screenCenterX+225, screenCenterY, 75, warna)

        const shadow5 = this.add.circle(screenCenterX+450+offset, screenCenterY+offset, 75, 0x000000, 0.3)
        const level5 = this.add.circle(screenCenterX+450, screenCenterY, 75, warna)

        // icon level
        const level1Icon = this.add.image(screenCenterX-450, screenCenterY, 'level1')
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