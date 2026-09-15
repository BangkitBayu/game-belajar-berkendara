import Phaser from "phaser";
import StorageManager from "../../StorageManager";

export default class Level3Scene extends Phaser.Scene {
    constructor() {
        super({ key: "Level3Scene" });
    }

    preload() {
        // Referensi tilemap & road dari Level1Scene
        this.load.tilemapTiledJSON("tilemap_json", "/src/assets/mapJson/jalan_base_json.tmj");
        this.load.image("tilemap_img", "/src/assets/map/jalan_base.png");

        // Kendaraan
        this.load.image("car_red", "/src/assets/kendaraan/car-red-top.png");
        this.load.image("motor_helm", "/src/assets/kendaraan/motor-top-helm.png");
        this.load.image("motor_nohelm", "/src/assets/kendaraan/motor-top-without-helm.png");

        // 5 Tombol kontrol layar sesuai PRODUCT SCOPE
        this.load.image("btn_kiri", "/src/assets/Kiri.png");
        this.load.image("btn_kanan", "/src/assets/Kanan.png");
        this.load.image("btn_gas", "/src/assets/Atas.png");
        this.load.image("btn_rem", "/src/assets/Bawah.png");
        this.load.image("btn_bell", "/src/assets/Bell-removebg-preview.png");

        // Audio
        this.load.audio("sfxClick", "/src/assets/sound/click.mp3");
    }

    create() {
        // Inisialisasi storage bila belum
        try {
            if (!StorageManager.index()) {
                StorageManager.init();
            }
        } catch (e) {
            console.warn("StorageManager init fallback:", e);
        }

        this.isGameStarted = false;
        this.gameEnded = false;
        this.winTriggered = false;

        // Level 3 Objectives:
        // 1. Menjaga jarak dengan kendaraan di depan selama 10 detik
        // 2. Memberi jalan ke pejalan kaki
        this.targetDistanceDuration = 10.0;
        this.currentDistanceDuration = 0.0;
        this.goalDistanceCompleted = false;

        this.goalPedestrianCompleted = false;
        this.pedestrianState = "waiting"; // waiting, crossing, finished
        this.playerYieldedProperly = false;

        // Dimensi dunia game (vertikal menyusuri jalan)
        this.worldWidth = Math.max(this.scale.width, 800);
        this.worldHeight = 4500;
        this.roadCenterX = this.worldWidth / 2;
        this.roadWidth = 360;

        this.physics.world.setBounds(0, 0, this.worldWidth, this.worldHeight);

        // Buat lintasan jalan & lingkungan
        this.createEnvironment();

        // Zebra Cross & Pejalan Kaki di Y = 1600
        this.zebraCrossY = 1600;
        this.createZebraCrossAndPedestrian(this.zebraCrossY);

        // Posisi awal kendaraan:
        // Lead vehicle di Y = 2980, Player di Y = 3200 (Jarak awal 220px, pas di rentang jarak aman)
        this.leadVehicleSpeed = 100;
        this.leadVehicleCruiseSpeed = 110;
        this.createLeadVehicle(this.roadCenterX, 2980);

        this.createPlayer(this.roadCenterX, 3200);

        // Visual garis bracket jarak aman antara mobil depan dan player
        this.distanceGuideGraphics = this.add.graphics().setDepth(15);

        // Kamera mengikuti player tanpa efek zoom (zoom 1:1)
        this.cameras.main.setZoom(1);
        this.cameras.main.setBounds(0, 0, this.worldWidth, this.worldHeight);
        this.cameras.main.startFollow(this.player, true, 0.1, 0.1, 0, 160);

        // Audio synth (bell horn & sein clack)
        this.initAudioAndEffects();

        // Kontrol input (Keyboard & 5 Tombol Layar)
        this.createControls();

        // Dashboard & HUD
        this.createHUD();

        // Pop-up Instruksi Awal (dapat ditutup dengan tombol MULAI, klik layar, atau tombol keyboard apa saja)
        this.showObjectiveIntro();
    }

