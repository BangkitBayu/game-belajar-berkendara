import Phaser from "phaser";

export default class MusicScene extends Phaser.Scene {
    constructor() {
        super({ key: "MusicScene" })
    }

    create() {
        if (this.cache.audio.exists('bgm')) {
            this.bgm = this.sound.add('bgm', { loop: true })
            this.bgm.play()
        } else {
            console.warn('bgm gagal keload, cek Network tab / path file')
        }
    }

    toggleMuted() {
        if (!this.bgm) return false
        this.bgm.mute = !this.bgm.mute
        return this.bgm.mute
    }
}
