//google: fractal tree
//http://rosettacode.org/wiki/Fractal_tree#JavaScript


Tree = function (options) {
    options = options || {};
    var depth = options.depth || 14;
    var factor = 1/(depth);
    var trunkN = 25;
    var trunkAngle = Math.PI*2/(trunkN);

    var leafN = 5;
    var leafAngle = Math.PI*2/(leafN);


    var radius = 0.5;
    var length = 2;


    var degToRad = Math.PI / 180.0;

    var vertices=[],normals=[],textureCoords=[],colors=[],indices=[];

    var object = new Object();


    var circleN = trunkN;
    var cirlceAngle = trunkAngle;
    var base = [];
    for(var i=0;i<circleN;i++){
        var p = new Vector(
                            Math.cos(cirlceAngle*i),
                            0,
                            Math.sin(cirlceAngle*i)
        );
        p.setLength(depth*factor*radius);
        p.setNormal(p.x,p.y,p.z);
        base.push(p);
    }


    var startNewObjectPart = function(){
        var part = new Object("preloaded",{
                    vertices:vertices,
                    normals:normals,
                    colors:colors,
                    indices:indices
        });
        object.addChild(part);
        vertices=[],normals=[],textureCoords=[],colors=[],indices=[];
    }


    //http://inside.mines.edu/fs_home/gmurray/ArbitraryAxisRotation/
    //Rotate the point p theta(t) degrees around the vector from sPV,ePV
    rotatePointAroundVector = function(p,sPV,ePV,t){
        var dv = ePV.getDifferenceVector(sPV);
        dv.normalize();
        var x=p.x,y=p.y,z=p.z,  u=dv.x,v=dv.y,w=dv.z,  a=ePV.x,b=ePV.y,c=ePV.z;
        var st = Math.sin(t*degToRad);
        var ct = Math.cos(t*degToRad);
        return new Vector(
            (a*(v*v+w*w)-u*(b*v+c*w-u*x-v*y-w*z))*(1-ct)+x*ct+(-c*v+b*w-w*y+v*z)*st,
            (b*(u*u+w*w)-v*(a*u+c*w-u*x-v*y-w*z))*(1-ct)+y*ct+(c*u-a*w+w*x-u*z)*st,
            (c*(u*u+v*v)-w*(a*u+b*v-u*x-v*y-w*z))*(1-ct)+z*ct+(-b*u+a*v-v*x+u*y)*st
        )
    }



    drawNextSegment = function(startP,spreadAngle,parentEndCircle,sPParent,turnAngle,depth){
        if(depth==1)return;

        //drawing
        var endP = sPParent.getDifferenceVector(startP);
        var perpV = new Vector(0,1,0);
        if(endP.isZeroVector()){
            endP = new Vector(0,1,0);
            perpV = new Vector(0,0,1);
        }
        endP.setLength(depth*factor*length);
        endP.addVector(startP);
        perpV.addVector(startP);
        endP = rotatePointAroundVector(endP,startP,perpV,spreadAngle);
        endP = rotatePointAroundVector(endP,sPParent,startP,turnAngle);
        var j=vertices.length/3;


        var circleN = trunkN;
        var cirlceAngle = trunkAngle;
        if(depth==1){
            circleN = leafN;
            cirlceAngle = leafAngle;
        }

        //65536 = 2^16
        if(j+circleN*2>65536){
            startNewObjectPart();
            j=0;
        }

        var endCircle = [];

        for(var i=0;i<circleN;i++){
            var sP = parentEndCircle[i];

            var p = new Vector(
                            Math.cos(cirlceAngle*i),
                            0,
                            Math.sin(cirlceAngle*i)
                        );

            //p.rotateAroundZ(spreadAngle*degToRad);
            var eP = p.clone({length:(depth-1)*factor*radius});
            eP.addVector(endP);
            eP.setNormal(p.x,p.y,p.z);

            endCircle.push(eP);

            var sPN = sP.getNormal();
            var ePN = eP.getNormal();

            vertices.push(sP.x,sP.y,sP.z,      eP.x,eP.y,eP.z);
            normals.push( sPN.x,sPN.y,sPN.z,   ePN.x,ePN.y,ePN.z);
            if(depth==1){
                colors.push(0.1,2,0.2,1,  0.1,2,0.2,1);
            }else{
                var r = 0.6;//Math.random()+0.5;
                colors.push(r,r/2,0,1);
                colors.push(r,r/2,0,1);
            }
            indices.push(j+i*2,j+i*2+1,j+(i*2+2)%(circleN*2));
            indices.push(j+i*2+1,j+(i*2+2)%(circleN*2),j+(i*2+3)%(circleN*2));
        }

        //invoke next
        turnAngle = 0*(Math.random()-0.5)*360;
        turnV = endP.getDifferenceVector(startP);
        var lrb = Math.random();
        if((lrb>=0.1)&&(lrb<=0.9))lrb=0.5;  // 0=left, 0.5=both, 1=right
        //lrb=0.1;
        if(lrb<=0.5)drawNextSegment(endP,20,endCircle,startP,turnAngle,depth-1);
        if(lrb>=0.5)drawNextSegment(endP,-20,endCircle,startP,turnAngle,depth-1);
    }


    //init tree
    var startP = new Vector();
    drawNextSegment(startP,10,base,startP,0,depth);

    startNewObjectPart();

    this.getObject = function(){
        return object;
    };



};