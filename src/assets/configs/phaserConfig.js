import Phaser from "phaser";
import WelcomeScene from "../../scenes/WelcomeScene";
import LevelsScene from "../../scenes/LevelsScene";

/** @type {Phaser.Types.Core.GameConfig} */
const gameConfig = {
    type: Phaser.AUTO,
    pixelArt: true,
    backgroundColor: "#f5f5f5",

    parent: 'game-container',

    // width: Math.ceil(window.innerWidth / 64),
    // height: Math.ceil(window.innerHeight / 64),
    width: Math.ceil(window.innerWidth / 64),
    height: Math.ceil(window.innerHeight / 64),

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
    scene: [WelcomeScene, LevelsScene]
}

export default gameConfig