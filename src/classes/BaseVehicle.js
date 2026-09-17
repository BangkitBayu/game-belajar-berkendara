import Phaser from "phaser";

/**
 *  Class BaseVehicle sebagai dasar kendaraan
 *  Mengatur pergerakan dasar, klakson, dan disistem lampu sein
 */

export default class BaseVehicle extends Phaser.Physics.Arcade.Sprite {
    /**
     * @param {Phaser.Scene} scene - Scene Phaser yang sedang berjalan.
     * @param {number} x - Posisi X awal.
     * @param {number} y - Posisi Y awal.
     * @param {string} texture - Key aset gambar/sprite.
     * @param {Object} [sfxKeys] - Kumpulan berisi sfx keys.
     */

    constructor(scene, x, y, texture, sfxKeys = {}) {
        super(scene, x, y, texture);

        // Tambahkan objek ke scene dan sistem physics
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Atribut kendaraan
        this.speed = 200;
        this.turnSpeed = 150; // Kecepatan rotasi (derajat per detik)

        this.sfxKeys = {
            horn: sfxKeys.horn || null,
            gas: sfxKeys.gas || null,
            signal: sfxKeys.signal || null,
            ...sfxKeys
        };

        this.activeSounds = {};

        // Status lampu sein: 'OFF', 'LEFT', 'RIGHT'
        this.turnSignalState = 'OFF';
        this.signalTimer = null;

        // Pengaturan physics fisik top-down
        this.setCollideWorldBounds(true);
        this.setDamping(true);
        this.setDrag(0.95); // Efek gesekan agar berhenti halus

        // Kontrol kendaraan
        this.hudControls = {
            up: false,
            down: false,
            left: false,
            right: false,
        };
    }

    /**
   * Menjalankan SFX
   * @param {string} action - Nama aksi
   * @param {Object} [config] - Konfigurasi suara
   */
    playSound(action, config = {}) {
        const soundKey = this.sfxKeys[action];
        if (soundKey && this.scene && this.scene.sound) {
            if (config.loop) {
                if (!this.activeSounds[action] || !this.activeSounds[action].isPlaying) {
                    this.activeSounds[action] = this.scene.sound.add(soundKey, config);
                    this.activeSounds[action].play();
                }
                return;
            }
            this.scene.sound.play(soundKey, config);
        }
    }

    /**
     * Menghentikan SFX yang sedang berjalan berdasarkan key di Scene
     * @param {string} action - Nama aksi
     */
    stopSound(action) {
        if (this.activeSounds && this.activeSounds[action]) {
            this.activeSounds[action].stop();
            this.activeSounds[action].destroy();
            this.activeSounds[action] = null;
        }
        const soundKey = this.sfxKeys[action];
        if (soundKey && this.scene && this.scene.sound) {
            this.scene.sound.stopByKey(soundKey);
        }
    }

    /**
   * Membunyikan suara klakson kendaraan.
   */
    honk() {
        this.playSound('horn');
    }

    /**
       * Mengatur status lampu sein kendaraan.
       * @param {'OFF' | 'LEFT' | 'RIGHT'} state
       */
    setTurnSignal(state) {
        this.turnSignalState = state;

        // Hentikan timer berkedip sebelumnya jika ada
        if (this.signalTimer) {
            this.signalTimer.destroy();
            this.signalTimer = null;
            this.clearTint(); // Kembali ke warna awal
            this.stopSound('signal');
        }

        if (state === 'OFF') return;

        // Simulasi visual lampu sein dengan efek berkedip (Tint Warna)
        this.signalTimer = this.scene.time.addEvent({
            delay: 400, // Kedip setiap 400ms
            loop: true,
            callback: () => {
                if (this.isTinted) {
                    this.clearTint();
                } else {
                    // Warna kuning keemasan untuk indikator sein
                    this.playSound('signal', { loop: true, volume: 0.6 });
                    this.setTint(0xffcc00);
                }
            }
        });
    }

    /**
     * Mengontrol pergerakan kendaraan berdasarkan state kontrol.
     * @param {Phaser.Types.Input.Keyboard.CursorKeys} [cursors] - Optional keyboard cursors.
     */

    drive(cursors, hudControls = this.hudControls, speed = this.speed, turnSpeed = this.turnSpeed) {
        // 1. Baca input dari Keyboard jika ada
        const up = (cursors && cursors.up.isDown) || hudControls.up;
        const down = (cursors && cursors.down.isDown) || hudControls.down;
        const left = (cursors && cursors.left.isDown) || hudControls.left;
        const right = (cursors && cursors.right.isDown) || hudControls.right;

        // 2. Terapkan Rotasi
        if (left) {
            this.setAngularVelocity(-turnSpeed);
        } else if (right) {
            this.setAngularVelocity(turnSpeed);
        } else {
            this.setAngularVelocity(0);
        }

        // 3. Terapkan Pergerakan Maju/Mundur
        if (up) {
            this.scene.physics.velocityFromRotation(this.rotation, speed, this.body.velocity);
            this.playSound('gas', { loop: true, volume: 0.6 })
        } else if (down) {
            this.scene.physics.velocityFromRotation(this.rotation, speed / 2, this.body.velocity);
            this.stopSound('gas')
        } else {
            this.stopSound('gas')
        }
    }
}