    // ==========================================
    // LINGKUNGAN & JALAN RAYA
    // ==========================================
    createEnvironment() {
        const bg = this.add.graphics();
        bg.fillStyle(0x3e7b37, 1);
        bg.fillRect(0, 0, this.worldWidth, this.worldHeight);

        const roadLeft = this.roadCenterX - this.roadWidth / 2;
        const roadRight = this.roadCenterX + this.roadWidth / 2;

        // Trotoar samping
        const sidewalkWidth = 26;
        const sidewalkGraphics = this.add.graphics();
        sidewalkGraphics.fillStyle(0xcccccc, 1);
        sidewalkGraphics.fillRect(roadLeft - sidewalkWidth, 0, sidewalkWidth, this.worldHeight);
        sidewalkGraphics.fillRect(roadRight, 0, sidewalkWidth, this.worldHeight);

        // Pembatas trotoar garis hitam-putih
        for (let y = 0; y < this.worldHeight; y += 40) {
            sidewalkGraphics.fillStyle(y % 80 === 0 ? 0xffffff : 0x222222, 1);
            sidewalkGraphics.fillRect(roadLeft - 6, y, 6, 40);
            sidewalkGraphics.fillRect(roadRight, y, 6, 40);
        }

        // Aspal jalan utama
        const roadGraphics = this.add.graphics();
        roadGraphics.fillStyle(0x2d3436, 1);
        roadGraphics.fillRect(roadLeft, 0, this.roadWidth, this.worldHeight);

        // Garis tepi jalan (Solid White Line)
        roadGraphics.lineStyle(4, 0xffffff, 0.9);
        roadGraphics.lineBetween(roadLeft + 10, 0, roadLeft + 10, this.worldHeight);
        roadGraphics.lineBetween(roadRight - 10, 0, roadRight - 10, this.worldHeight);

        // Garis putus-putus pembagi lajur tengah
        const laneX = this.roadCenterX;
        for (let y = 0; y < this.worldHeight; y += 70) {
            roadGraphics.fillStyle(0xffffff, 0.85);
            roadGraphics.fillRect(laneX - 3, y, 6, 42);
        }

        // Pepohonan di pinggir jalan
        for (let y = 200; y < this.worldHeight; y += 320) {
            const treeLeftX = roadLeft - 60;
            const treeRightX = roadRight + 60;
            this.add.circle(treeLeftX, y, 22, 0x1e5a22, 0.9);
            this.add.circle(treeLeftX - 5, y - 5, 16, 0x2e7d32, 1);
            this.add.circle(treeRightX, y, 22, 0x1e5a22, 0.9);
            this.add.circle(treeRightX + 5, y - 5, 16, 0x2e7d32, 1);
        }

        // Batas fisik tepi jalan agar tidak keluar jalur
        this.roadBounds = this.physics.add.staticGroup();
        const leftWall = this.add.rectangle(roadLeft + 5, this.worldHeight / 2, 10, this.worldHeight, 0x000000, 0);
        const rightWall = this.add.rectangle(roadRight - 5, this.worldHeight / 2, 10, this.worldHeight, 0x000000, 0);
        this.roadBounds.add(leftWall);
        this.roadBounds.add(rightWall);
    }

    // ==========================================
    // ZEBRA CROSS & PEJALAN KAKI (GOAL 2)
    // ==========================================
    createZebraCrossAndPedestrian(zebraY) {
        const roadLeft = this.roadCenterX - this.roadWidth / 2;
        const roadRight = this.roadCenterX + this.roadWidth / 2;

        const stopLineY = zebraY + 80;
        this.stopLineY = stopLineY;

        this.zebraGraphics = this.add.graphics();
        // Garis henti (Stop line)
        this.zebraGraphics.fillStyle(0xffffff, 1);
        this.zebraGraphics.fillRect(roadLeft + 12, stopLineY, this.roadWidth - 24, 10);

        // Tulisan STOP di aspal
        this.stopText = this.add.text(this.roadCenterX, stopLineY + 30, "STOP", {
            fontSize: "24px",
            fontStyle: "bold",
            color: "#ffffff"
        }).setOrigin(0.5);

        // Belang Zebra Cross
        const zebraStripCount = 10;
        const stripWidth = (this.roadWidth - 40) / zebraStripCount;
        for (let i = 0; i < zebraStripCount; i++) {
            if (i % 2 === 0) {
                this.zebraGraphics.fillStyle(0xffffff, 1);
                this.zebraGraphics.fillRect(roadLeft + 20 + i * stripWidth, zebraY - 35, stripWidth, 70);
            }
        }

        // Rambu Zebra Cross di trotoar
        this.signLeft = this.createZebraSign(roadLeft - 35, zebraY);
        this.signRight = this.createZebraSign(roadRight + 35, zebraY);

        // Pejalan Kaki
        this.pedestrianStartX = roadLeft - 15;
        this.pedestrianTargetX = roadRight + 25;
        this.pedestrianWalkSpeed = 70; // px/detik saat menyeberang

        this.pedestrian = this.add.container(this.pedestrianStartX, zebraY).setDepth(20);

        const bodyG = this.add.graphics();
        bodyG.fillStyle(0x000000, 0.3);
        bodyG.fillCircle(2, 4, 12);
        bodyG.fillStyle(0x3498db, 1);
        bodyG.fillRoundedRect(-14, -8, 28, 16, 5);
        bodyG.fillStyle(0xf1c40f, 1);
        bodyG.fillCircle(0, 0, 9);
        bodyG.fillStyle(0x2c3e50, 1);
        bodyG.fillCircle(0, -2, 7);

        this.pedestrian.add(bodyG);
        this.physics.world.enable(this.pedestrian);
        this.pedestrian.body.setCircle(14, -14, -14);
        this.pedestrian.body.setImmovable(true);
    }

    createZebraSign(x, y) {
        const sign = this.add.graphics().setDepth(25);
        sign.fillStyle(0x7f8c8d, 1);
        sign.fillRect(x - 2, y - 5, 4, 40);
        sign.fillStyle(0x2980b9, 1);
        sign.fillRoundedRect(x - 18, y - 40, 36, 36, 6);
        sign.lineStyle(2, 0xffffff, 1);
        sign.strokeRoundedRect(x - 18, y - 40, 36, 36, 6);
        sign.fillStyle(0xffffff, 1);
        sign.fillTriangle(x, y - 36, x - 13, y - 9, x + 13, y - 9);
        sign.fillStyle(0x2c3e50, 1);
        sign.fillCircle(x, y - 26, 3);
        sign.fillRect(x - 2, y - 22, 4, 8);
        return sign;
    }

    // ==========================================
    // KENDARAAN DI DEPAN (LEAD CAR)
    // ==========================================
    createLeadVehicle(x, y) {
        this.leadVehicle = this.physics.add.sprite(x, y, "car_red");
        this.leadVehicle.setDisplaySize(48, 88);
        this.leadVehicle.setTint(0x3498db); // Biru pembeda
        this.leadVehicle.setImmovable(true);
        this.leadVehicle.body.setSize(38, 76);
        this.leadVehicle.setDepth(10);

        this.leadBrakeLights = this.add.graphics().setDepth(11);
        this.leadBrakeLights.setVisible(false);
        this.leadVehicle.on("destroy", () => this.leadBrakeLights.destroy());
    }

