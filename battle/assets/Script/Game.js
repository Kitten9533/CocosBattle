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
        far_bg: [cc.Node],
        far_speed: null,
        bulletPrefab: {
            default: null,
            type: cc.Prefab,
        },
        enemyPrefab: {
            default: null,
            type: cc.Prefab,
        },
        playerNode: {
            default: null,
            type: cc.Node,
        },
        //发射子弹的间隔 多少次update后
        bulletSpacing: null,
        //敌人生成的间隔
        enemySpacing: null,
    },

    bgMove(bgList, speed) {
        for (let index = 0; index < bgList.length; index++) {
            let element = bgList[index];
            element.y -= speed;
        }
    },

    checkBgReset(bgList) {
        let firstBg = bgList[0].getBoundingBox();
        let first_yMax = firstBg.yMax;
        let firstHeight = firstBg.height;
        if (first_yMax <= -firstHeight / 2) {
            let preFirst = bgList.shift();
            bgList.push(preFirst);
            let curFirstBg = bgList[0];
            preFirst.y = bgList[1].getBoundingBox().yMax + bgList[1].getBoundingBox().height / 2;
        }
    },

    initBulletPool() {
        this.bulletPool = new cc.NodePool();
        let bulletCount = 10;
        for (let i = 0; i < bulletCount; i++) {
            let bullet = cc.instantiate(this.bulletPrefab); // 创建节点
            this.bulletPool.put(bullet); // 通过 putInPool 接口放入对象池
        }
    },

    createBullet() {
        let bullet = null;
        if (this.bulletPool.size() > 0) { // 通过 size 接口判断对象池中是否有空闲的对象
            bullet = this.bulletPool.get();
        } else { // 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
            bullet = cc.instantiate(this.bulletPrefab);
        }
        this.node.addChild(bullet);
        // 设置子弹的初始位置
        bullet.setPosition(this.getBulletPos());
        bullet.getComponent('Bullet').init(this);
    },

    // 子弹击中，或者超出边界后
    destoryBullet(bullet) {
        this.bulletPool.put(bullet);
    },

    initEnemyPool() {
        this.enemyPool = new cc.NodePool();
        let enemyCount = 5;
        for (let i = 0; i < enemyCount; i++) {
            let enemy = cc.instantiate(this.enemyPrefab);
            this.enemyPool.put(enemy);
        }
    },

    createEnemy() {
        let enemy = null;
        if (this.enemyPool.size() > 0) { // 通过 size 接口判断对象池中是否有空闲的对象
            enemy = this.enemyPool.get();
        } else { // 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
            enemy = cc.instantiate(this.enemyPrefab);
        }
        this.node.addChild(enemy);
        // 设置敌人的初始位置
        let enemyWidth = enemy.width;
        enemy.setPosition(this.getEnemyPos(enemyWidth));
        enemy.getComponent('Enemy').init(this);
    },

    //获取子弹的初始位置，位于飞机的中间 头部位置
    getBulletPos() {
        let {
            x,
            y,
        } = this.playerNode.getBoundingBox().center;
        let {
            height
        } = this.playerNode.getBoundingBox().height;
        return cc.p(x, y + 100);
    },

    getEnemyPos(enemyWidth) {
        // 随机生成敌人位置
        let {
            height
        } = this.node.getBoundingBox();
        //去掉敌人的宽度，使敌人不会只显示一半
        let w = this.width - enemyWidth;
        let randomX = -w / 2 + Math.random() * w;
        return cc.p(randomX, height / 2);
    },

    onGameStart() {
        this.gameState = true;
        this.bulletCount = 0;
        this.enemyCount = 0;
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        let {
            width,
            height
        } = this.node.getBoundingBox();
        this.width = width;
        this.height = height;
        this.gameState = false;
        this.initBulletPool();
        this.initEnemyPool();
        this.onGameStart();
    },

    start() {

    },

    update(dt) {
        if (!this.gameState) {
            return;
        }
        this.bgMove(this.far_bg, this.far_speed);
        this.checkBgReset(this.far_bg);
        this.bulletCount++;
        if (this.bulletCount >= this.bulletSpacing) {
            this.createBullet();
            this.bulletCount = 0;
        }
        this.enemyCount++;
        if (this.enemyCount >= this.enemySpacing) {
            this.createEnemy();
            this.enemyCount = 0;
        }
    },
});