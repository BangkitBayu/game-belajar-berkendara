import Phaser from "phaser";
import StraightRoadMap from "../../classes/StraightRoadMap";
import Car from "../../classes/Car";
import Motorcyle from "../../classes/Motorcyle";
import StorageManager from "../../StorageManager";

export default class Level1Scene extends Phaser.Scene {
    constructor() {
        super({ key: "Level1Scene" })
    }

    preload() {
        // Aset kendaraan
        this.load.image("car_red", "/src/assets/kendaraan/car-red-top.png");
        this.load.image("motor_helm", "/src/assets/kendaraan/motor-top-helm.png");

        // 5 Tombol kontrol layar sesuai Product Scope
        this.load.image("btn_kiri", "/src/assets/Kiri.png");
        this.load.image("btn_kanan", "/src/assets/Kanan.png");
        this.load.image("btn_gas", "/src/assets/Atas.png");
        this.load.image("btn_rem", "/src/assets/Bawah.png");
        this.load.image("btn_bell", "/src/assets/Bell-removebg-preview.png");
    }

    create() {

        // Inisialisasi storage
        try {
            if (!StorageManager.index()) StorageManager.init();
        } catch (e) {
            console.warn("StorageManager fallback:", e);
        }

        // Menampung colliders static
        this.mapBounds = this.physics.add.staticGroup()

        // Menggambar jalan raya
        this.road = new StraightRoadMap(this, {
            x: 0,
            y: 0,
            width: window.innerWidth,
            height: window.innerHeight,
            roadWidth: 500,
            sidewalkWidth: 50
        }, this.mapBounds)

        // Kendaraan Pemain
        const vehicleChoice = this.registry.get("vehicle");
        this.isMotor = vehicleChoice?.motor;
        const playerKey = this.isMotor ? "motor_helm" : "car_red";

        const playerSfx = {
            horn: "hornSfx",
            gas: this.isMotor ? "motorcycleGassfx" : "carGasSfx",
            signal: "seinSfx"
        };

        if (this.isMotor) {
            this.player = new Motorcyle(this, this.roadCenterX, 3200, playerKey, playerSfx);
        } else {
            this.player = new Car(this, this.roadCenterX, 3200, playerKey, playerSfx);
        }

        this.player.setDisplaySize(this.isMotor ? 36 : 48, this.isMotor ? 75 : 88);
        this.player.body.setSize(this.isMotor ? 28 : 38, this.isMotor ? 65 : 76);
        this.player.setCollideWorldBounds(true).setDamping(true).setDrag(0.85).setDepth(12);


        //isika Tabrakan
        // Mencegah mobil/motor menabrak/melewati area trotoar
        this.physics.add.collider(this.player, this.mapBounds);

        // 5. Setup Kontrol Keyboard
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    update() {

    }
}