    // ==========================================
    // KENDARAAN PLAYER
    // ==========================================
    createPlayer(x, y) {
        const vehicleChoice = this.registry.get("vehicle");
        const isMotor = vehicleChoice?.motor;
        const playerKey = isMotor ? "motor_helm" : "car_red";

        this.player = this.physics.add.sprite(x, y, playerKey);
        this.isMotor = isMotor;

        if (isMotor) {
            this.player.setDisplaySize(36, 75);
            this.player.body.setSize(28, 65);
        } else {
            this.player.setDisplaySize(48, 88);
            this.player.body.setSize(38, 76);
        }

        this.player.setCollideWorldBounds(true);
        this.player.body.setDamping(true);
        this.player.body.setDrag(0.85);
        this.player.setDepth(12);

        this.playerSpeed = 0;
        this.playerMaxSpeed = 190;
        this.playerAcceleration = 130;
        this.playerBrakeForce = 260;

        // Lampu Sein
        this.leftSeinActive = false;
        this.rightSeinActive = false;
        this.seinBlinkTimer = 0;
        this.seinLightVisible = false;

        this.playerSeinGraphics = this.add.graphics().setDepth(13);

        // Batas tepi jalan
        this.physics.add.collider(this.player, this.roadBounds);

        // Collision & Overlap
        this.physics.add.overlap(this.player, this.leadVehicle, () => {
            this.handleCrash("Menabrak bagian belakang kendaraan di depan!");
        });
        this.physics.add.overlap(this.player, this.pedestrian, () => {
            this.handleCrash("Menabrak pejalan kaki di zebra cross!");
        });
    }

