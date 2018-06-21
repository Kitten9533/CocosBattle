// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        // 暂存 Game 对象的引用
        game: {
            default: null,
            serializable: false
        },
        helicopterDistance: 2,
        hp: 3,
        score: 10,
        hitCounts: 0,
        hasBeenDestroyed: false,
    },

    init(game) {
        this.game = game;
    },

    // 锚点在正中心，所以 -height/2的位置为 画面最底部
    shouldDestroy() {
        if (this.node.y <= -this.node.parent.getBoundingBox().height / 2) {
            this.game.destroyHelicopter(this.node);
        }
    },

    onCollisionEnter(other, self) {
        // other为子弹节点时, 都消失 子弹和敌人
        if (other.tag == 1) {
            other.node.destroy();
            if (this.hasBeenDestroyed) {
                return;
            }
            let count = this.hitCounts;
            if (this.hitCounts < this.hp) {
                this.hitCounts++;
                return;
            }
            let ani = this.getComponent(cc.Animation);
            this.hasBeenDestroyed = true;
            ani.play('helicopterDestroy');
        }
    },

    deleteHelicopter() {
        this.node.destroy();
        // 得分增加，分数变更
        this.game.score += this.score;
        this.game.gainScore();
    },

    // LIFE-CYCLE CALLBACKS:

    start() {

    },

    update(dt) {
        if (!this.game.gameState) {
            return;
        }
        this.node.y -= this.helicopterDistance;
        // 不可见时
        this.shouldDestroy();
    },
});