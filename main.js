$(document).ready(function () {




    //var sight = document.createElement('div');
    //sight.classList.add("gunsight");
    var canvas = document.querySelector("#renderCanvas");
    //canvas.appendChild(sight);
    var engine;
    var scene;
    var meshesArray = [];
    var canCut = false;
    var box;
    var camera;
    var light;
    var scalpel;

    var actionClick = function () {
        console.log("KEKEKEKEKKE0");
    }

    function clearCamera() {
        camera.setTarget(BABYLON.Vector3.Zero());
    }

    var width;
    var height;
    var sight;
    var createScene = function () {




        //scene
        engine = new BABYLON.Engine(canvas, true);
        scene = new BABYLON.Scene(engine);
        scene.clearColor = new BABYLON.Color3(0.2, 0.2, 0.4);
        //scene.gravity = new BABYLON.Vector3(0, -9.81, 0);
        width = scene.getEngine().getRenderWidth();
        height = scene.getEngine().getRenderHeight();
        initPointer();
        //camera
        //camera = new BABYLON.ArcRotateCamera("camera1", 3 * Math.PI / 2, Math.PI / 4, 80, BABYLON.Vector3.Zero(), scene);
        //camera = new BABYLON.FreeCamera("FreeCamera", new BABYLON.Vector3(0, 5, -5), scene);



        camera = new BABYLON.VRDeviceOrientationFreeCamera("vrCam", new BABYLON.Vector3(0, 2, -3), engine.scenes[0]);
        //camera.setTarget(BABYLON.Vector3.Zero());
        camera.attachControl(canvas, true);
        camera.speed = 0.2;
        camera.radius = 1;
        camera.checkCollisions = true;



        // var skyMaterial = new BABYLON.SkyMaterial("skyMaterial", scene);
        // skyMaterial.backFaceCulling = false;
        // var skybox = BABYLON.Mesh.CreateBox("skyBox", 1000.0, scene);
        // skybox.material = skyMaterial;
        // skyMaterial.inclination = 0.5; // The solar inclination, related to the solar azimuth in interval [0, 1]
        // skyMaterial.azimuth = 0.25;


        var box = BABYLON.Mesh.CreateBox("crate", 3.5, scene);
        //box.material = new BABYLON.StandardMaterial("Mat", scene);
        //box.material.diffuseTexture = new BABYLON.Texture("textures/crate.png", scene);
        //box.material.diffuseTexture.hasAlpha = true;
        box.position = new BABYLON.Vector3(0, 0, 0);
        box.visibility = 0;
        box.checkCollisions = true;

        //camera = new BABYLON.VRDeviceOrientationFreeCamera("vrCam", new BABYLON.Vector3(-5.8980848729619885, 2, 0.4818257550471734), engine.scenes[0]);

        // scene.fogDensity = 0.02;
        // scene.fogMode = BABYLON.Scene.FOGMODE_EXP;

        // Create the Tiled Ground

        var xmin = -10;
        var zmin = -15;
        var xmax = 10;
        var zmax = 10;
        var precision = {
            "w": 2,
            "h": 2
        };
        var subdivisions = {
            'h': 4,
            'w': 4
        };
        var tiledGround = new BABYLON.Mesh.CreateTiledGround("Tiled Ground", xmin, zmin, xmax, zmax, subdivisions, precision, scene);
        tiledGround.checkCollisions = true;

        // Create Multi Material
        var multimat = new BABYLON.MultiMaterial("multi", scene);
        for (var row = 0; row < subdivisions.h; row++) {
            for (var col = 0; col < subdivisions.w; col++) {
                var material = new BABYLON.StandardMaterial(
                    "material" + row + "-" + col,
                    scene
                );
                material.diffuseTexture = new BABYLON.Texture(
                    "./textures/g.png",
                    scene
                );
                material.diffuseTexture.wrapU = BABYLON.Texture.CLAMP_ADDRESSMODE;
                material.diffuseTexture.wrapV = BABYLON.Texture.CLAMP_ADDRESSMODE;
                material.specularColor = new BABYLON.Color4(0, 0, 0, 0);
                material.backFaceCulling = false;
                multimat.subMaterials.push(material);
            }
        }


        // Part 3 : Apply the multi material
        // Define multimat as material of the tiled ground
        tiledGround.material = multimat;

        // Needed variables to set subMeshes
        var verticesCount = tiledGround.getTotalVertices();
        var tileIndicesLength = tiledGround.getIndices().length / (subdivisions.w * subdivisions.h);

        // Set subMeshes of the tiled ground
        tiledGround.subMeshes = [];
        var index = 0;
        var base = 0;
        for (var row = 0; row < subdivisions.h; row++) {
            for (var col = 0; col < subdivisions.w; col++) {
                var submesh = new BABYLON.SubMesh(
                    index++, 0, verticesCount, base, tileIndicesLength, tiledGround
                );
                tiledGround.subMeshes.push(submesh);
                base += tileIndicesLength;
            }
        }
        // scene.onPointerDown = function () {
        //     scene.onPointerDown = undefined
        //     camera.attachControl(canvas, true);
        // }

        camera.applyGravity = true;
        camera.ellipsoid = new BABYLON.Vector3(1, 1, 1);
        scene.collisionsEnabled = true;



        // //light
        light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 2, 0), scene);
        light.intensity = 0;

        //light
        var light0 = new BABYLON.HemisphericLight("Hemi0", new BABYLON.Vector3(0, 2, 0), scene);
        light0.diffuse = new BABYLON.Color3(1, 1, 1);
        light0.specular = new BABYLON.Color3(1, 1, 1);
        light0.groundColor = new BABYLON.Color3(0, 0, 0);

        sight = BABYLON.Mesh.CreateTorus("torus", 0.2, 0.05, 30, scene, false, BABYLON.Mesh.DEFAULTSIDE);
        sight.emissiveColor  = BABYLON.Vector3(1,0,0);
        sight.material = new BABYLON.StandardMaterial("texture1", scene);
        sight.material.diffuseColor = new BABYLON.Color3(1.0, 0.0, 0.0);
        // sight.rotation.z =  1.1;
             //    sight.rotation.x -= 0.2;
             sight.rotation.x = Math.PI/2;
                 sight.position.z = 4;
               //  sight.position.y -= 1.6;
                // sight.position.x -= 0.4;
                 sight.parent = camera;
   
                 sight.renderingGroupId = 1;
       // loadScalpel();
        //scalpel.rotation.x -= 0.2;
        //scalpel.parent = camera;

        loadSkeleton();
        //loadBrain();
        //loadMesh(0,2,0,0.04,'muscle');
        loadMesh(0, 0, 8, 0.01, 'stol');
        loadMesh(-8, 1, -3, 0.01, 'ekrany2', -Math.PI / 2);
        loadMesh(-7, 1.45, 5, 0.004, 'kurtyna', -Math.PI / 4);
        loadMesh(8, 0.8, 0, 0.004, 'l', Math.PI / 2);
        loadMesh(4, 0, -10, 0.04, 'lozko');
        loadMesh(6, 1, 6, 0.006, 'szafka', Math.PI / 4);
        loadMesh(-7, 1.45, -9, 0.004, 'kurtyna', Math.PI / 4);
        return scene;
    }



    var meshA;
    function loadAction(meshes) {

        meshA = meshes;
        for (var i = 0; i < meshes.length; i++) {
            var mesh = meshes[i];

            meshesArray.push(mesh);
            if (mesh.id != 'Group21700') {
                mesh.actionManager = new BABYLON.ActionManager(scene);
                mesh.actionManager.registerAction(new BABYLON.InterpolateValueAction(BABYLON.ActionManager.OnPointerOutTrigger, mesh, "scaling", new BABYLON.Vector3(1, 1, 1), 150));
                mesh.actionManager.registerAction(new BABYLON.InterpolateValueAction(BABYLON.ActionManager.OnPointerOverTrigger, mesh, "scaling", new BABYLON.Vector3(1.1, 1.1, 1.1), 150));
                //mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, test.bind(mesh)));
                function test() {
                    var info = {
                        title: this.id,
                        desc: "some description"
                    }
                    openRightSide(info);
                }
            }
        }
        mesh.diffuseColor = new BABYLON.Color3(0.5, 1, 1);
        scene.registerBeforeRender(function () {

            //skeleton.bones[0].rotate(BABYLON.Axis.Y, .01, BABYLON.Space.WORLD, mesh);
            //skeleton.bones[3].rotate(BABYLON.Axis.X, .01, BABYLON.Space.WORLD, mesh);
            //skeleton.bones[6].rotate(BABYLON.Axis.Z, .01, BABYLON.Space.WORLD, mesh);

        });


    }

    function clearMeshes() {
        for (var i = 0; i < meshesArray.length; i++) {
            meshesArray[i].dispose();
        }
    }
    var brain;

    function loadScalpel() {

        BABYLON.SceneLoader.ImportMesh("", "textures/skalpel/", 'untitled.babylon', scene, function (meshes, particleSystems, skeletons) {
            console.dir(meshes);
             scalpel = meshes;
            for (var i = 0; i < meshes.length; i++) {
                var mesh = meshes[i];
                mesh.position = new BABYLON.Vector3(0,  -1 , 0.5);
                mesh.rotation.x = Math.PI / 4
                mesh.scaling = new BABYLON.Vector3(0.4, 0.4,0.4);
                mesh.parent = camera;
                mesh.renderingGroupId = 1;
            }
        });
    }

    function loadBrain() {

        BABYLON.SceneLoader.ImportMesh("", "textures/", 'brain.babylon', scene, function (meshes, particleSystems, skeletons) {
            brain = meshes;
            for (var i = 0; i < meshes.length; i++) {
                var mesh = meshes[i];
                mesh.position = new BABYLON.Vector3(0, 0, 0);
                mesh.scaling = new BABYLON.Vector3(1.6, 1.6, 1.6);
            }
        });
    }


    function loadMuscleSkeleton() {
        clearMeshes();
        BABYLON.SceneLoader.ImportMesh("", "textures/muscle/", 'untitled.babylon', scene, function (meshes, particleSystems, skeletons) {
            var skeleton = skeletons[0];
            loadAction(meshes);
        });
    }


    function loadSkeleton() {
        clearMeshes();
        BABYLON.SceneLoader.ImportMesh("", "textures/", 'skelet.babylon', scene, function (meshes, particleSystems, skeletons) {
            console.dir(meshes);
            var skeleton = skeletons[0];
            for (var i = 0; i < meshes.length; i++) {
                var mesh = meshes[i];
                mesh.position.y = 1.35;
                mesh.scaling = new BABYLON.Vector3(0.4, 0.4, 0.4);
                mesh.position.z = 0;

            }
        });
    }


    function loadTable() {
        BABYLON.SceneLoader.ImportMesh("", "textures/stol/", 'untitled.babylon', scene, function (meshes, particleSystems, skeletons) {
            for (var i = 0; i < meshes.length; i++) {
                var mesh = meshes[i];
                mesh.position.x = 10;
                mesh.scaling = new BABYLON.Vector3(0.01, 0.01, 0.01);
            }
        });
    }

    function loadDisplays(posX, posY, posZ, scale) {
        BABYLON.SceneLoader.ImportMesh("", "textures/ekrany2/", 'untitled.babylon', scene, function (meshes, particleSystems, skeletons) {
            for (var i = 0; i < meshes.length; i++) {
                var mesh = meshes[i];
                mesh.position = new BABYLON.Vector3(posX, posY, posZ);
                mesh.scaling = new BABYLON.Vector3(scale, scale, scale);
            }
        });
    }


    function loadMesh(posX, posY, posZ, scale, path, rotZ) {
       BABYLON.SceneLoader.ImportMesh("", "textures/" + path + "/", 'untitled.babylon', scene, function (meshes, particleSystems, skeletons) {
            for (var i = 0; i < meshes.length; i++) {
                var mesh = meshes[i];
                
                mesh.position = new BABYLON.Vector3(posX, posY, posZ);
                mesh.scaling = new BABYLON.Vector3(scale, scale, scale);
                if (rotZ)
                    mesh.rotation.z = rotZ;
            }
    
        });
       
       
    }



    var getPositionObjet = function () { var camera = scene.activeCamera; var forward = new BABYLON.Vector3(camera.position.x + 1, camera.position.y, camera.position.z + 1); return forward; };

    var scene = createScene();

    function render() {
        console.log(engine.getFps());

        // var t = camera._currentTarget;;
        // console.dir(camera);

        //console.dir(t.x,t.y,t.z);
       // sight.position.x = t.x;
       // sight.position.y = t.y;
       // sight.position.z = t.z+1;

        // sight.rotation.x = camera.rotation.x;
        // sight.rotation.y = camera.rotation.y;
        // sight.rotation.z = camera.rotation.z;
        //scene.activeCamera.alpha += .005;
    }

    // scene.onPointerDown = function (evt, pickResult) {
    //     if (pickResult.hit) {
    //         console.dir(pickResult);
    //         //box.position.x = pickResult.pickedPoint.x;
    //         //box.position.z = pickResult.pickedPoint.z;
    //     }
    // };

    function openRightSide(obj) {
        document.getElementById("right-panel").style.display = "inline";
        var title = document.getElementById("title");
        title.innerHTML = obj.title;

        var desc = document.getElementById("desc");
        desc.innerHTML = obj.desc;

    }

    function toggleLight() {
        if (light.intensity == 0) {
            light.intensity = 0.5;
        }
        else {
            light.intensity = 0;
        }
    }

    $("#muscle").click(function () {
        loadMuscleSkeleton();
    });

    $("#brain").click(function () {
        loadBrain();
    });

    $("#skeleton").click(function () {
        loadSkeleton();
    });

    $("#cut").click(function () {
        $("#cut").toggleClass("active-element");
        canCut = !canCut;
    });

    $("#camera").click(function () {
        clearCamera();
    });

    $("#light").click(function () {
        $("#light").toggleClass("active-element");
        toggleLight();
    });

    $(".close-btn").click(function () {
        document.getElementById("right-panel").style.display = "none";
    });

    engine.runRenderLoop(function () {
        render();
        scene.render();
    });

    var gyroPresent = false;
    // window.addEventListener("devicemotion", function (event) {
    //     if (event.rotationRate.alpha || event.rotationRate.beta || event.rotationRate.gamma){
    //         gyroPresent = true;
    //          var aX = event.accelerationIncludingGravity.x*1;
    //          var aY = event.accelerationIncludingGravity.y*1;
    //          var aZ = event.accelerationIncludingGravity.z*1;
    //          for (var i = 0; i < meshA.length; i++) {
    //             meshA[i].rotation.z -= event.rotationRate.alpha/20;
    //          }
    // }

    // });

    function initPointer() {
        var _this = this;
        // Request pointer lock
        // On click event, request pointer lock
        canvas.addEventListener("click", function (evt) {
            canvas.requestPointerLock = canvas.requestPointerLock || canvas.msRequestPointerLock || canvas.mozRequestPointerLock || canvas.webkitRequestPointerLock;
            if (canvas.requestPointerLock) {
                canvas.requestPointerLock();
            }
        }, false);

        // Event listener when the pointerlock is updated (or removed by pressing ESC for example).
        var pointerlockchange = function (event) {
            _this.controlEnabled = (
                document.mozPointerLockElement === canvas
                || document.webkitPointerLockElement === canvas
                || document.msPointerLockElement === canvas
                || document.pointerLockElement === canvas);
            // If the user is alreday locked
            if (!_this.controlEnabled) {
                camera.detachControl(canvas);
            } else {
                camera.attachControl(canvas);
            }
        };

        // Attach events to the document
        document.addEventListener("pointerlockchange", pointerlockchange, false);
        document.addEventListener("mspointerlockchange", pointerlockchange, false);
        document.addEventListener("mozpointerlockchange", pointerlockchange, false);
        document.addEventListener("webkitpointerlockchange", pointerlockchange, false);
    }

    $(window).keypress(function (e) {
        if (e.keyCode === 0 || e.keyCode === 32) {
            e.preventDefault()
             var pickInfo = scene.pick(width/2, height/2, null, false, camera);
             
             if(pickInfo.pickedMesh._parentNode.id === 'Brain'){
                 pickInfo.pickedMesh.dispose();
                    console.dir(pickInfo);
             }
        }
console.log(e.keyCode);
        if(e.keyCode === 114){
            e.preventDefault()
            console.log("load rain;")
            loadBrain();
        }
    })

    window.addEventListener("resize", function () {
        engine.resize();
    });
});