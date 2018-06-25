cc.Class({
    extends: cc.Component,

    properties: {
        // 暂存 Game 对象的引用
        game: {
            default: null,
            serializable: false
        },
    },

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