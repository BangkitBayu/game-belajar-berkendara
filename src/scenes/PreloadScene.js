import Phaser from "phaser";

export default class PreloadScene extends Phaser.Scene {
    constructor() {
        super({ key: "PreloadScene" })
    }

    preload() {
        this.load.audio('bgm', '/src/assets/sound/backsound.mp3')
        this.load.audio('sfxClick' , '/src/assets/sound/click.mp3')

    }

    create() {
        this.scene.launch('MusicScene')
        this.scene.start('WelcomeScene')
    }

    update() {

    }
}