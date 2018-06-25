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
        xSpeed: 4,
        // 暂存 Game 对象的引用
        game: {
            default: null,
            serializable: false
        },
    },

    setInputControl() {
        var self = this;
        // keyboard input
        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            // set a flag when key pressed
            onKeyPressed(keyCode, event) {
                switch (keyCode) {
                    case cc.KEY.a:
                    case cc.KEY.left:
                        self.accLeft = true;
                        self.accRight = false;
                        break;
                    case cc.KEY.d:
                    case cc.KEY.right:
                        self.accLeft = false;
                        self.accRight = true;
                        break;
                }
            },
            // unset a flag when key released
            onKeyReleased(keyCode, event) {
                switch (keyCode) {
                    case cc.KEY.a:
                    case cc.KEY.left:
                        self.accLeft = false;
                        break;
                    case cc.KEY.d:
                    case cc.KEY.right:
                        self.accRight = false;
                        break;
                }
            }
        }, self.node);

        // touch input
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            onTouchBegan(touch, event) {
                var touchLoc = touch.getLocation();
                if (touchLoc.x < cc.winSize.width / 2) {
                    self.accLeft = true;
                    self.accRight = false;
                } else if (touchLoc.x > cc.winSize.width / 2) {
                    self.accLeft = false;
                    self.accRight = true;
                }
                // don't capture the event
                return true;
            },
            onTouchEnded(touch, event) {
                self.accLeft = false;
                self.accRight = false;
            }
        }, self.node);
    },

    // 拖动飞机 控制移动
    initTouchMove() {
        this.accLeft = false;
        this.accRight = false;
        // this.setInputControl();
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.playerMove, this.node);
    },

    playerMove(event) {
        let delta = event.touch.getDelta();
        this.x += delta.x;
        this.y += delta.y;
    },

    onCollisionEnter: function(other, self) {
        // 玩家被敌人撞到后
        if (other.tag == 2 || other.tag == 3 || other.tag == 4) {
            let ani = this.getComponent(cc.Animation);
            // ani.on('stop', function() {
            //     console.log('stop')
            // }, this);
            let animState = ani.play('playerDestroy');
        }
        if (other.tag == 5) {
            this.game.gotSupply();
            other.node.destroy();
        }
        if (other.tag == 6) {
            this.game.gotBomb();
            other.node.destroy();
        }
        // TODO
    },

    playAgain() {
        let ani = this.getComponent(cc.Animation);
        ani.setCurrentTime(0, 'playerDestroy');
        // player复位
        // this.node.setPosition(0, -this.game.node.height / 4);
        let resetPos = cc.moveTo(0.8, 0, -this.game.node.height / 4);
        this.node.runAction(resetPos);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.playerMove, this.node);
    },

    gameOver() {
        this.game.gameOver();
        // var action = cc.moveTo(0.8, 0, -this.game.node.getBoundingBox().height / 4);+
        // this.node.runAction(action);
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this.playerMove, this.node);
    },

    init(game) {
        this.game = game;
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.initTouchMove();
    },

    start() {

    },

    update(dt) {
        let minPosX = -this.node.parent.width / 2;
        let maxPosX = this.node.parent.width / 2;
        let leftBoard = minPosX + this.node.width / 2;
        let rightBoard = maxPosX - this.node.width / 2;
        let topBoard = this.node.parent.height / 2 - this.node.height / 2;
        let bottomBoard = -this.node.parent.height / 2 + this.node.height / 2;
        if (this.node.x > rightBoard) {
            this.node.x = rightBoard;
        }
        if (this.node.x < leftBoard) {
            this.node.x = leftBoard;
        }
        if (this.node.y > topBoard) {
            this.node.y = topBoard;
        }
        if (this.node.y < bottomBoard) {
            this.node.y = bottomBoard;
        }
    },
});