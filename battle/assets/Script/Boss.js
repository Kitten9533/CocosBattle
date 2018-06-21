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
        bossDistance: 3,
        // 暂存 Game 对象的引用
        game: {
            default: null,
            serializable: false
        },
        bossMove: false,
        hp: 20,
        score: 80,
        hitCounts: 0,
        hasBeenDestroyed: false,
    },

    init(game) {
        this.game = game;
        // boss到达中心位置后开始移动 和发射子弹
        var toCenter = cc.moveTo(3, 0, this.game.node.getBoundingBox().height / 4);
        var startMoving = cc.callFunc(function(target, opt) {
            // boss发射子弹
            // boss开始移动
            this.schedule(function() {
                this.doMove(3);
            }, 3);
        }, this, null);
        var myAction = cc.sequence(toCenter, startMoving);
        this.node.runAction(myAction);
        let ani = this.getComponent(cc.Animation);
        ani.play('BossDestroy');
    },

    onCollisionEnter(other, self) {
        // other为子弹节点时, 都消失 子弹和敌人
        if (other.tag == 1) {
            other.node.destroy();
            if (this.hasBeenDestroyed) {
                return;
            }
            if (this.hitCounts < this.hp) {
                this.hitCounts++;
                return;
            }
            let ani = this.getComponent(cc.Animation);
            this.hasBeenDestroyed = true;
            ani.play('bossDestroy');
        }
    },

    deleteBoss() {
        // 取消定时器
        this.unschedule(this.doMove);
        this.node.destroy();
        this.game.score += this.score;
        this.game.gainScore();
        this.game.hasBoss = false;
    },

    doMove(during) {
        if (!this.game.gameState) {
            return;
        }
        let {
            width,
            height
        } = this.node.getBoundingBox();
        let w = this.game.node.getBoundingBox().width - width;
        let h = this.game.node.getBoundingBox().height / 2 - height / 2;
        let randomX = -w / 2 + Math.random() * w;
        let randomY = Math.random() * h;
        var ani = cc.moveTo(during, randomX, randomY);
        this.node.runAction(ani);
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

    },

    update(dt) {
        if (!this.game.gameState) {
            return;
        }
        // boss到达中心位置后开始移动 和发射子弹
        // if (!bossMove && this.node.y > this.game.node.getBoundingBox().height / 4) {
        //     this.node.y--;
        // }
        //开始移动
    },
});