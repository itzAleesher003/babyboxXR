class Game {
  constructor(canvasSelector = "canvas") {
    this._canvas = document.querySelector(canvasSelector);
    this._engine = new BABYLON.Engine(this._canvas);

    // Scene
    this._scene = new BABYLON.Scene(this._engine);

    // Camera
    this._camera = new BABYLON.ArcRotateCamera(
      "Main Camera",
      Math.PI / 8,
      1.3,
      25,
      BABYLON.Vector3.Zero(),
      this._scene
    );

    this._camera.attachControl(this._canvas);

    // Light
    const light = new BABYLON.HemisphericLight(
      "mainLight",
      new BABYLON.Vector3(0, -10, 0),
      this._scene
    );

    light.intensity = 0.7;

    // Ground
    BABYLON.SceneLoader.ImportMesh("", "src/assets/", "floor.glb", this._scene);

    // Crate
    BABYLON.SceneLoader.ImportMesh(
      "",
      "src/assets/",
      "crate.glb",
      this._scene,
      crateMesh => {
        crateMesh[0].position.set(0, -6, 0);
      }
    );

    // Skybox
    const skybox = BABYLON.Mesh.CreateBox("skyBox", 100.0, this._scene);
    const skyboxMaterial = new BABYLON.StandardMaterial("skyBox", this._scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture(
      "src/assets/textures/env",
      this._scene
    );
    skyboxMaterial.reflectionTexture.coordinatesMode =
      BABYLON.Texture.SKYBOX_MODE;
    skyboxMaterial.disableLighting = true;
    skybox.material = skyboxMaterial;

    // XR - Basic
    // this._scene.createDefaultXRExperienceAsync();

    // XRHelper
    BABYLON.WebXRExperienceHelper.CreateAsync(this._scene).then(xrHelper => {
      xrHelper.enterXRAsync(
        "immersive-vr",
        "local-floor" /*, optionalRenderTarget */
      );
    });

    // Render Loop
    this._engine.runRenderLoop(() => {
      this._scene.render();
    });
  }
}

new Game(".renderCanvas");
