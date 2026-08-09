import Phaser from "phaser";
import gameConfig from "./config";

try {
    new Phaser.Game(gameConfig)
    console.log("Game berhasil dijalankan")
} catch (error) {
    console.error(`Game gagal dijalankan: ${error}`)
}