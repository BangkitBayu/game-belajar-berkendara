import Phaser from "phaser";

export default class MusicScene extends Phaser.Scene {
    constructor() {
        super({ key: "MusicScene" })
    }

    create() {
        this.bgm = this.sound.add('bgm', { loop: true })

        this.bgm.play()

    }

    toggleMuted() {
        this.bgm.mute = !this.bgm.mute

        return this.bgm.mute
    }
}