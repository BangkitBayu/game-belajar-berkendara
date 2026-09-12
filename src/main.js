import Phaser from "phaser";
import phaserConfig from "./assets/configs/phaserConfig";

try {
    new Phaser.Game(phaserConfig)
    console.log("Game berhasil dijalankan")
} catch (error) {
    console.error(`Game gagal dijalankan: ${error}`)
}