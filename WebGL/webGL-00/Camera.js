Camera = function (options) {
    this.options = options || {};

    var pitch = -8;
    var yaw = 0;
    var xPos = 0;
    var yPos = 20;
    var yPosAddition = 20;
    var zPos = 0;
    var joggingAngle = 0;

    var cameraMatrix = mat4.create();
    mat4.identity(cameraMatrix);

    this.update = function(speed, yawRate, pitchRate, elapsed){
        yPos = 0;
        if (speed != 0) {
            xPos -= Math.sin(degToRad(yaw)) * speed * elapsed *0.05;
            zPos -= Math.cos(degToRad(yaw)) * speed * elapsed *0.05;

            joggingAngle += elapsed * 0.6;  // 0.6 "fiddle factor" -- makes it feel more realistic
            yPos = Math.sin(degToRad(joggingAngle)) / 40;
        }
        yPos += yPosAddition;
        //if(yPosAddition>0.4)yPosAddition-=0.1;
        if(yPosAddition>3.0)yPosAddition-=0.1;

        yaw += yawRate * elapsed;
        pitch += pitchRate * elapsed;
        if(pitch>=30)pitch=30;
        if(pitch<=-40)pitch=-40;

        mat4.identity(cameraMatrix);
        mat4.rotate(cameraMatrix, degToRad(-pitch), [1, 0, 0]);
        mat4.rotate(cameraMatrix, degToRad(-yaw), [0, 1, 0]);
        mat4.translate(cameraMatrix, [-xPos, -yPos, -zPos]);


    }

    this.getMatrix = function(){
        return cameraMatrix;
    }
    this.getDetails = function(){
        return {
            pitch:pitch,
            yaw:yaw,
            xPos:xPos,
            yPos:yPos,
            zPos:zPos,
            joggingAngle:joggingAngle,
        };
    }

    this.setYPos = function(y){
        yPosAddition = y;
    }


    this.translate = function(translation, doBefore){
        var transMat = mat4.create();
        mat4.identity(transMat);
        var translateArray = [0,0,0];
        translation = translation || {};
        if(translation.x)translateArray[0]=translation.x;
        if(translation.y)translateArray[1]=translation.y;
        if(translation.z)translateArray[2]=translation.z;
        mat4.translate(transMat, translateArray);
        if(doBefore){
            mat4.multiply(cameraMatrix,transMat,cameraMatrix);
        }else{
            mat4.multiply(transMat,cameraMatrix,cameraMatrix);
        }
    }

}