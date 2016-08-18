var world;
var dreieck;
var quadrat;

var camera;
var moon;
var smallCube;

var teapot;
var teapotGroupt;

var earth;
var earthGroup;

var laptop;
var pickingTexture;


function assemblyScene() {
    //document.body.style.background = "black";
    alert("start new");


    //framebufferHandler is defined in FramebufferHandler.js
    framebufferHandler.addFramebuffer("screen");
    framebufferHandler.InitializePickingBuffers();
    pickingTexture =  framebufferHandler.rttTexture;


    //shaderHanlder is defined in ShaderHandler.js
    shaderHanlder.addShader("perFragLight","perfraglight-fs","shader-vs");
    shaderHanlder.addShader("perVertexLight","pervertexlight-fs","shader-vs");
    shaderHanlder.addShader("terrainShader","terrain-fs","shader-vs");
    shaderHanlder.addShader("color-shader","color-fs","shader-vs");
    shaderHanlder.addShader("picking-shader","picking-fs","picking-vs");


    camera = new Camera();


    world = new Object();
    world.setTexture("metal");
    world.setShader("perFragLight");
    world.shininess = 225;
    world.translate({z:-10});
    world.name = "world";





    var sky = new Object("sphere",{
        latitudeBands: 100,
        longitudeBands: 100,
        radius: 100,
     });

    terrainHolder = new Terrain({
        sideLength:50,
        randomRange:20,
        resolution:8,
        repeatX:2,
        repeatZ:2,
        plantTrees:false,
        plantAngle:2,
    });
    terrain = terrainHolder.getObject();

    terrain.setShader("color-shader");
    terrain.setShader("terrainShader");
    terrain.shininess = 300;
    terrainPlace = new Object();
    terrainPlace.addChild(terrain);



    //world.addChild(sky);


    sea = new Object("cuboid",{
        x:50,
        y:0.001,
        z:50
    })
    sea.texture = null;
    sea.useBlending = true;
    sea.alphaValue = 0.6;
    sea.shininess = 20;


    //world.addChild(sea);


    var pfad;
    if(true){
        pfad = [];
        var k=30, angle = Math.PI*2/k, rad=10;
        rad = 20;
        for(var i=0;i<k; i++){

            pfad.push(new Vector(
                Math.sin(i*angle)*(rad +(Math.random()-0.5)*3),
                2.5,//4+Math.random(), //5,
                Math.cos(i*angle)*(rad +(Math.random()-0.5)*3)
            ));
        }
    }

    //pfad.push(new Vector(2,5,-20));
    //pfad = [new Vector(-5,3.5,0),new Vector(5,3,0),new Vector(5,3,4)];

    //pfad = [new Vector(-5,3.5,0),new Vector(5,3.5,0),new Vector(0,2.5,4),new Vector(0,2.5,-4)];


    pfad = terrainHolder.getTrainPath();

    bridgeHolder = new Bridge({
        path:pfad,
        closePath:true,
    });





    bridge = bridgeHolder.getObject();
    bridge.setShader("perFragLight");

    bridgePlace = new Object();
    bridgePlace.addChild(bridge);
    //bridgePlace.translate({y:18});

    /*tunnel
    var upV = new Vector(0,0.5,0);
    for(var i=0;i<=0;i++){
        var v1 = pfad[0].getDifferenceVector(pfad[1]);
        var v2 = v1.getCrossProductVector(upV);
        var p1 = v2.clone()
        p1.setLength(0.5);
        p1.addVector(pfad[0]);
        p1.addVector(upV);
        var p2 = v2.clone()
        p2.invert();
        p2.setLength(0.5);
        p2.addVector(pfad[0]);
        p2.addVector(upV);

        //p1=new Vector(0,3,0);
        //p2= new Vector(1,4,3) ;
        var p3= new Vector(1,4,2)

        var tunnelPfad = [p1,p2,p2];
        if(false){
        var tunnel = new Bridge({
            path:tunnelPfad,
            overlap:0,
            archHeight:0.5,
            radius:0.5,
        });
        bridgePlace.addChild(tunnel.getObject());
        }
    }


    */

    var locoScale = 0.2;
    loco = new Loco({
        scale:locoScale,
    });
    loco.setAnimationPath(pfad);
    //world.children = [];
    world.addChild(loco.getObject());
    loco.getObject().setShader("color-shader");



    tree = new Tree();
    tree = tree.getObject();
    tree.scale({xyz:0.2});
    tree.setShader("color-shader");
    world.addChild(tree);


    terrainTrees = terrainHolder.getTrees();
    terrainTrees.setShader("color-shader")



    world.addChild(terrainPlace);
    world.addChild(bridgePlace);


    world.addChild(terrainTrees);






}