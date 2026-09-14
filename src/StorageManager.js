// Key storage
const STORAGE_KEY = "belajar-berkendara:player-data"

function buildObjective(type, extra = {}) {
    switch (type) {
        case 'boolean':
            return { type, completed: false, ...extra };

        case 'compliance':
            // Untuk COMPLIANCE: kondisi yang harus TIDAK DILANGGAR sepanjang level
            // (misal: mematuhi traffic light, menghindari genangan air).
            // Default 'completed: true' (dianggap lolos selama tidak ada
            // pelanggaran), dan HANYA bisa digagalkan lewat failCompliance(),
            // tidak bisa "dinaikkan" jadi true secara manual.
            return { type, completed: true, violated: false, ...extra };

        case 'counter':
            return { type, current: 0, target: extra.target, completed: false, ...extra };

        case 'distance':
            return { type, current: 0, target: extra.target, completed: false, ...extra };

        case 'duration':
            return { type, current: 0, target: extra.target, completed: false, ...extra };

        case 'checklist':
            return { type, items: extra.items, completed: false };

        default:
            throw new Error(`Unknown objective type: ${type}`);
    }
}

// DATA AWAL
const DEFAULT_DATA = {
    isSoundOn: true,  //Boolean
    selectedVehicle: null,  // Car || Motorcyle
    levels: {
        1: {
            unlocked: false,
            completed: false,
            objectives: {
                // Tutorial helm: double click ke arah layar
                helmetTutorial: buildObjective('boolean'),
                // Batas kecepatan -> COMPLIANCE, gagal permanen di level ini
                // begitu 1x melebihi batas kecepatan yang ditentukan.
                obeySpeedLimit: buildObjective('compliance'),
                // Mengebell
                useBell: buildObjective('boolean')
            }
        },
        2: {
            unlocked: false,
            completed: false,
            objectives: {
                // Menyalip 2 kendaraan DENGAN sein
                overtakeWithSignal: buildObjective('counter', { target: 2 }),
                // Mematuhi traffic light -> COMPLIANCE, bukan achievement.
                // Default lolos, gagal begitu 1x melanggar (misal terobos lampu merah).
                obeyTrafficLight: buildObjective('compliance'),
                // Rambu-rambu di sepanjang jalan -> checklist beberapa jenis
                roadSigns: buildObjective('checklist', {
                    items: {
                        zebraCross: false,
                        speedLimit: false,
                        redLight: false,
                        noStopping: false,
                        mustStop: false
                    }
                })
            }
        },
        3: {
            unlocked: false,
            completed: false,
            objectives: {
                // Jaga jarak dengan kendaraan di depan selama 10 detik
                maintainDistance: buildObjective('duration', { target: 10 }),
                // Memberi jalan ke pejalan kaki
                giveWayPedestrian: buildObjective('boolean')
            }
        },
        4: {
            unlocked: false,
            completed: false,
            objectives: {
                // Memberi jalan untuk ambulans
                giveWayAmbulance: buildObjective('boolean'),
                // Memberi jalan untuk 3 pejalan kaki
                giveWayPedestrians: buildObjective('counter', { target: 3 }),
                // Berkendara hingga 500 meter
                driveDistance: buildObjective('distance', { target: 500 })
            }
        },
        5: {
            unlocked: false,
            completed: false,
            objectives: {
                // Berkendara hingga 1000 meter
                driveDistance: buildObjective('distance', { target: 1000 }),
                // Menghindari genangan air -> COMPLIANCE (jangan sampai kena sekalipun)
                avoidPuddles: buildObjective('compliance'),
                // Mematuhi SEMUA rambu yang sudah dipelajari -> COMPLIANCE juga
                obeyAllSigns: buildObjective('compliance')
            }
        }
    }
}

export default new class StorageManager {
    constructor() {
        // PRIVATE FIELD
        this._data = null
    }

    // Untuk menginisialisasi storage
    init() {
        const data = JSON.parse(localStorage.getItem(STORAGE_KEY))

        if (data) {
            this._data = data
        } else {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_DATA))
        }

        return this._data
    }

    show(key) {
        return this._data[key]
    }

    index() {
        return this._data
    }

    set(key, value) {
        this._data[key] = value
        this._save()
    }

    update(partialData) {
        this._data = { ...this._data, ...partialData }
        this._save
    }

    _save() {
        console.log(this._data)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this._data))
    }
}


