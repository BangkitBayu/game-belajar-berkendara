import Phaser from "phaser";
import WelcomeScene from "../scenes/WelcomeScene";
import LevelsScene from "../scenes/LevelsScene";
import VehicleScene from "../scenes/VehicleScene";
import BootScene from "../scenes/BootScene";
import PreloadScene from "../scenes/PreloadScene";
import MusicScene from "../scenes/MusicScene";

/** @type {Phaser.Types.Core.GameConfig} */
const phaserConfig = {
    type: Phaser.AUTO,
    pixelArt: true,
    backgroundColor: "#f5f5f5",

    parent: 'game-container',

    width: window.innerWidth,
    height: window.innerHeight,

    scale: {
        autoCenter: Phaser.Scale.CENTER_BOTH,
        mode: Phaser.Scale.RESIZE,

    },


    physics: {
        default: "arcade",
        arcade: {
            gravity: { x: 0, y: 0 },
            debug: true
        }
    },

    // Urutan scene game
    scene: [BootScene, PreloadScene, MusicScene, WelcomeScene,VehicleScene, LevelsScene]
}

export default phaserConfig