import Phaser from "phaser";

/** @type {Phaser.Types.Core.GameConfig} */
const gameConfig = {
    type: Phaser.AUTO, 
    pixelArt: true,
    backgroundColor: "#f5f5f5",

    parent: 'game-container',

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
    scene: []
}

export default gameConfig