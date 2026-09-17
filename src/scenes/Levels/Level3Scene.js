import Phaser from "phaser";
import BaseScene from "../BaseScene";
import StorageManager from "../../StorageManager";
import Car from "../../classes/Car";
import Motorcyle from "../../classes/Motorcyle";

export default class Level3Scene extends BaseScene {
    constructor() {
        super({ key: "Level3Scene" });
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

        // Audio
        this.load.audio("sfxClick", "/src/assets/sound/click.mp3");
        this.load.audio("hornSfx", "/src/assets/sound/horn-sfx.mp3");
        this.load.audio("carGasSfx", "/src/assets/sound/car-gas-sfx.mp3");
        this.load.audio("motorcycleGassfx", "/src/assets/sound/motorcycle-gas-sfx.mp3");
        this.load.audio("seinSfx", "/src/assets/sound/sein-sfx.mp3");
        this.load.audio("crashSfx", "/src/assets/sound/crash-sfx.mp3");
    }

    create() {
        super.create();

        // Inisialisasi storage
        try {
            if (!StorageManager.index()) StorageManager.init();
        } catch (e) {
            console.warn("StorageManager fallback:", e);
        }

        this.gameEnded = false;

        // Goals Level 3
        this.targetDistanceDuration = 10.0;
        this.currentDistanceDuration = 0.0;
        this.goalDistanceCompleted = false;

        this.goalPedestrianCompleted = false;
        this.pedestrianState = "waiting"; // waiting, crossing, finished
        this.playerYieldedProperly = false;

        // Dimensi dunia game
        this.worldWidth = Math.max(this.scale.width, 800);
        this.worldHeight = 4500;
        this.roadCenterX = this.worldWidth / 2;
        this.roadWidth = 360;

        this.physics.world.setBounds(0, 0, this.worldWidth, this.worldHeight);

        // Buat jalan, rambu & zebra cross
        this.createRoad();
        this.zebraCrossY = 1600;
        this.createZebraCross(this.zebraCrossY);

        // Kendaraan pemandu (lead car) & pemain
        this.leadVehicleSpeed = 105;
        this.leadVehicleCruiseSpeed = 110;
        this.createVehicles();

        // Panduan visual jarak aman
        this.distanceGuideGraphics = this.add.graphics().setDepth(15);

        // Kamera mengikuti kendaraan pemain (1:1 tanpa zoom)
        this.cameras.main.setZoom(1);
        this.cameras.main.setBounds(0, 0, this.worldWidth, this.worldHeight);
        this.cameras.main.startFollow(this.player, true, 0.1, 0.1, 0, 160);

        // Kontrol input (5 tombol layar + keyboard)
        this.createControls();

        // HUD & Speedometer
        this.createHUD();

        this.showToast("🚀 Level 3 Dimulai! Ikuti kendaraan di depan dengan jarak aman.");
    }

    // ==========================================
    // LINGKUNGAN & JALAN RAYA
    // ==========================================
    createRoad() {
        const bg = this.add.graphics();
        // Rumput samping jalan
        bg.fillStyle(0x3e7b37, 1);
        bg.fillRect(0, 0, this.worldWidth, this.worldHeight);

        const roadLeft = this.roadCenterX - this.roadWidth / 2;
        const roadRight = this.roadCenterX + this.roadWidth / 2;

        // Trotoar
        const swWidth = 26;
        const sidewalk = this.add.graphics();
        sidewalk.fillStyle(0xcccccc, 1);
        sidewalk.fillRect(roadLeft - swWidth, 0, swWidth, this.worldHeight);
        sidewalk.fillRect(roadRight, 0, swWidth, this.worldHeight);

        for (let y = 0; y < this.worldHeight; y += 40) {
            sidewalk.fillStyle(y % 80 === 0 ? 0xffffff : 0x222222, 1);
            sidewalk.fillRect(roadLeft - 6, y, 6, 40);
            sidewalk.fillRect(roadRight, y, 6, 40);
        }

        // Aspal jalan utama
        const road = this.add.graphics();
        road.fillStyle(0x2d3436, 1);
        road.fillRect(roadLeft, 0, this.roadWidth, this.worldHeight);

        // Garis batas tepi putih solid
        road.lineStyle(4, 0xffffff, 0.9);
        road.lineBetween(roadLeft + 10, 0, roadLeft + 10, this.worldHeight);
        road.lineBetween(roadRight - 10, 0, roadRight - 10, this.worldHeight);

        // Garis marka putus-putus tengah
        for (let y = 0; y < this.worldHeight; y += 70) {
            road.fillStyle(0xffffff, 0.85);
            road.fillRect(this.roadCenterX - 3, y, 6, 42);
        }

        // Tembok batas fisik tepi jalan
        this.roadBounds = this.physics.add.staticGroup();
        this.roadBounds.add(this.add.rectangle(roadLeft + 5, this.worldHeight / 2, 10, this.worldHeight, 0, 0));
        this.roadBounds.add(this.add.rectangle(roadRight - 5, this.worldHeight / 2, 10, this.worldHeight, 0, 0));
    }

