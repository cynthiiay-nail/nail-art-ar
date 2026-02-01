const start = async () => {

    const mindarThree = new window.MINDAR.HandThree({
      container: document.body
    });
  
    const { renderer, scene, camera } = mindarThree;
  
    const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
    scene.add(light);
  
    const loader = new THREE.GLTFLoader();
  
    const nail = await new Promise((resolve) => {
      loader.load("model/modelcreampita.glb", resolve);
    });
  
    nail.scene.scale.set(0.03, 0.03, 0.03);
  
    // Anchor ke jari telunjuk
    const anchor = mindarThree.addAnchor(9);
    anchor.group.add(nail.scene);
  
    await mindarThree.start();
    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera);
    });
  
    document.getElementById("loading").style.display = "none";
  };
  
  start();
  