    // ==========================================
    // AUDIO
    // ==========================================
    initAudioAndEffects() {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.audioCtx = new AudioContext();
        } catch (e) {
            this.audioCtx = null;
        }
    }

    playHornSound() {
        if (!this.audioCtx) {
            this.sound.play("sfxClick");
            return;
        }
        if (this.audioCtx.state === "suspended") {
            this.audioCtx.resume();
        }
        const now = this.audioCtx.currentTime;
        [440, 550].forEach((freq) => {
            const osc = this.audioCtx.createOscillator();
            const gain = this.audioCtx.createGain();
            osc.type = "triangle";
            osc.frequency.setValueAtTime(freq, now);
            gain.gain.setValueAtTime(0.12, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
            osc.connect(gain);
            gain.connect(this.audioCtx.destination);
            osc.start(now);
            osc.stop(now + 0.28);
        });
    }

    playSeinTick() {
        if (!this.audioCtx) return;
        if (this.audioCtx.state === "suspended") {
            this.audioCtx.resume();
        }
        const now = this.audioCtx.currentTime;
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(850, now);
        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.04);
    }

    // ==========================================
    // KONTROL (5 TOMBOL LAYAR + KEYBOARD)
    // ==========================================
    createControls() {
        this.inputState = {
            left: false,
            right: false,
            gas: false,
            brake: false
        };

        this.cursors = this.input.keyboard.createCursorKeys();
        this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.keyB = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.B);
        this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.keyQ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
        this.keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);

        this.keyB.on("down", () => this.playHornSound());
        this.keyQ.on("down", () => this.toggleSein("left"));
        this.keyE.on("down", () => this.toggleSein("right"));

        this.lastLeftClickTime = 0;
        this.lastRightClickTime = 0;

        this.createScreenButtons();
    }

    createScreenButtons() {
        const sw = this.scale.width;
        const sh = this.scale.height;

        const btnSize = 64;
        const margin = 28;

        const leftBtnX = margin + btnSize / 2;
        const rightBtnX = leftBtnX + btnSize + 18;
        const steerBtnY = sh - margin - btnSize / 2;

        this.createInteractiveButton(leftBtnX, steerBtnY, "btn_kiri", btnSize, () => {
            const now = Date.now();
            if (now - this.lastLeftClickTime < 350) {
                this.toggleSein("left");
            }
            this.lastLeftClickTime = now;
            this.inputState.left = true;
        }, () => {
            this.inputState.left = false;
        });

        this.createInteractiveButton(rightBtnX, steerBtnY, "btn_kanan", btnSize, () => {
            const now = Date.now();
            if (now - this.lastRightClickTime < 350) {
                this.toggleSein("right");
            }
            this.lastRightClickTime = now;
            this.inputState.right = true;
        }, () => {
            this.inputState.right = false;
        });

        this.add.text(leftBtnX + btnSize / 2 + 9, steerBtnY - btnSize / 2 - 14, "Double Tap = Sein", {
            fontSize: "12px",
            color: "#ffffff",
            backgroundColor: "#00000088",
            padding: { x: 5, y: 2 }
        }).setOrigin(0.5).setScrollFactor(0).setDepth(202);

        // Sisi Kanan: Rem, Gas, Bell
        const gasBtnX = sw - margin - btnSize / 2;
        const gasBtnY = sh - margin - btnSize / 2;
        const brakeBtnX = gasBtnX - btnSize - 18;
        const brakeBtnY = gasBtnY;
        const bellBtnX = gasBtnX;
        const bellBtnY = gasBtnY - btnSize - 18;

        this.createInteractiveButton(brakeBtnX, brakeBtnY, "btn_rem", btnSize, () => {
            this.inputState.brake = true;
        }, () => {
            this.inputState.brake = false;
        });

        this.createInteractiveButton(gasBtnX, gasBtnY, "btn_gas", btnSize, () => {
            this.inputState.gas = true;
        }, () => {
            this.inputState.gas = false;
        });

        this.createInteractiveButton(bellBtnX, bellBtnY, "btn_bell", btnSize * 0.9, () => {
            this.playHornSound();
        });
    }

    // Tombol statis tanpa zoom/scale
    createInteractiveButton(x, y, textureKey, size, onDown, onUp) {
        const bg = this.add.circle(x, y, size / 2, 0x111111, 0.6)
            .setStrokeStyle(3, 0xffffff, 0.9)
            .setScrollFactor(0)
            .setDepth(200)
            .setInteractive({ useHandCursor: true });

        const icon = this.add.image(x, y, textureKey)
            .setDisplaySize(size * 0.65, size * 0.65)
            .setScrollFactor(0)
            .setDepth(201);

        bg.on("pointerdown", () => {
            bg.setAlpha(0.85);
            if (onDown) onDown();
        });

        const release = () => {
            bg.setAlpha(0.6);
            if (onUp) onUp();
        };

        bg.on("pointerup", release);
        bg.on("pointerout", release);
    }

    toggleSein(side) {
        if (side === "left") {
            this.leftSeinActive = !this.leftSeinActive;
            if (this.leftSeinActive) this.rightSeinActive = false;
        } else if (side === "right") {
            this.rightSeinActive = !this.rightSeinActive;
            if (this.rightSeinActive) this.leftSeinActive = false;
        }
        this.playSeinTick();
    }

    // ==========================================
    // HUD & STATUS DASHBOARD
    // ==========================================
    createHUD() {
        // Panel Target Level 3 di kiri atas
        const panelBg = this.add.graphics().setScrollFactor(0).setDepth(200);
        panelBg.fillStyle(0x000000, 0.75);
        panelBg.fillRoundedRect(16, 16, 360, 125, 10);
        panelBg.lineStyle(2, 0xffb133, 0.85);
        panelBg.strokeRoundedRect(16, 16, 360, 125, 10);

        this.add.text(28, 24, "🎯 TARGET LEVEL 3", {
            fontSize: "15px",
            fontStyle: "bold",
            color: "#FFB133"
        }).setScrollFactor(0).setDepth(201);

        this.goal1Text = this.add.text(28, 48, "1. Jaga Jarak Aman: 0.0s / 10s", {
            fontSize: "13px",
            color: "#ffffff"
        }).setScrollFactor(0).setDepth(201);

        this.distanceBarBg = this.add.rectangle(28, 70, 334, 10, 0x444444)
            .setOrigin(0, 0.5)
            .setScrollFactor(0)
            .setDepth(201);

        this.distanceBarFill = this.add.rectangle(28, 70, 0, 10, 0x2ecc71)
            .setOrigin(0, 0.5)
            .setScrollFactor(0)
            .setDepth(202);

        this.goal2Text = this.add.text(28, 86, "2. Beri Jalan Pejalan Kaki: [Belum]", {
            fontSize: "13px",
            color: "#ffffff"
        }).setScrollFactor(0).setDepth(201);

        // Speedometer & Jarak Status di kanan atas
        const rpWidth = 240;
        const rpX = this.scale.width - rpWidth - 16;
        const rightPanelBg = this.add.graphics().setScrollFactor(0).setDepth(200);
        rightPanelBg.fillStyle(0x000000, 0.75);
        rightPanelBg.fillRoundedRect(rpX, 16, rpWidth, 105, 10);
        rightPanelBg.lineStyle(2, 0x3498db, 0.85);
        rightPanelBg.strokeRoundedRect(rpX, 16, rpWidth, 105, 10);

        this.speedText = this.add.text(rpX + rpWidth / 2, 38, "0 KM/H", {
            fontSize: "22px",
            fontStyle: "bold",
            color: "#ffffff"
        }).setOrigin(0.5).setScrollFactor(0).setDepth(201);

        this.distanceStatusText = this.add.text(rpX + rpWidth / 2, 68, "Status: JARAK AMAN! ✅", {
            fontSize: "13px",
            fontStyle: "bold",
            color: "#2ecc71"
        }).setOrigin(0.5).setScrollFactor(0).setDepth(201);

        this.seinHudLeft = this.add.text(rpX + 45, 96, "◀ SEIN", {
            fontSize: "12px",
            fontStyle: "bold",
            color: "#555555"
        }).setOrigin(0.5).setScrollFactor(0).setDepth(201);

        this.seinHudRight = this.add.text(rpX + rpWidth - 45, 96, "SEIN ▶", {
            fontSize: "12px",
            fontStyle: "bold",
            color: "#555555"
        }).setOrigin(0.5).setScrollFactor(0).setDepth(201);

        // Banner notifikasi Toast
        this.toastBg = this.add.rectangle(this.scale.width / 2, 175, 480, 42, 0x000000, 0.9)
            .setStrokeStyle(2, 0x2ecc71)
            .setScrollFactor(0)
            .setDepth(210)
            .setAlpha(0);

        this.toastText = this.add.text(this.scale.width / 2, 175, "", {
            fontSize: "14px",
            fontStyle: "bold",
            color: "#ffffff"
        }).setOrigin(0.5).setScrollFactor(0).setDepth(211).setAlpha(0);
    }

    showToast(message, isError = false) {
        this.toastText.setText(message);
        this.toastBg.setStrokeStyle(2, isError ? 0xe74c3c : 0x2ecc71);
        this.tweens.killTweensOf(this.toastBg);
        this.tweens.killTweensOf(this.toastText);
        this.toastBg.setAlpha(1);
        this.toastText.setAlpha(1);
        this.tweens.add({
            targets: [this.toastBg, this.toastText],
            alpha: 0,
            delay: 2400,
            duration: 400
        });
    }

    // ==========================================
    // POPUP INTRO
    // ==========================================
    showObjectiveIntro() {
        const sw = this.scale.width;
        const sh = this.scale.height;

        const overlay = this.add.rectangle(sw / 2, sh / 2, sw * 2, sh * 2, 0x000000, 0.7)
            .setScrollFactor(0)
            .setDepth(300)
            .setInteractive();

        const card = this.add.rectangle(sw / 2, sh / 2, 540, 290, 0x1e1e1e, 0.96)
            .setStrokeStyle(3, 0xffb133)
            .setScrollFactor(0)
            .setDepth(301);

        const title = this.add.text(sw / 2, sh / 2 - 95, "LEVEL 3: ETIKA BERKENDARA", {
            fontSize: "20px",
            fontStyle: "bold",
            color: "#FFB133"
        }).setOrigin(0.5).setScrollFactor(0).setDepth(302);

        const desc = this.add.text(sw / 2, sh / 2 - 20, 
            "Target Misi Level 3:\n\n" +
            "1. Jaga jarak aman dengan kendaraan di depan selama 10 detik.\n" +
            "2. Berhenti dan beri jalan pejalan kaki di Zebra Cross.\n\n" +
            "Gunakan tombol Gas & Rem untuk mempertahankan jarak aman.", {
            fontSize: "14px",
            color: "#ffffff",
            align: "center",
            lineSpacing: 4,
            wordWrap: { width: 480 }
        }).setOrigin(0.5).setScrollFactor(0).setDepth(302);

        const startBtn = this.add.rectangle(sw / 2, sh / 2 + 90, 170, 44, 0xffb133)
            .setScrollFactor(0)
            .setDepth(303)
            .setInteractive({ useHandCursor: true });

        const startText = this.add.text(sw / 2, sh / 2 + 90, "MULAI", {
            fontSize: "16px",
            fontStyle: "bold",
            color: "#000000"
        }).setOrigin(0.5).setScrollFactor(0).setDepth(304);

        const popupElements = [overlay, card, title, desc, startBtn, startText];

        const dismissIntro = () => {
            if (this.isGameStarted) return;
            this.sound.play("sfxClick");
            popupElements.forEach(el => el.destroy());
            this.isGameStarted = true;
            this.showToast("🚀 Game dimulai! Ikuti kendaraan di depan dengan jarak aman.");
        };

        startBtn.on("pointerdown", dismissIntro);
        card.setInteractive({ useHandCursor: true }).on("pointerdown", dismissIntro);
        overlay.on("pointerdown", dismissIntro);
        this.input.keyboard.once("keydown", dismissIntro);
    }

    // ==========================================
    // MAIN UPDATE LOOP
    // ==========================================
    update(time, delta) {
        if (!this.isGameStarted || this.gameEnded) return;

        const dt = delta / 1000;

        // 1. Pergerakan Player
        this.updatePlayerMovement(dt);

        // 2. Logika Kendaraan Depan & Pejalan Kaki
        this.updateLeadVehicleAndPedestrian(dt);

        // 3. Evaluasi Jarak Aman (Goal 1)
        this.updateGoalDistance(dt);

        // 4. Evaluasi Pejalan Kaki (Goal 2)
        this.updateGoalPedestrian();

        // 5. Lampu Sein
        this.updateSeinEffects(dt);

        // 6. Update HUD & Visual Guide
        this.updateHUD();
        this.updateDistanceGuide();

        // 7. Cek Selesai Level (Bila kedua target sudah tuntas)
        if (this.goalDistanceCompleted && this.goalPedestrianCompleted && !this.winTriggered) {
            this.winTriggered = true;
            this.time.delayedCall(1200, () => {
                this.handleLevelWin();
            });
        }
    }

    updatePlayerMovement(dt) {
        const isGas = this.inputState.gas || this.cursors.up.isDown || this.keyW.isDown;
        const isBrake = this.inputState.brake || this.cursors.down.isDown || this.keyS.isDown || this.keySpace.isDown;
        const isLeft = this.inputState.left || this.cursors.left.isDown || this.keyA.isDown;
        const isRight = this.inputState.right || this.cursors.right.isDown || this.keyD.isDown;

        if (isGas) {
            this.playerSpeed = Math.min(this.playerSpeed + this.playerAcceleration * dt, this.playerMaxSpeed);
        } else if (isBrake) {
            this.playerSpeed = Math.max(this.playerSpeed - this.playerBrakeForce * dt, 0);
        } else {
            // Laju santai / cruising saat gas dilepas
            if (this.playerSpeed > 90) {
                this.playerSpeed = Math.max(this.playerSpeed - 50 * dt, 90);
            }
        }

        this.player.body.setVelocityY(-this.playerSpeed);

        let steerSpeed = 0;
        if (isLeft) steerSpeed -= 115;
        if (isRight) steerSpeed += 115;

        this.player.body.setVelocityX(steerSpeed);

        if (steerSpeed < 0) {
            this.player.setAngle(-4);
        } else if (steerSpeed > 0) {
            this.player.setAngle(4);
        } else {
            this.player.setAngle(0);
        }

        // Cek tabrakan fisik langsung (prevent tunneling)
        const distancePx = this.player.y - this.leadVehicle.y;
        const dx = Math.abs(this.player.x - this.leadVehicle.x);
        if (distancePx < 68 && distancePx > -70 && dx < 42) {
            this.handleCrash("Menabrak bagian belakang kendaraan di depan!");
        }
    }

    updateLeadVehicleAndPedestrian(dt) {
        const distToZebraLead = this.leadVehicle.y - this.zebraCrossY;
        const distToZebraPlayer = this.player.y - this.zebraCrossY;

        // Jika Goal 1 sudah selesai, pastikan Zebra Cross muncul tepat di depan mobil
        if (this.goalDistanceCompleted && this.pedestrianState === "waiting" && distToZebraLead > 360) {
            const newZebraY = this.leadVehicle.y - 320;
            this.zebraCrossY = newZebraY;
            this.stopLineY = newZebraY + 80;
            if (this.pedestrian) this.pedestrian.y = newZebraY;
            if (this.zebraGraphics) {
                this.zebraGraphics.clear();
                const roadLeft = this.roadCenterX - this.roadWidth / 2;
                this.zebraGraphics.fillStyle(0xffffff, 1);
                this.zebraGraphics.fillRect(roadLeft + 12, this.stopLineY, this.roadWidth - 24, 10);
                const stripWidth = (this.roadWidth - 40) / 10;
                for (let i = 0; i < 10; i += 2) {
                    this.zebraGraphics.fillRect(roadLeft + 20 + i * stripWidth, newZebraY - 35, stripWidth, 70);
                }
            }
            if (this.stopText) this.stopText.y = this.stopLineY + 30;
            if (this.signLeft) this.signLeft.y = newZebraY;
            if (this.signRight) this.signRight.y = newZebraY;
        }

        // Trigger pejalan kaki mulai menyeberang saat kendaraan mendekati zebra cross (< 340px)
        const updatedDistLead = this.leadVehicle.y - this.zebraCrossY;
        const updatedDistPlayer = this.player.y - this.zebraCrossY;

        if (this.pedestrianState === "waiting") {
            if ((updatedDistLead > 0 && updatedDistLead < 340) || (updatedDistPlayer > 0 && updatedDistPlayer < 340)) {
                this.pedestrianState = "crossing";
                this.showToast("🚸 Pejalan kaki sedang menyeberang! Berhenti sebelum garis STOP.");
            }
        }

        // Logika Pejalan Kaki Berjalan Menyeberang Jalan
        if (this.pedestrianState === "crossing") {
            this.pedestrian.x += this.pedestrianWalkSpeed * dt;
            if (this.pedestrian.body) {
                this.pedestrian.body.x = this.pedestrian.x - 14;
                this.pedestrian.body.y = this.pedestrian.y - 14;
            }

            if (this.pedestrian.x >= this.pedestrianTargetX) {
                this.pedestrian.x = this.pedestrianTargetX;
                this.pedestrianState = "finished";
                this.showToast("✅ Pejalan kaki telah selesai menyeberang.");
            }
        }

        // Mobil depan melambat dan berhenti saat ada penyeberang
        if (this.pedestrianState === "waiting") {
            this.leadVehicleSpeed = Math.min(this.leadVehicleSpeed + 60 * dt, this.leadVehicleCruiseSpeed);
            this.leadBrakeLights.setVisible(false);
        } else if (this.pedestrianState === "crossing") {
            if (updatedDistLead > 40 && updatedDistLead < 340) {
                this.leadVehicleSpeed = Math.max(this.leadVehicleSpeed - 140 * dt, 0);
                this.leadBrakeLights.setVisible(true);
            } else if (updatedDistLead <= 40) {
                this.leadVehicleSpeed = 0;
                this.leadBrakeLights.setVisible(true);
            }
        } else if (this.pedestrianState === "finished") {
            // Setelah pejalan kaki selesai, mobil depan jalan lagi
            this.leadVehicleSpeed = Math.min(this.leadVehicleSpeed + 70 * dt, this.leadVehicleCruiseSpeed);
            this.leadBrakeLights.setVisible(false);
        }

        this.leadVehicle.body.setVelocityY(-this.leadVehicleSpeed);

        if (this.leadBrakeLights.visible) {
            this.leadBrakeLights.clear();
            this.leadBrakeLights.fillStyle(0xff0000, 0.9);
            this.leadBrakeLights.fillCircle(this.leadVehicle.x - 16, this.leadVehicle.y + 38, 5);
            this.leadBrakeLights.fillCircle(this.leadVehicle.x + 16, this.leadVehicle.y + 38, 5);
        }
    }

    // ==========================================
    // LOGIKA EVALUASI GOAL 1: JARAK AMAN
    // ==========================================
    updateGoalDistance(dt) {
        if (this.goalDistanceCompleted) return;

        const distancePx = this.player.y - this.leadVehicle.y;

        // Rentang jarak aman yang adil dan realistis: 75px s/d 380px
        const minSafeDistance = 75;
        const maxSafeDistance = 380;

        if (distancePx <= 0) {
            this.distanceStatusText.setText("Status: DI DEPAN PEMANDU! ⚠️");
            this.distanceStatusText.setColor("#f39c12");
        } else if (distancePx < minSafeDistance) {
            this.distanceStatusText.setText("Status: TERLALU DEKAT! ⚠️");
            this.distanceStatusText.setColor("#e74c3c");
        } else if (distancePx > maxSafeDistance) {
            this.distanceStatusText.setText("Status: TERLALU JAUH! ⚠️");
            this.distanceStatusText.setColor("#f39c12");
        } else {
            // Berada di dalam zona jarak aman
            this.distanceStatusText.setText("Status: JARAK AMAN! ✅");
            this.distanceStatusText.setColor("#2ecc71");

            // Progress timer bertambah secara konsisten
            this.currentDistanceDuration += dt;
            if (this.currentDistanceDuration >= this.targetDistanceDuration) {
                this.currentDistanceDuration = this.targetDistanceDuration;
                this.goalDistanceCompleted = true;
                this.goal1Text.setText("1. Jaga Jarak Aman: [SELESAI ✅]");
                this.goal1Text.setColor("#2ecc71");
                this.showToast("🎉 Target 1 Selesai: Berhasil Jaga Jarak Aman 10 Detik!");
            }
        }

        const progress = Math.min(this.currentDistanceDuration / this.targetDistanceDuration, 1);
        this.distanceBarFill.width = 334 * progress;
        if (!this.goalDistanceCompleted) {
            this.goal1Text.setText(
                `1. Jaga Jarak Aman: ${this.currentDistanceDuration.toFixed(1)}s / 10s`
            );
        }
    }

    // ==========================================
    // LOGIKA EVALUASI GOAL 2: MEMBERI JALAN
    // ==========================================
    updateGoalPedestrian() {
        if (this.goalPedestrianCompleted) return;

        const playerDistToStop = this.player.y - this.stopLineY;

        if (this.pedestrianState === "crossing") {
            // Player berhenti atau melambat sebelum garis henti (< 45 KM/H)
            if (playerDistToStop > 0 && playerDistToStop < 280) {
                if (this.playerSpeed < 45) {
                    this.playerYieldedProperly = true;
                }
            }

            // Menerobos zebra cross saat pejalan kaki masih menyeberang
            if (this.player.y < this.stopLineY && this.player.y > this.zebraCrossY - 50) {
                this.handleCrash("Pelanggaran! Menerobos saat pejalan kaki sedang menyeberang!");
            }
        }

        // Saat pejalan kaki selesai dan pemain telah memberi jalan dengan benar
        if (this.pedestrianState === "finished" && (this.playerYieldedProperly || playerDistToStop > 0)) {
            this.goalPedestrianCompleted = true;
            this.goal2Text.setText("2. Beri Jalan Pejalan Kaki: [SELESAI ✅]");
            this.goal2Text.setColor("#2ecc71");
            this.showToast("🎉 Target 2 Selesai: Berhasil memberi jalan kepada pejalan kaki!");
        }
    }

    // ==========================================
    // VISUAL BRACKET JARAK AMAN
    // ==========================================
    updateDistanceGuide() {
        this.distanceGuideGraphics.clear();

        const distancePx = this.player.y - this.leadVehicle.y;
        if (distancePx > 0 && distancePx < 450) {
            let color = 0x2ecc71;
            if (distancePx < 75) color = 0xe74c3c;
            else if (distancePx > 380) color = 0xf39c12;

            this.distanceGuideGraphics.lineStyle(2, color, 0.6);
            const cx = (this.player.x + this.leadVehicle.x) / 2;
            const topY = this.leadVehicle.y + 44;
            const botY = this.player.y - 44;

            this.distanceGuideGraphics.lineBetween(cx, topY, cx, botY);
            this.distanceGuideGraphics.lineBetween(cx - 15, topY, cx + 15, topY);
            this.distanceGuideGraphics.lineBetween(cx - 15, botY, cx + 15, botY);
        }
    }

    // ==========================================
    // SEIN & EFEK VISUAL
    // ==========================================
    updateSeinEffects(dt) {
        this.playerSeinGraphics.clear();

        if (!this.leftSeinActive && !this.rightSeinActive) {
            this.seinHudLeft.setColor("#555555");
            this.seinHudRight.setColor("#555555");
            return;
        }

        this.seinBlinkTimer += dt;
        if (this.seinBlinkTimer >= 0.32) {
            this.seinBlinkTimer = 0;
            this.seinLightVisible = !this.seinLightVisible;
            if (this.seinLightVisible) {
                this.playSeinTick();
            }
        }

        if (this.seinLightVisible) {
            const px = this.player.x;
            const py = this.player.y;
            const halfW = this.isMotor ? 16 : 22;
            const halfH = this.isMotor ? 32 : 40;

            this.playerSeinGraphics.fillStyle(0xffb133, 1);

            if (this.leftSeinActive) {
                this.playerSeinGraphics.fillCircle(px - halfW, py - halfH, 5);
                this.playerSeinGraphics.fillCircle(px - halfW, py + halfH, 5);
                this.seinHudLeft.setColor("#f1c40f");
            } else {
                this.seinHudLeft.setColor("#555555");
            }

            if (this.rightSeinActive) {
                this.playerSeinGraphics.fillCircle(px + halfW, py - halfH, 5);
                this.playerSeinGraphics.fillCircle(px + halfW, py + halfH, 5);
                this.seinHudRight.setColor("#f1c40f");
            } else {
                this.seinHudRight.setColor("#555555");
            }
        } else {
            this.seinHudLeft.setColor("#555555");
            this.seinHudRight.setColor("#555555");
        }
    }

    updateHUD() {
        const kmh = Math.round(this.playerSpeed * 0.25);
        this.speedText.setText(`${kmh} KM/H`);
    }

    // ==========================================
    // KEMENANGAN & KEGAGALAN
    // ==========================================
    handleCrash(reason) {
        if (this.gameEnded) return;
        this.gameEnded = true;

        this.player.body.setVelocity(0, 0);
        this.leadVehicle.body.setVelocity(0, 0);

        const sw = this.scale.width;
        const sh = this.scale.height;

        const overlay = this.add.rectangle(sw / 2, sh / 2, sw * 2, sh * 2, 0x000000, 0.75)
            .setScrollFactor(0)
            .setDepth(400)
            .setInteractive();

        const card = this.add.rectangle(sw / 2, sh / 2, 480, 260, 0x1e1e1e, 0.96)
            .setStrokeStyle(3, 0xe74c3c)
            .setScrollFactor(0)
            .setDepth(401);

        const title = this.add.text(sw / 2, sh / 2 - 80, "❌ GAGAL!", {
            fontSize: "24px",
            fontStyle: "bold",
            color: "#E74C3C"
        }).setOrigin(0.5).setScrollFactor(0).setDepth(402);

        const desc = this.add.text(sw / 2, sh / 2 - 15, reason + "\n\nSelalu jaga jarak aman dan dahulukan pejalan kaki.", {
            fontSize: "14px",
            color: "#ffffff",
            align: "center",
            wordWrap: { width: 420 }
        }).setOrigin(0.5).setScrollFactor(0).setDepth(402);

        const retryBtn = this.add.rectangle(sw / 2, sh / 2 + 75, 170, 44, 0xe74c3c)
            .setScrollFactor(0)
            .setDepth(403)
            .setInteractive({ useHandCursor: true });

        const retryText = this.add.text(sw / 2, sh / 2 + 75, "COBA LAGI", {
            fontSize: "16px",
            fontStyle: "bold",
            color: "#ffffff"
        }).setOrigin(0.5).setScrollFactor(0).setDepth(404);

        retryBtn.on("pointerdown", () => {
            this.sound.play("sfxClick");
            this.scene.restart();
        });
    }

    handleLevelWin() {
        if (this.gameEnded) return;
        this.gameEnded = true;

        this.player.body.setVelocity(0, 0);
        this.leadVehicle.body.setVelocity(0, 0);

        try {
            const data = StorageManager.index();
            if (data?.levels) {
                if (data.levels[3]) {
                    data.levels[3].completed = true;
                    if (data.levels[3].objectives?.maintainDistance) {
                        data.levels[3].objectives.maintainDistance.completed = true;
                        data.levels[3].objectives.maintainDistance.current = 10;
                    }
                    if (data.levels[3].objectives?.giveWayPedestrian) {
                        data.levels[3].objectives.giveWayPedestrian.completed = true;
                    }
                }
                if (data.levels[4]) {
                    data.levels[4].unlocked = true;
                }
                StorageManager.set("levels", data.levels);
            }
        } catch (e) {
            console.warn("Gagal simpan ke storage:", e);
        }

        const sw = this.scale.width;
        const sh = this.scale.height;

        const overlay = this.add.rectangle(sw / 2, sh / 2, sw * 2, sh * 2, 0x000000, 0.75)
            .setScrollFactor(0)
            .setDepth(400)
            .setInteractive();

        const card = this.add.rectangle(sw / 2, sh / 2, 520, 290, 0x1e1e1e, 0.96)
            .setStrokeStyle(3, 0x2ecc71)
            .setScrollFactor(0)
            .setDepth(401);

        const title = this.add.text(sw / 2, sh / 2 - 95, "🎉 LEVEL 3 SELESAI! 🎉", {
            fontSize: "24px",
            fontStyle: "bold",
            color: "#2ECC71"
        }).setOrigin(0.5).setScrollFactor(0).setDepth(402);

        const desc = this.add.text(sw / 2, sh / 2 - 25,
            "Luar biasa! Anda telah membuktikan kepatuhan berkendara:\n\n" +
            "✔ Berhasil menjaga jarak aman selama 10 detik\n" +
            "✔ Berhasil mendahulukan pejalan kaki di Zebra Cross", {
            fontSize: "14px",
            color: "#ffffff",
            align: "center",
            wordWrap: { width: 460 }
        }).setOrigin(0.5).setScrollFactor(0).setDepth(402);

        const menuBtn = this.add.rectangle(sw / 2 - 100, sh / 2 + 80, 160, 44, 0x34495e)
            .setScrollFactor(0)
            .setDepth(403)
            .setInteractive({ useHandCursor: true });

        const menuText = this.add.text(sw / 2 - 100, sh / 2 + 80, "MENU LEVEL", {
            fontSize: "14px",
            fontStyle: "bold",
            color: "#ffffff"
        }).setOrigin(0.5).setScrollFactor(0).setDepth(404);

        menuBtn.on("pointerdown", () => {
            this.sound.play("sfxClick");
            if (this.scene.get("LevelsScene")) {
                this.scene.start("LevelsScene");
            } else {
                this.scene.start("WelcomeScene");
            }
        });

        const replayBtn = this.add.rectangle(sw / 2 + 100, sh / 2 + 80, 160, 44, 0x2ecc71)
            .setScrollFactor(0)
            .setDepth(403)
            .setInteractive({ useHandCursor: true });

        const replayText = this.add.text(sw / 2 + 100, sh / 2 + 80, "MAIN LAGI", {
            fontSize: "14px",
            fontStyle: "bold",
            color: "#000000"
        }).setOrigin(0.5).setScrollFactor(0).setDepth(404);

        replayBtn.on("pointerdown", () => {
            this.sound.play("sfxClick");
            this.scene.restart();
        });
    }
}