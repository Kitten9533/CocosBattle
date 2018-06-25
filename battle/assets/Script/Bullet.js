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
        // 子弹y轴上间距
        bulletDistance: 30,
        // 暂存 Game 对象的引用
        game: {
            default: null,
            serializable: false
        },
    },

    // 判读是否需要把子弹返回到对象池中
    shouldDestroy() {
        if (this.node.y >= this.node.parent.getBoundingBox().height / 2) {
            this.game.destroyBullet(this.node);
            // this.destroyBulletNode();
        }
    },

    destroyBulletNode() {
        let arr = this.game.bulletArray;
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].uuid == this.node.uuid) {
                arr.splice(i, 1);
                // this.node.destroy();
                break;
            }
        }
    },

    init(game) {
        this.game = game;
        this.bulletDistance = game.bulletDistance;
        this.doShot = true;
        this.game.bulletArray.push(this.node);
    },

    // playAgain() {
    //     console.log('bullet anain');
    // },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.doShot = false;
        this.sum = 0;
    },

    start() {

    },

    update(dt) {
        if (!this.doShot) {
            return;
        }
        if (!this.game.gameState) {
            return;
        }
        this.node.y += this.bulletDistance;
        // 子弹不可见时
        this.shouldDestroy();
    },
});