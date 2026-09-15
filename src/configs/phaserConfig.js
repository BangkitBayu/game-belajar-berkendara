import Phaser from "phaser";
import WelcomeScene from "../scenes/WelcomeScene";
import LevelsScene from "../scenes/LevelsScene";
import VehicleScene from "../scenes/VehicleScene";
import BootScene from "../scenes/BootScene";
import PreloadScene from "../scenes/PreloadScene";
import MusicScene from "../scenes/MusicScene";
import Level1Scene from "../scenes/Levels/Level1Scene";

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

    // scene: [BootScene, PreloadScene, MusicScene, WelcomeScene, VehicleScene, LevelsScene]
    scene: [Level1Scene]
}

export default phaserConfig
