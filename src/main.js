import Phaser from "phaser";
import phaserConfig from "./configs/phaserConfig";
import { FONT_FAMILY } from "./configs/fonts";

try {
    document.fonts.load(`64px ${FONT_FAMILY}`).then(() => {
        new Phaser.Game(phaserConfig)
    })
    console.log("Game berhasil dijalankan")
} catch (error) {
    console.error(`Game gagal dijalankan: ${error}`)
}