    createZebraCross(zebraY) {
        const roadLeft = this.roadCenterX - this.roadWidth / 2;
        this.stopLineY = zebraY + 80;

        this.zebraGraphics = this.add.graphics();
        this.zebraGraphics.fillStyle(0xffffff, 1);
        this.zebraGraphics.fillRect(roadLeft + 12, this.stopLineY, this.roadWidth - 24, 10);

        this.stopText = this.add.text(this.roadCenterX, this.stopLineY + 30, "STOP", {
            fontSize: "24px",
            fontStyle: "bold",
            color: "#ffffff"
        }).setOrigin(0.5);

        const stripWidth = (this.roadWidth - 40) / 10;
        for (let i = 0; i < 10; i += 2) {
            this.zebraGraphics.fillRect(roadLeft + 20 + i * stripWidth, zebraY - 35, stripWidth, 70);
        }

        // Rambu Zebra Cross
        this.signLeft = this.createZebraSign(roadLeft - 35, zebraY);
        this.signRight = this.createZebraSign(this.roadCenterX + this.roadWidth / 2 + 35, zebraY);

        // Pejalan Kaki
        this.pedestrianStartX = roadLeft - 15;
        this.pedestrianTargetX = this.roadCenterX + this.roadWidth / 2 + 25;
        this.pedestrianWalkSpeed = 70;

        this.pedestrian = this.add.container(this.pedestrianStartX, zebraY).setDepth(20);
        const body = this.add.graphics();
        body.fillStyle(0x000000, 0.3).fillCircle(2, 4, 12);
        body.fillStyle(0x3498db, 1).fillRoundedRect(-14, -8, 28, 16, 5);
        body.fillStyle(0xf1c40f, 1).fillCircle(0, 0, 9);
        body.fillStyle(0x2c3e50, 1).fillCircle(0, -2, 7);

        this.pedestrian.add(body);
        this.physics.world.enable(this.pedestrian);
        this.pedestrian.body.setCircle(14, -14, -14).setImmovable(true);
    }

    createZebraSign(x, y) {
        const sign = this.add.graphics().setDepth(25);
        sign.fillStyle(0x7f8c8d, 1).fillRect(x - 2, y - 5, 4, 40);
        sign.fillStyle(0x2980b9, 1).fillRoundedRect(x - 18, y - 40, 36, 36, 6);
        sign.lineStyle(2, 0xffffff, 1).strokeRoundedRect(x - 18, y - 40, 36, 36, 6);
        sign.fillStyle(0xffffff, 1).fillTriangle(x, y - 36, x - 13, y - 9, x + 13, y - 9);
        sign.fillStyle(0x2c3e50, 1).fillCircle(x, y - 26, 3).fillRect(x - 2, y - 22, 4, 8);
        return sign;
    }

    // ==========================================
    // KENDARAAN PEMAIN & MOBIL PEMANDU
    // ==========================================
    createVehicles() {
        // Mobil Pemandu (Lead Car)
        this.leadVehicle = new Car(this, this.roadCenterX, 2980, "car_red");
        this.leadVehicle.setDisplaySize(48, 88).setTint(0x3498db).setImmovable(true).setDepth(10);
        this.leadVehicle.body.setSize(38, 76);

        this.leadBrakeLights = this.add.graphics().setDepth(11).setVisible(false);

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

        // Tabrakan
        this.physics.add.collider(this.player, this.roadBounds);
        this.physics.add.overlap(this.player, this.leadVehicle, () => {
            this.handleCrash("Menabrak bagian belakang kendaraan di depan!");
        });
        this.physics.add.overlap(this.player, this.pedestrian, () => {
            this.handleCrash("Menabrak pejalan kaki di zebra cross!");
        });
    }

