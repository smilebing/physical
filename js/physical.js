var Example = Example || {};

Example.demo = function () {
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
        Vector = Matter.Vector;


    // create an engine
    var engine = Engine.create();

    // create a renderer
    var render = Render.create({
        engine: engine,
        element: document.getElementById("sim"),
        options: {
            width: 800,
            height: 600,
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

    World.add(engine.world, [
        Bodies.rectangle(400, 0, 800, 5, {isStatic: true}),
        Bodies.rectangle(400, 600, 800, 5, {isStatic: true}),
        Bodies.rectangle(800, 300, 5, 600, {isStatic: true}),
        Bodies.rectangle(0, 300, 5, 600, {isStatic: true})]
    );

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
    var stickA = Bodies.rectangle(400, 400, 20, 600, {
        isStatic: true,
        angle: -du,
        render: {
            fillStyle: '#2E8B57'
        },
        chamfer: 10
    });
    var stickB = Bodies.rectangle(400, 150, 20, 600, {
        isStatic: true,
        angle: -du,
        render: {
            fillStyle: '#2E8B57'
        },
        chamfer: 10
    });
    World.add(engine.world, [stickA, stickB]);

    // define our categories (as bit fields, there are up to 32 available)
    var defaultCategory = 0x0001,
        redCategory = 0x0002,
        greenCategory = 0x0004,
        blueCategory = 0x0008;

    var redColor = '#C44D58',
        blueColor = '#4ECDC4',
        greenColor = '#C7F464';
    var circle = Bodies.circle(480, 40, 30, {
        collisionFilter: {
            mask: defaultCategory | blueCategory
        },
        render: {
            fillStyle: blueColor
        },
        friction: 0.001,
        mass: 100
    });
    World.add(engine.world, circle);
    console.log(circle);

    var g = 10;

    //两个物体的质量，g
    var mA = 100;
    var mB = 10;

    var densityA = 0.1;
    var densityB = 1;

    var frictionA = 1;
    var frictionB = 1;

    var vSin = Math.round(Math.sin((du)) * 1000000) / 1000000;

    //余弦值
    var vCos = Math.round(Math.cos((du)) * 1000000) / 1000000;

    //计算摩擦力
    //滑动力
    // Fhua=mg*sin(du)
    //摩擦力
    // Fmo=mg*cos(du)
    // 真正运动的力
    //Fdong=Fhua-Fmo=mg*sin(du)-mg*0.5*cos(du))

    var fA = mA * g * vSin - mA * g * 0.5 * vCos;
    var fB = mB * g * vSin - mB * g * 0.5 * vCos;
    var fAjing = mA * vSin;
    var fBjing = mB * vSin;
    console.log(fA);
    console.log(fB);

    if (fA > 0) {
        //能滑动
        //计算摩擦系数
        frictionA = 1 / fA * 1;
    }

    if (fB > 0) {
        //能滑动
        //计算摩擦系数
        frictionB = 1 / fB * 1;
    }

    console.log(frictionA);
    console.log(frictionB);

    var rectA = Bodies.rectangle(200, 320, 50, 50, {
        friction: frictionA,
        frictionStatic: fAjing,
        mass: mA,
        // render: {
        //     hasBounds: true,
        //     sprite: {
        //         texture: './img/box.png',
        //     }
        // },
        background: {
            color: 0xFFFFFF
        }
    });

    var rectB = Bodies.rectangle(200, 30, 50, 50, {
        friction: frictionB,
        frictionStatic: fBjing,
        mass: mB
    });

    console.log(rectA);
    console.log(rectB);

    // 将刚体添加到世界中
    World.add(engine.world, [rectA, rectB]);

    return {
        engine: engine,
        runner: runner,
        render: render,
        canvas: render.canvas,
        stop: function () {
            Matter.Render.stop(render);
            Matter.Runner.stop(runner);
        }
    };
};

$(function () {
    var demo = Example.demo();
});

function reset() {
    Example.demo().stop();
   $("#sim").empty();
   Example.demo();
}