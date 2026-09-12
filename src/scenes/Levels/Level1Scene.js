import Phaser from "phaser";

export default class Level1Scene extends Phaser.Scene {
    constructor() {
        super({ key: "Level1Scene" })
    }

    preload() {
        this.load.tilemapTiledJSON("map_key", "/../src/assets/mapJson/zona_hunian.tmj");
        this.load.image("tileset_key", "/../src/assets/map/zona_hunian.png");
    }

    create() {
        const map = this.make.tilemap({ key: "map_key" });

        // Parameter pertama 'roads' SAMA PERSIS dengan nama tileset (bukan 'tanah')
        const tileset = map.addTilesetImage("tanah", "tileset_key");
        const mobil = map.addTilesetImage("car", "tileset_key");

        // 'Tile Layer 1' SAMA PERSIS dengan nama di JSON kamu ("name": "Tile Layer 1")
        const tanahLayer = map.createLayer('Tile Layer 1', tileset, 0, 0);
        const mobilLayer = map.createLayer('Tile Layer 1', mobil, 0, 0);
    }

    update() {

    }
    //tes
}