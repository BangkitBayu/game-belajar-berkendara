import Phaser from "phaser";
import WelcomeScene from "../scenes/WelcomeScene";
import LevelsScene from "../scenes/LevelsScene";
import VehicleScene from "../scenes/VehicleScene";
import BootScene from "../scenes/BootScene";
import PreloadScene from "../scenes/PreloadScene";
import MusicScene from "../scenes/MusicScene";
import Level1Scene from "../scenes/Levels/Level1Scene";

import Level3Scene from "../scenes/Levels/Level3Scene";

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

    // Bisa langsung tes Level3Scene atau main lewat alur game lengkap:
    // scene: [Level3Scene]
    scene: [BootScene, PreloadScene, MusicScene, WelcomeScene, VehicleScene, LevelsScene, Level1Scene, Level3Scene]
}

export default phaserConfig
