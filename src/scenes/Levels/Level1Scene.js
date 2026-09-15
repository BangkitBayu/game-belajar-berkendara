import Phaser from "phaser";

export default class Level1Scene extends Phaser.Scene {
    constructor() {
        super({ key: "Level1Scene" })
    }

    preload() {
        this.load.tilemapTiledJSON("tilemap_json", "/src/assets/mapJson/jalan_base_json.tmj");
        this.load.image("tilemap_img", "/src/assets/map/jalan_base.png");
    }

    create() {
        const map = this.make.tilemap({ key: "tilemap_json" });

        // Parameter pertama 'roads' SAMA PERSIS dengan nama tileset (bukan 'tanah')
        const tileset = map.addTilesetImage("tanah", "tileset_key");

        // 'Tile Layer 1' SAMA PERSIS dengan nama di JSON kamu ("name": "Tile Layer 1")
        const jalanLayer = map.createLayer('Tile Layer 1', tileset, 0, 0);
    }

    update() {

    }
}