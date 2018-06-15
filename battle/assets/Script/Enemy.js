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
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
        enemyDistance: 3,
        // 暂存 Game 对象的引用
        game: {
            default: null,
            serializable: false
        },
        animationList: [cc.Prefab],
    },

    init(game) {
        this.game = game;
        this.doEnemy = true;
        this.game.enemyArray.push(this.node);
    },

    // 锚点在正中心，所以 -height/2的位置为 画面最底部
    shouldDestroy() {
        if (this.node.y <= -this.node.parent.getBoundingBox().height / 2) {
            this.game.destroyEnemy(this.node);
            // this.destroyBulletNode();
        }
    },

    destroyBulletNode() {
        let arr = this.game.enemyArray;
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].uuid == this.node.uuid) {
                arr.splice(i, 1);
                // this.node.destroy();
                break;
            }
        }
    },

    onCollisionEnter(other, self) {
        // other为子弹节点时, 都消失 子弹和敌人
        if (other.tag == 1) {
            let ani = this.getComponent(cc.Animation);
            ani.play('enemyDestroy');
            ani.deleteEnemy = function() {
                this.node.destroy();
            }
            // 得分增加，分数变更
            this.game.score++;
            this.game.gainScore();
        }
    },

    playAgain() {
        console.log('enemy anain');
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.doEnemy = false;
    },

    // start() {},

    update(dt) {
        if (!this.doEnemy) {
            return;
        }
        if (!this.game.gameState) {
            return;
        }
        this.node.y -= this.enemyDistance;
        // 敌人不可见时
        this.shouldDestroy();
    },
});