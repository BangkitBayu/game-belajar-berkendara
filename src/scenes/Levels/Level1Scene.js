import Phaser from "phaser";

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
       
    }

    update() {

    }
}