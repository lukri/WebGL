var Train = function (options) {
    options = options || {};
    var scale = options.scale || 1;
    var startPosition = options.startPosition || {x:0,y:0,z:0};
    var initialSpeed = 0.01*scale;
    var locoSpeed = initialSpeed;
    var maxSpeed = 0.7*scale;
    var accelerate = false;
    var accelerateRate = 0.001*scale;
    var gear = 0;

    var path = options.animationPath || null;
    var trainLength = options.trainLength || 1;



    var trainObj = new Obj();
    
    var wagons = [];
    
    var locoScale = 0.2;
    
    for(var wagonNumber=0;wagonNumber<trainLength;wagonNumber++){
        /*global Loco*/
        wagons[wagonNumber] = new Loco({
            scale:locoScale,
            startPosition:{x:wagonNumber*0.35*-1,y:0,z:0},
            wagonNumber:wagonNumber,
        });
        wagons[wagonNumber].setAnimationPath(path);
        
        trainObj.addChild(wagons[wagonNumber].getObject());
    }


    this.getObject = function(){
        return trainObj;
    };

  
    this.animate = function(){
        for(var wagonNumber=0;wagonNumber<wagons.length;wagonNumber++)
            wagons[wagonNumber].animate();   
    };
    
    this.jumpOnWhenClose = function(camDetails, distance){
        wagons[0].jumpOnWhenClose(camDetails, distance);
    };
    
    this.setShader = function(shader){
        for(var wagonNumber=0;wagonNumber<wagons.length;wagonNumber++)
            wagons[wagonNumber].getObject().setShader(shader);    
    };
    
    this.getLocoPosition = function(){
        return wagons[0].getPosition();    
    };
    

};