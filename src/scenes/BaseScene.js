import Phaser from 'phaser';

export default class BaseScene extends Phaser.Scene {
    create() {
        this._resizeHandler = () => this.scene.restart();
        this.scale.on('resize', this._resizeHandler);

        // wajib di-off pas scene mati, biar listener gak numpuk tiap restart
        this.events.once('shutdown', () => {
            this.scale.off('resize', this._resizeHandler);
        });

        
    }
}