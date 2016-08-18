Terrain = function (options) {
    console.log("start terrain");
    options = options || {};
    var sideLength = options.sideLength || 4;
    var n = options.resolution || 7;
    var randomRange = options.randomRange || 2;
    if(options.randomRange==0)randomRange=0;
    n = Math.pow(2,n)+1;
    var closedForm = false;
    if(options.closedForm==true)closedForm = true;

    var grid = new Array(n);
    for (var i = 0; i < grid.length; i++) {
        grid[i] = new Array(n);
    }
    for(var z=0;z<n;z++){
        for(var x=0;x<n;x++){
            grid[z][x] = new Vector();
        }
    }
    /*
    grid[0][0] = new Vector({y:0});
    grid[0][m] = new Vector({y:0});
    grid[m][0] = new Vector({y:0});
    grid[m][m] = new Vector({y:0});
    */

    /*
      0,0......0,x
      .          .
      .          .
      z,0......z,x
    */







    var check = function(array, z, x){
        if(z<0)return null;
        if(z>=array.length)return null;
        if(x<0)return null;
        if(x>=array.length)return null;
        if(array[z][x])return array[z][x];
        return "isEmpty";
    }





    setAverageNormalAlt = function(grid, z, x){
        var mVector = grid[z][x];
        var normal = new Vector();
        var surroundVector, lineNormal,a,b,angleY,angleZ;
        var count = 0;
        for(var k=z-1;k<=z+1;k++){
            for(var i=x-1;i<=x+1;i++){
                if(!((k==z)&&(i==x)))
                    if(surroundVector = check(grid,k,i)){
                        lineNormal = surroundVector.getDifferenceVector(mVector);
                        a = mVector.x-surroundVector.x;
                        b = mVector.z-surroundVector.z;
                        angleY = Math.atan(b/a);
                        lineNormal.rotateAroundY(angleY);
                        angleZ = Math.PI/2;
                        if(a<0)angleZ*=-1;
                        lineNormal.rotateAroundZ(angleZ);
                        lineNormal.rotateAroundY(-angleY);
                        lineNormal.normalize();
                        normal.addVector(lineNormal);
                        count++;
                    };
            }
        }
        if(count>0)normal.divide(count);
        normal.normalize();
        if(normal.y<0)normal.invert();
        mVector.nx = normal.x;
        mVector.ny = normal.y;
        mVector.nz = normal.z;
    };


    setAverageNormal = function(grid, z, x){
        var v = grid[z][x];
        var normal = new Vector();
        normal.addVector(v.getAreaNormal(check(grid,z-1,x-1),check(grid,z-1,x)));
        normal.addVector(v.getAreaNormal(check(grid,z-1,x),check(grid,z,x+1)));
        normal.addVector(v.getAreaNormal(check(grid,z,x+1),check(grid,z+1,x+1)));
        normal.addVector(v.getAreaNormal(check(grid,z+1,x+1),check(grid,z+1,x)));
        normal.addVector(v.getAreaNormal(check(grid,z+1,x),check(grid,z,x-1)));
        normal.addVector(v.getAreaNormal(check(grid,z,x-1),check(grid,z-1,x-1)));
        normal.normalize();
        v.nx = normal.x;
        v.ny = normal.y;
        v.nz = normal.z;
    }





    console.log("\t generate terrain");

    var step = n-1;
    var hs; //half step
    while(step>=2){
        hs = step/2;
        for(var z=0;z<n;z+=step){
            for(var x=0;x<n;x+=step){

                //square
                if(check(grid,z+hs,x+hs)){
                    var vMiddle = grid[z+hs][x+hs];
                    //console.log((z+hs)+"---"+(x+hs));
                    vMiddle.setYAverage([
                        grid[z][x],
                        grid[z][x+step],
                        grid[z+step][x],
                        grid[z+step][x+step]
                    ]);
                    vMiddle.y += (Math.random()-0.5)*randomRange;
                }

                //diamond
                if(check(grid,z,x+hs)){
                    var vRight = grid[z][x+hs];
                    vRight.setYAverage([
                        grid[z][x],
                        grid[z][x+step],
                        check(grid,z-hs,x+hs),
                        check(grid,z+hs,x+hs)
                    ]);
                    vRight.y += (Math.random()-0.5)*randomRange;
                }
                if(check(grid,z+hs,x)){
                    var vBelow = grid[z+hs][x];
                    vBelow.setYAverage([
                        grid[z][x],
                        grid[z+step][x],
                        check(grid,z+hs,x-hs),
                        check(grid,z+hs,x+hs)
                    ]);
                    vBelow.y += (Math.random()-0.5)*randomRange;
                }
            }
        }
        step /= 2;
        randomRange /= 2;
    }

    console.log("\t evaluate terrain height");
    var maxY=0,minY=0;
    for(var z=0;z<n;z++){
        for(var x=0;x<n;x++){
            var v = grid[z][x];
            if(v){
                if(v.y>maxY)maxY=v.y;
                if(v.y<minY)minY=v.y;
            }
        }
    }
    //min-----|------------max
    maxY -= minY;


    var partHeight = maxY / 100;
    var seaLevel = partHeight * 50;
    var peekLevel = partHeight * 60;


    var setYRelatedColor = function(vector){
        var c = {r:0,g:0,b:0,a:1};

        if(vector.y < seaLevel){
            c.b = (vector.y+0.1)/seaLevel;
        }
        if(vector.y >= seaLevel){
            c.g = (vector.y + 0.2)-seaLevel;
        }
        if(vector.y >= peekLevel){
            c.r = c.g = c.b = (vector.y+1)-peekLevel;
        }

        //isobars
        if((vector.y%(partHeight*5))<0.02){
            //c.r = c.g = c.b = 0;
        }


        if(false){
            c.r = Math.random();
            c.g = Math.random();
            c.b = Math.random();
        }
        vector.color = c;
    };



    if(closedForm){
        console.log("\t close terrain");
        for(var i=0;i<n;i++){
            grid[0][i].y = seaLevel+minY;
            grid[n-1][i].y = seaLevel+minY;
            grid[i][0].y = seaLevel+minY;
            grid[i][n-1].y = seaLevel+minY;
        }
    }

    console.log("\t set rest");
    var nLength = sideLength/(n-1);
    for(var z=0;z<n;z++){
        for(var x=0;x<n;x++){
            var v = grid[z][x];
            v.x = x*nLength-sideLength/2.0;
            v.z = z*nLength-sideLength/2.0;
            v.y -= minY;
            setYRelatedColor(v);
            v.y -= seaLevel;
            //flatt seaLevel
            if(v.y<0)v.y=0;

            //alert(v.x);
        }
    }

    console.log("\t set normals");
    for(var z=0;z<n;z++){
        for(var x=0;x<n;x++){
            var v = grid[z][x];
            //console.log(""+(z*n+x)+"/"+(n*n));
            setAverageNormal(grid,z,x);
        }
    }


    var oldN = n;
    console.log("\t convert into object");
    //object can have 2^16 vertices
    var k=1;
    while((n/k*n/k>Math.pow(2,16))||((n/k)%1 != 0)){
        k++
    };
    //alert(n);
    //k=3;
    n/=k;
    console.log("\t "+k+"x"+k);
    if(k>20){
        alert("not able to do this task");
        return;
    }


    this.terrainObject = new Object();

    var i=0;
    for(var pZ=0;pZ<oldN-n;pZ+=n-1){
        for(var pX=0;pX<oldN-n;pX+=n-1){
            i=0;
            this.normals=[];this.textureCoords=[];this.vertices=[];this.colors=[];this.indices=[];
            for(var z=0;z<n;z++){
                for(var x=0;x<n;x++){
                    var v = grid[z+pZ][x+pX];
                    if(!v)alert(""+
                        "z:"+z+
                        "pZ:"+pZ+
                        "x:"+x+
                        "pX:"+pX);
                    this.vertices.push(v.x, v.y, v.z);

                    var normal = v.getNormal();
                    this.normals.push(normal.x,normal.y,normal.z);

                    if((z==0)||(x==0)){
                        this.colors.push(1-v.color.r,1-v.color.g,1-v.color.b,v.color.a);
                    }else{
                        this.colors.push(v.color.r,v.color.g,v.color.b,v.color.a);
                    }
                    if((z<(n-1))&&(x<(n-1))){
                        this.indices.push(i,i+1,i+1+n);
                        this.indices.push(i,i+1+n,i+n);
                    }
                    i++;
                }
            }

            var terrainPart = new Object("preloaded",{
                vertices:this.vertices,
                normals:this.normals,
                colors:this.colors,
                indices:this.indices
            })
            this.terrainObject.addChild(terrainPart);
        }
    }
    console.log("end terrain");

    this.getObject = function(){
        return this.terrainObject;
    };

};