    // ==========================================
    // KONTROL (5 TOMBOL LAYAR & KEYBOARD)
    // ==========================================
    createControls() {
        this.inputState = { left: false, right: false, gas: false, brake: false };

        this.cursors = this.input.keyboard.createCursorKeys();
        this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.keyB = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.B);
        this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.keyQ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
        this.keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);

        this.keyB.on("down", () => {
            this.sound.play("sfxClick");
            if (this.player && typeof this.player.honk === "function") this.player.honk();
        });
        this.keyQ.on("down", () => this.toggleSein("left"));
        this.keyE.on("down", () => this.toggleSein("right"));

        this.lastLeftClickTime = 0;
        this.lastRightClickTime = 0;

        // Buat 5 tombol layar
        const sw = this.scale.width;
        const sh = this.scale.height;
        const btnSize = 64;
        const margin = 28;

        const leftX = margin + btnSize / 2;
        const rightX = leftX + btnSize + 18;
        const steerY = sh - margin - btnSize / 2;

        this.createScreenBtn(leftX, steerY, "btn_kiri", btnSize, () => {
            const now = Date.now();
            if (now - this.lastLeftClickTime < 350) this.toggleSein("left");
            this.lastLeftClickTime = now;
            this.inputState.left = true;
        }, () => { this.inputState.left = false; });

        this.createScreenBtn(rightX, steerY, "btn_kanan", btnSize, () => {
            const now = Date.now();
            if (now - this.lastRightClickTime < 350) this.toggleSein("right");
            this.lastRightClickTime = now;
            this.inputState.right = true;
        }, () => { this.inputState.right = false; });

        this.add.text(leftX + btnSize / 2 + 9, steerY - btnSize / 2 - 14, "Double Tap = Sein", {
            fontSize: "12px",
            color: "#ffffff",
            backgroundColor: "#00000088",
            padding: { x: 5, y: 2 }
        }).setOrigin(0.5).setScrollFactor(0).setDepth(202);

        // Kanan: Rem, Gas, Bell
        const gasX = sw - margin - btnSize / 2;
        const gasY = sh - margin - btnSize / 2;
        const brakeX = gasX - btnSize - 18;
        const bellX = gasX;
        const bellY = gasY - btnSize - 18;

        this.createScreenBtn(brakeX, gasY, "btn_rem", btnSize, () => { this.inputState.brake = true; }, () => { this.inputState.brake = false; });
        this.createScreenBtn(gasX, gasY, "btn_gas", btnSize, () => { this.inputState.gas = true; }, () => { this.inputState.gas = false; });
        this.createScreenBtn(bellX, bellY, "btn_bell", btnSize * 0.9, () => {
            this.sound.play("sfxClick");
            if (this.player && typeof this.player.honk === "function") this.player.honk();
        });
    }

    createScreenBtn(x, y, textureKey, size, onDown, onUp) {
        const bg = this.add.circle(x, y, size / 2, 0x111111, 0.6)
            .setStrokeStyle(3, 0xffffff, 0.9)
            .setScrollFactor(0)
            .setDepth(200)
            .setInteractive({ useHandCursor: true });

        this.add.image(x, y, textureKey)
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
        this.sound.play("sfxClick");

        if (this.player && typeof this.player.setTurnSignal === "function") {
            if (this.leftSeinActive) {
                this.player.setTurnSignal("LEFT");
            } else if (this.rightSeinActive) {
                this.player.setTurnSignal("RIGHT");
            } else {
                this.player.setTurnSignal("OFF");
            }
        }
    }

    // ==========================================
    // HUD & DASHBOARD
    // ==========================================
    createHUD() {
        const panel = this.add.graphics().setScrollFactor(0).setDepth(200);
        panel.fillStyle(0x000000, 0.75).fillRoundedRect(16, 16, 360, 125, 10);
        panel.lineStyle(2, 0xffb133, 0.85).strokeRoundedRect(16, 16, 360, 125, 10);

        this.add.text(28, 24, "🎯 TARGET LEVEL 3", {
            fontSize: "15px",
            fontStyle: "bold",
            color: "#FFB133"
        }).setScrollFactor(0).setDepth(201);

        this.goal1Text = this.add.text(28, 48, "1. Jaga Jarak Aman: 0.0s / 10s", {
            fontSize: "13px",
            color: "#ffffff"
        }).setScrollFactor(0).setDepth(201);

        this.distanceBarBg = this.add.rectangle(28, 70, 334, 10, 0x444444).setOrigin(0, 0.5).setScrollFactor(0).setDepth(201);
        this.distanceBarFill = this.add.rectangle(28, 70, 0, 10, 0x2ecc71).setOrigin(0, 0.5).setScrollFactor(0).setDepth(202);

        this.goal2Text = this.add.text(28, 86, "2. Beri Jalan Pejalan Kaki: [Belum]", {
            fontSize: "13px",
            color: "#ffffff"
        }).setScrollFactor(0).setDepth(201);

        // Speedometer
        const rpWidth = 240;
        const rpX = this.scale.width - rpWidth - 16;
        const rpBg = this.add.graphics().setScrollFactor(0).setDepth(200);
        rpBg.fillStyle(0x000000, 0.75).fillRoundedRect(rpX, 16, rpWidth, 105, 10);
        rpBg.lineStyle(2, 0x3498db, 0.85).strokeRoundedRect(rpX, 16, rpWidth, 105, 10);

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

        // Toast
        this.toastBg = this.add.rectangle(this.scale.width / 2, 175, 480, 42, 0x000000, 0.9)
            .setStrokeStyle(2, 0x2ecc71).setScrollFactor(0).setDepth(210).setAlpha(0);

        this.toastText = this.add.text(this.scale.width / 2, 175, "", {
            fontSize: "14px",
            fontStyle: "bold",
            color: "#ffffff"
        }).setOrigin(0.5).setScrollFactor(0).setDepth(211).setAlpha(0);
    }

    showToast(message, isError = false) {
        this.toastText.setText(message);
        this.toastBg.setStrokeStyle(2, isError ? 0xe74c3c : 0x2ecc71);
        this.tweens.killTweensOf([this.toastBg, this.toastText]);
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
    // UPDATE LOOP
    // ==========================================
    update(time, delta) {
        if (this.gameEnded) return;
        const dt = delta / 1000;

        // 1. Gerakan Pemain
        const isGas = this.inputState.gas || this.cursors.up.isDown || this.keyW.isDown;
        const isBrake = this.inputState.brake || this.cursors.down.isDown || this.keyS.isDown || this.keySpace.isDown;
        const isLeft = this.inputState.left || this.cursors.left.isDown || this.keyA.isDown;
        const isRight = this.inputState.right || this.cursors.right.isDown || this.keyD.isDown;

        if (isGas) {
            this.playerSpeed = Math.min(this.playerSpeed + this.playerAcceleration * dt, this.playerMaxSpeed);
            if (this.player && typeof this.player.playSound === "function") {
                this.player.playSound("gas", { loop: true, volume: 0.45 });
            }
        } else if (isBrake) {
            this.playerSpeed = Math.max(this.playerSpeed - this.playerBrakeForce * dt, 0);
            if (this.player && typeof this.player.stopSound === "function") {
                this.player.stopSound("gas");
            }
        } else {
            if (this.player && typeof this.player.stopSound === "function") {
                this.player.stopSound("gas");
            }
            if (this.playerSpeed > 90) {
                this.playerSpeed = Math.max(this.playerSpeed - 50 * dt, 90);
            }
        }

        this.player.body.setVelocityY(-this.playerSpeed);

        let steerSpeed = 0;
        if (isLeft) steerSpeed -= 115;
        if (isRight) steerSpeed += 115;
        this.player.body.setVelocityX(steerSpeed);
        this.player.setAngle(steerSpeed < 0 ? -4 : (steerSpeed > 0 ? 4 : 0));

        // Cek tabrakan jarak dekat langsung
        const distancePx = this.player.y - this.leadVehicle.y;
        if (distancePx < 68 && distancePx > -70 && Math.abs(this.player.x - this.leadVehicle.x) < 42) {
            this.handleCrash("Menabrak bagian belakang kendaraan di depan!");
        }

        // 2. Mobil Pemandu & Pejalan Kaki
        this.updateLeadAndPedestrian(dt);

        // 3. Evaluasi Jarak Aman (Goal 1)
        this.updateGoalDistance(dt, distancePx);

        // 4. Evaluasi Pejalan Kaki (Goal 2)
        this.updateGoalPedestrian();

        // 5. Lampu Sein & HUD
        this.updateSeinAndHUD(dt);

        // 6. Cek Selesai Level
        if (this.goalDistanceCompleted && this.goalPedestrianCompleted && !this.winTriggered) {
            this.winTriggered = true;
            this.time.delayedCall(1200, () => this.handleLevelWin());
        }
    }

    updateLeadAndPedestrian(dt) {
        const distLead = this.leadVehicle.y - this.zebraCrossY;
        const distPlayer = this.player.y - this.zebraCrossY;

        // Pindahkan zebra cross ke depan mobil pemandu bila Goal 1 sudah selesai
        if (this.goalDistanceCompleted && this.pedestrianState === "waiting" && distLead > 360) {
            const newY = this.leadVehicle.y - 320;
            this.zebraCrossY = newY;
            this.stopLineY = newY + 80;
            if (this.pedestrian) this.pedestrian.y = newY;
            if (this.zebraGraphics) {
                this.zebraGraphics.clear();
                const roadLeft = this.roadCenterX - this.roadWidth / 2;
                this.zebraGraphics.fillStyle(0xffffff, 1).fillRect(roadLeft + 12, this.stopLineY, this.roadWidth - 24, 10);
                const stripWidth = (this.roadWidth - 40) / 10;
                for (let i = 0; i < 10; i += 2) {
                    this.zebraGraphics.fillRect(roadLeft + 20 + i * stripWidth, newY - 35, stripWidth, 70);
                }
            }
            if (this.stopText) this.stopText.y = this.stopLineY + 30;
            if (this.signLeft) this.signLeft.y = newY;
            if (this.signRight) this.signRight.y = newY;
        }

        const currentDistLead = this.leadVehicle.y - this.zebraCrossY;
        const currentDistPlayer = this.player.y - this.zebraCrossY;

        // Trigger pejalan kaki mulai menyeberang
        if (this.pedestrianState === "waiting" && ((currentDistLead > 0 && currentDistLead < 340) || (currentDistPlayer > 0 && currentDistPlayer < 340))) {
            this.pedestrianState = "crossing";
            this.showToast("🚸 Pejalan kaki sedang menyeberang! Berhenti sebelum garis STOP.");
        }

        // Pejalan kaki menyeberang
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

        // Kecepatan mobil pemandu
        if (this.pedestrianState === "waiting") {
            this.leadVehicleSpeed = Math.min(this.leadVehicleSpeed + 60 * dt, this.leadVehicleCruiseSpeed);
            this.leadBrakeLights.setVisible(false);
        } else if (this.pedestrianState === "crossing") {
            if (currentDistLead > 40 && currentDistLead < 340) {
                this.leadVehicleSpeed = Math.max(this.leadVehicleSpeed - 140 * dt, 0);
                this.leadBrakeLights.setVisible(true);
            } else if (currentDistLead <= 40) {
                this.leadVehicleSpeed = 0;
                this.leadBrakeLights.setVisible(true);
            }
        } else if (this.pedestrianState === "finished") {
            this.leadVehicleSpeed = Math.min(this.leadVehicleSpeed + 70 * dt, this.leadVehicleCruiseSpeed);
            this.leadBrakeLights.setVisible(false);
        }

        this.leadVehicle.body.setVelocityY(-this.leadVehicleSpeed);

        if (this.leadBrakeLights.visible) {
            this.leadBrakeLights.clear().fillStyle(0xff0000, 0.9);
            this.leadBrakeLights.fillCircle(this.leadVehicle.x - 16, this.leadVehicle.y + 38, 5);
            this.leadBrakeLights.fillCircle(this.leadVehicle.x + 16, this.leadVehicle.y + 38, 5);
        }
    }

    updateGoalDistance(dt, distancePx) {
        if (this.goalDistanceCompleted) return;

        if (distancePx <= 0) {
            this.distanceStatusText.setText("Status: DI DEPAN PEMANDU! ⚠️").setColor("#f39c12");
        } else if (distancePx < 75) {
            this.distanceStatusText.setText("Status: TERLALU DEKAT! ⚠️").setColor("#e74c3c");
        } else if (distancePx > 380) {
            this.distanceStatusText.setText("Status: TERLALU JAUH! ⚠️").setColor("#f39c12");
        } else {
            this.distanceStatusText.setText("Status: JARAK AMAN! ✅").setColor("#2ecc71");
            this.currentDistanceDuration += dt;
            if (this.currentDistanceDuration >= this.targetDistanceDuration) {
                this.currentDistanceDuration = this.targetDistanceDuration;
                this.goalDistanceCompleted = true;
                this.goal1Text.setText("1. Jaga Jarak Aman: [SELESAI ✅]").setColor("#2ecc71");
                this.showToast("🎉 Target 1 Selesai: Berhasil Jaga Jarak Aman 10 Detik!");
            }
        }

        this.distanceBarFill.width = 334 * Math.min(this.currentDistanceDuration / this.targetDistanceDuration, 1);
        if (!this.goalDistanceCompleted) {
            this.goal1Text.setText(`1. Jaga Jarak Aman: ${this.currentDistanceDuration.toFixed(1)}s / 10s`);
        }

        // Bracket panduan visual
        this.distanceGuideGraphics.clear();
        if (distancePx > 0 && distancePx < 450) {
            const color = distancePx < 75 ? 0xe74c3c : (distancePx > 380 ? 0xf39c12 : 0x2ecc71);
            this.distanceGuideGraphics.lineStyle(2, color, 0.6);
            const cx = (this.player.x + this.leadVehicle.x) / 2;
            const topY = this.leadVehicle.y + 44;
            const botY = this.player.y - 44;
            this.distanceGuideGraphics.lineBetween(cx, topY, cx, botY);
            this.distanceGuideGraphics.lineBetween(cx - 15, topY, cx + 15, topY);
            this.distanceGuideGraphics.lineBetween(cx - 15, botY, cx + 15, botY);
        }
    }

    updateGoalPedestrian() {
        if (this.goalPedestrianCompleted) return;

        const playerDist = this.player.y - this.stopLineY;

        if (this.pedestrianState === "crossing") {
            if (playerDist > 0 && playerDist < 280 && this.playerSpeed < 45) {
                this.playerYieldedProperly = true;
            }
            if (this.player.y < this.stopLineY && this.player.y > this.zebraCrossY - 50) {
                this.handleCrash("Pelanggaran! Menerobos saat pejalan kaki sedang menyeberang!");
            }
        }

        if (this.pedestrianState === "finished" && (this.playerYieldedProperly || playerDist > 0)) {
            this.goalPedestrianCompleted = true;
            this.goal2Text.setText("2. Beri Jalan Pejalan Kaki: [SELESAI ✅]").setColor("#2ecc71");
            this.showToast("🎉 Target 2 Selesai: Berhasil memberi jalan kepada pejalan kaki!");
        }
    }

    updateSeinAndHUD(dt) {
        this.speedText.setText(`${Math.round(this.playerSpeed * 0.25)} KM/H`);
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
            if (this.seinLightVisible) this.sound.play("sfxClick");
        }

        if (this.seinLightVisible) {
            const px = this.player.x;
            const py = this.player.y;
            const hw = this.isMotor ? 16 : 22;
            const hh = this.isMotor ? 32 : 40;
            this.playerSeinGraphics.fillStyle(0xffb133, 1);

            if (this.leftSeinActive) {
                this.playerSeinGraphics.fillCircle(px - hw, py - hh, 5).fillCircle(px - hw, py + hh, 5);
                this.seinHudLeft.setColor("#f1c40f");
            }
            if (this.rightSeinActive) {
                this.playerSeinGraphics.fillCircle(px + hw, py - hh, 5).fillCircle(px + hw, py + hh, 5);
                this.seinHudRight.setColor("#f1c40f");
            }
        } else {
            this.seinHudLeft.setColor("#555555");
            this.seinHudRight.setColor("#555555");
        }
    }

    // ==========================================
    // MODAL SELESAI & GAGAL
    // ==========================================
    handleCrash(reason) {
        if (this.gameEnded) return;
        this.gameEnded = true;

        if (this.player) {
            if (typeof this.player.stopSound === "function") this.player.stopSound("gas");
            if (typeof this.player.setTurnSignal === "function") this.player.setTurnSignal("OFF");
        }
        if (this.cache.audio.exists("crashSfx")) {
            this.sound.play("crashSfx");
        }

        this.player.body.setVelocity(0, 0);
        this.leadVehicle.body.setVelocity(0, 0);

        const sw = this.scale.width;
        const sh = this.scale.height;

        this.add.rectangle(sw / 2, sh / 2, sw * 2, sh * 2, 0, 0.75).setScrollFactor(0).setDepth(400).setInteractive();
        this.add.rectangle(sw / 2, sh / 2, 480, 260, 0x1e1e1e, 0.96).setStrokeStyle(3, 0xe74c3c).setScrollFactor(0).setDepth(401);

        this.add.text(sw / 2, sh / 2 - 80, "❌ GAGAL!", {
            fontSize: "24px", fontStyle: "bold", color: "#E74C3C"
        }).setOrigin(0.5).setScrollFactor(0).setDepth(402);

        this.add.text(sw / 2, sh / 2 - 15, reason + "\n\nSelalu jaga jarak aman dan dahulukan pejalan kaki.", {
            fontSize: "14px", color: "#ffffff", align: "center", wordWrap: { width: 420 }
        }).setOrigin(0.5).setScrollFactor(0).setDepth(402);

        const retryBtn = this.add.rectangle(sw / 2, sh / 2 + 75, 170, 44, 0xe74c3c)
            .setScrollFactor(0).setDepth(403).setInteractive({ useHandCursor: true });

        this.add.text(sw / 2, sh / 2 + 75, "COBA LAGI", {
            fontSize: "16px", fontStyle: "bold", color: "#ffffff"
        }).setOrigin(0.5).setScrollFactor(0).setDepth(404);

        retryBtn.on("pointerdown", () => {
            this.sound.play("sfxClick");
            this.scene.restart();
        });
    }

    handleLevelWin() {
        if (this.gameEnded) return;
        this.gameEnded = true;

        if (this.player) {
            if (typeof this.player.stopSound === "function") this.player.stopSound("gas");
            if (typeof this.player.setTurnSignal === "function") this.player.setTurnSignal("OFF");
        }

        this.player.body.setVelocity(0, 0);
        this.leadVehicle.body.setVelocity(0, 0);

        // Simpan ke storage
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
                if (data.levels[4]) data.levels[4].unlocked = true;
                StorageManager.set("levels", data.levels);
            }
        } catch (e) {
            console.warn("Simpan storage gagal:", e);
        }

        const sw = this.scale.width;
        const sh = this.scale.height;

        this.add.rectangle(sw / 2, sh / 2, sw * 2, sh * 2, 0, 0.75).setScrollFactor(0).setDepth(400).setInteractive();
        this.add.rectangle(sw / 2, sh / 2, 520, 290, 0x1e1e1e, 0.96).setStrokeStyle(3, 0x2ecc71).setScrollFactor(0).setDepth(401);

        this.add.text(sw / 2, sh / 2 - 95, "🎉 LEVEL 3 SELESAI! 🎉", {
            fontSize: "24px", fontStyle: "bold", color: "#2ECC71"
        }).setOrigin(0.5).setScrollFactor(0).setDepth(402);

        this.add.text(sw / 2, sh / 2 - 25,
            "Luar biasa! Anda telah membuktikan kepatuhan berkendara:\n\n" +
            "✔ Berhasil menjaga jarak aman selama 10 detik\n" +
            "✔ Berhasil mendahulukan pejalan kaki di Zebra Cross", {
            fontSize: "14px", color: "#ffffff", align: "center", wordWrap: { width: 460 }
        }).setOrigin(0.5).setScrollFactor(0).setDepth(402);

        // Tombol Menu Level
        const menuBtn = this.add.rectangle(sw / 2 - 100, sh / 2 + 80, 160, 44, 0x34495e)
            .setScrollFactor(0).setDepth(403).setInteractive({ useHandCursor: true });

        this.add.text(sw / 2 - 100, sh / 2 + 80, "MENU LEVEL", {
            fontSize: "14px", fontStyle: "bold", color: "#ffffff"
        }).setOrigin(0.5).setScrollFactor(0).setDepth(404);

        menuBtn.on("pointerdown", () => {
            this.sound.play("sfxClick");
            this.scene.start(this.scene.get("LevelsScene") ? "LevelsScene" : "WelcomeScene");
        });

        // Tombol Main Lagi
        const replayBtn = this.add.rectangle(sw / 2 + 100, sh / 2 + 80, 160, 44, 0x2ecc71)
            .setScrollFactor(0).setDepth(403).setInteractive({ useHandCursor: true });

        this.add.text(sw / 2 + 100, sh / 2 + 80, "MAIN LAGI", {
            fontSize: "14px", fontStyle: "bold", color: "#000000"
        }).setOrigin(0.5).setScrollFactor(0).setDepth(404);

        replayBtn.on("pointerdown", () => {
            this.sound.play("sfxClick");
            this.scene.restart();
        });
    }
}
