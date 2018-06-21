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
    },

    // onCollisionEnter(other, self) {
    //     // 玩家获得补给时,第一次 子弹变化成2个弹道，子弹加速，
    //     // 第二次及以后都是子弹加速
    //     if (other.tag == 2) {
    //         // 获得补给后相应操作
    //         console.log(other.tag);
    //     }
    //     this.node.destroy();
    // },

    init(game) {
        this.game = game;
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

    },

    update(dt) {
        if (!this.game.gameState) {
            return;
        }
        this.node.y -= 10;
    },
});