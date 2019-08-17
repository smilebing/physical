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
    var maxDu = Math.PI * 0.7;
    var minDu = Math.PI * 0.3;
    var stickA = Bodies.rectangle(400, 400, 20, 600, {
        isStatic: true,
        angle: du,
        label: "stickA",
        render: {
            fillStyle: '#2E8B57'
        },
        chamfer: 10
    });
    var stickB = Bodies.rectangle(400, 150, 20, 600, {
        isStatic: true,
        angle: du,
        label: "stickB",
        render: {
            fillStyle: '#2E8B57'
        },
        chamfer: 10
    });
    World.add(engine.world, [stickA, stickB]);


    Events.on(mouseConstraint, 'startdrag', function (event) {
        console.log('startdrag', event);
    });

    // an example of using mouse events on a mouse
    Events.on(mouseConstraint, 'enddrag', function (event) {
        console.log('enddrag', event);
        if (event.body.label == "stickA") {
            console.log(stickA);
            var startP = event.mouse.mousedownPosition;
            var endP = event.mouse.mouseupPosition;

            // var tan = -(endP.y - stickA.position.y) / (200);
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
    var circle = Bodies.circle(480, 40, 30, {
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

    var landFrictionStatic = 0.1;
    var landFriction = 0.01;
    var rectA = Bodies.rectangle(600, 320, 60, 60, {
        // friction: landFriction,
        // frictionStatic: landFrictionStatic,
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

    var rectB = Bodies.rectangle(600, 30, 60, 60, {
        // friction: landFriction,
        // frictionStatic: landFrictionStatic,
        // mass: mB,
        density: 0.002,
        render: {
            hasBounds: true,
            sprite: {
                texture: './img/1KG.png',
            }
        },
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

function getTanDeg(tan) {
    var result = Math.atan(tan);
    // result = Math.round(result);
    return result;
}

$(function () {
    var demo = Example.demo();
});

function reset() {
    Example.demo().stop();
    $("#sim").empty();
    Example.demo();
}