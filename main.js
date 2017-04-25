$(document).ready(function () {

    var canvas = document.querySelector("#renderCanvas");
    var engine = new BABYLON.Engine(canvas, true);
    var scene;
    var meshesArray = [];
    var canCut = false;
    var box;
    var camera;
    var light;

    var actionClick = function () {
        console.log("KEKEKEKEKKE0");
    }

    function clearCamera() {
        camera.setTarget(BABYLON.Vector3.Zero());
    }

    var createScene = function () {
        //scene
        scene = new BABYLON.Scene(engine);
        scene.clearColor = new BABYLON.Color3(1, 1, 1);



        //camera
        camera = new BABYLON.ArcRotateCamera("camera1", 3 * Math.PI / 2, Math.PI / 4, 80, BABYLON.Vector3.Zero(), scene);
        //camera = new BABYLON.WebVRFreeCamera("camera1", new BABYLON.Vector3(5, 5, 0), scene);
        camera.setTarget(BABYLON.Vector3.Zero());
        camera.attachControl(canvas, true);

        scene.onPointerDown = function () {
            scene.onPointerDown = undefined
            camera.attachControl(canvas, true);
        }

        // //light
        light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
        light.intensity = 0;

        //light
        var light0 = new BABYLON.HemisphericLight("Hemi0", new BABYLON.Vector3(0, 1, 0), scene);
        light0.diffuse = new BABYLON.Color3(1, 1, 1);
        light0.specular = new BABYLON.Color3(1, 1, 1);
        light0.groundColor = new BABYLON.Color3(0, 0, 0);

        return scene;
    }

    function loadAction(meshes) {
        for (var i = 0; i < meshes.length; i++) {
            var mesh = meshes[i];
            meshesArray.push(mesh);
            if (mesh.id != 'Group21700') {
                mesh.actionManager = new BABYLON.ActionManager(scene);
                mesh.actionManager.registerAction(new BABYLON.InterpolateValueAction(BABYLON.ActionManager.OnPointerOutTrigger, mesh, "scaling", new BABYLON.Vector3(1, 1, 1), 150));
                mesh.actionManager.registerAction(new BABYLON.InterpolateValueAction(BABYLON.ActionManager.OnPointerOverTrigger, mesh, "scaling", new BABYLON.Vector3(1.1, 1.1, 1.1), 150));
                mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, test.bind(mesh)));
                function test() {
                    if (canCut) {
                        this.dispose();
                    } else {
                        var info = {
                            title: this.id,
                            desc: "some description"
                        }
                        openRightSide(info);
                    }
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

    function loadBrain() {
        clearMeshes();
        BABYLON.SceneLoader.ImportMesh("", "textures/", 'brain.babylon', scene, function (meshes, particleSystems, skeletons) {
            var skeleton = skeletons[0];
            loadAction(meshes);
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
            var skeleton = skeletons[0];
            loadAction(meshes);
        });
    }





    var scene = createScene();

    function render() {
        //scene.activeCamera.alpha += .005;
    }

    scene.onPointerDown = function (evt, pickResult) {
        if (pickResult.hit) {
            console.dir(pickResult);
            //box.position.x = pickResult.pickedPoint.x;
            //box.position.z = pickResult.pickedPoint.z;
        }
    };

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
    })

    window.addEventListener("resize", function () {
        engine.resize();
    });
});