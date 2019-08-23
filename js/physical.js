var Example = Example || {};
var demo;

Example.demo = function (windowWidth, windowHeight, topOffset) {
    var centerX = windowWidth / 2;
    var height = windowHeight * 0.7;
    // module aliases
    var Engine = Matter.Engine,
        Render = Matter.Render,
        World = Matter.World,
        Bodies = Matter.Bodies,
        Mouse = Matter.Mouse,
        MouseConstraint = Matter.MouseConstraint,
        World = Matter.World,
        Composites = Matter.Composites,
        Render = Matter.Render,
        Runner = Matter.Runner,
        Constraint = Matter.Constraint,
        World = Matter.World,
        Events = Matter.Events,
        Vector = Matter.Vector;


    // create an engine
    var engine = Engine.create(),
        world = engine.world;

    // create a renderer
    var render = Render.create({
        engine: engine,
        element: document.getElementById("sim"),
        options: {
            width: windowWidth,
            height: height,
            showVelocity: true,
            wireframes: false,
            background: '#f0ebc8',
            showDebug: true
        }
    });


    Render.run(render);

    // create runner
    var runner = Runner.create();
    Runner.run(runner, engine);

    var shang = Bodies.rectangle(centerX, 0, windowWidth, 5, {isStatic: true});
    var xia = Bodies.rectangle(centerX, height, windowWidth, 5, {isStatic: true});
    var you = Bodies.rectangle(windowWidth, height / 2, 5, height, {isStatic: true});
    var zuo = Bodies.rectangle(0, height / 2, 5, height, {isStatic: true});
    World.add(engine.world, [shang, xia, zuo, you]);

    // add mouse control
    var mouse = Mouse.create(render.canvas),
        mouseConstraint = MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
                stiffness: 0.2,
                render: {
                    visible: true
                }
            }
        });

    World.add(engine.world, mouseConstraint);


    var du = Math.PI * 0.4;
    var maxDu = Math.PI * 0.7;
    var minDu = Math.PI * 0.3;
    var stickA = Bodies.rectangle(centerX * 1.2, windowHeight * 0.5 + topOffset, 20, windowWidth * 0.8, {
        isStatic: true,
        angle: du,
        label: "stickA",
        render: {
            fillStyle: '#2E8B57'
        },
        chamfer: 10
    });
    var stickB = Bodies.rectangle(centerX * 1.2, windowHeight * 0.2 + topOffset, 20, windowWidth * 0.8, {
        isStatic: true,
        angle: du,
        label: "stickB",
        render: {
            fillStyle: '#2E8B57'
        },
        chamfer: 10
    });
    World.add(engine.world, [stickA, stickB]);

    var dangA = Bodies.rectangle(stickA.position.x * 1.2, stickA.position.y * 0.8, 5, 100, {isStatic: true});
    var dangB = Bodies.rectangle(stickB.position.x * 1.2, stickB.position.y * 0.8, 5, 100, {isStatic: true});
    var hasDang = false;

    Events.on(mouseConstraint, 'startdrag', function (event) {
        console.log('startdrag', event);
    });

    // an example of using mouse events on a mouse
    Events.on(mouseConstraint, 'enddrag', function (event) {
        console.log('enddrag', event);
        if (event.body.label == "stickA") {
            var startP = event.mouse.mousedownPosition;
            var endP = event.mouse.mouseupPosition;

            var disY = endP.y - stickA.position.y;
            var newDu = 0;
            if (disY > 0) {
                newDu = getTanDeg(disY / 200);
                newDu += 0.5;
            } else {
                newDu = getTanDeg(-disY / 200);
                newDu = 0.5 - newDu;
            }

            console.log(newDu);
            newDu = Math.PI * newDu;


            console.log(disY);
            console.log(newDu);
            if (newDu > maxDu) {
                newDu = maxDu;
            }
            if (newDu < minDu) {
                newDu = minDu;
            }

            Matter.Body.setAngle(stickA, newDu);
        } else if (event.body.label == "stickB") {
            console.log(stickB);
            var startP = event.mouse.mousedownPosition;
            var endP = event.mouse.mouseupPosition;

            var disY = endP.y - stickB.position.y;
            var newDu = 0;
            if (disY > 0) {
                newDu = getTanDeg(disY / 200);
                newDu += 0.5;
            } else {
                newDu = getTanDeg(-disY / 200);
                newDu = 0.5 - newDu;
            }

            console.log(newDu);
            newDu = Math.PI * newDu;


            console.log(disY);
            console.log(newDu);
            if (newDu > maxDu) {
                newDu = maxDu;
            }
            if (newDu < minDu) {
                newDu = minDu;
            }

            Matter.Body.setAngle(stickB, newDu);
        }
    });


    // define our categories (as bit fields, there are up to 32 available)
    var defaultCategory = 0x0001,
        redCategory = 0x0002,
        greenCategory = 0x0004,
        blueCategory = 0x0008;

    var redColor = '#C44D58',
        blueColor = '#4ECDC4',
        greenColor = '#C7F464';
    var circle = Bodies.circle(100, xia.position.y - 60, 30, {
        collisionFilter: {
            mask: defaultCategory | blueCategory
        },
        render: {
            fillStyle: blueColor
        },
        friction: 0.001,
        mass: 100,
        restitution: 0.8
    });
    World.add(engine.world, circle);
    console.log(circle);

    var rectA = Bodies.rectangle(centerX, windowHeight / 2, 60, 60, {
        density: 0.02,
        render: {
            hasBounds: true,
            sprite: {
                texture: './img/10KG.png',
            }
        },
        background: {
            color: 0xFFFFFF
        }
    });

    var rectB = Bodies.rectangle(centerX, 30, 60, 60, {
        density: 0.002,
        render: {
            hasBounds: true,
            sprite: {
                texture: './img/1KG.png',
            }
        },
    });

    //木头
    var rectC = Bodies.rectangle(200, xia.position.y - 60, 60, 60, {
        density: 0.00500,
        render: {
            hasBounds: true,
            sprite: {
                texture: './img/mutou.png',
            }
        },
    });

    //金属
    var rectD = Bodies.rectangle(300, xia.position.y - 60, 60, 60, {
        density: 0.01932,
        render: {
            hasBounds: true,
            sprite: {
                texture: './img/jinshu.png',
            }
        },
    });

    // var rectE = Bodies.rectangle(250, 550, 60, 60);
    //
    // var rectF = Bodies.rectangle(350, 550, 60, 60);

    // 将刚体添加到世界中
    World.add(engine.world, [rectA, rectB, rectC, rectD]);

    return {
        engine: engine,
        runner: runner,
        render: render,
        canvas: render.canvas,
        stop: function () {
            Matter.Render.stop(render);
            Matter.Runner.stop(runner);
            Matter.Engine.clear(engine);
        },
        incRate: function () {
            var newAngle = stickA.angle - 0.1;
            if (newAngle >= minDu) {
                Matter.Body.setAngle(stickA, newAngle);
                Matter.Body.setAngle(stickB, newAngle);
            }
        },
        decRate: function () {
            var newAngle = stickB.angle + 0.1;
            if (newAngle <= maxDu) {
                Matter.Body.setAngle(stickA, newAngle);
                Matter.Body.setAngle(stickB, newAngle);
            }
        },
        changeStatus: function () {
            if (hasDang) {
                World.remove(engine.world, [dangA, dangB]);
            } else {
                World.add(engine.world, [dangA, dangB]);
            }
            hasDang = !hasDang;
        }
    };
};

function getTanDeg(tan) {
    var result = Math.atan(tan);
    return result;
}


$(function () {
    demo = Example.demo($(document).width(), $(window).height(), $("#sim").offset().top);
});

function reset() {
    demo.stop();
    $("#sim").empty();
    demo = Example.demo($(document).width(), $(window).height(), $("#sim").offset().top);
}


function incRate() {
    demo.incRate();
}

function decRate() {
    demo.decRate();
}

function changeStatus() {
    demo.changeStatus();
}