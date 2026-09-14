import Phaser from "phaser";
import StorageManager from "../StorageManager";

export default class MusicScene extends Phaser.Scene {
    constructor() {
        super({ key: "MusicScene" })
    }

    create() {
        if (this.cache.audio.exists('bgm')) {
            const isSoundOn = StorageManager.show('isSoundOn');
            this.bgm = this.sound.add('bgm', { loop: true, mute: !isSoundOn })
            this.bgm.play()
        } else {
            console.warn('bgm gagal keload, cek Network tab / path file')
        }
    }

    toggleMuted() {
        if (!this.bgm) return false
        this.bgm.mute = !this.bgm.mute
        StorageManager.set('isSoundOn', this.bgm.mute)
        return this.bgm.mute
    }
}
