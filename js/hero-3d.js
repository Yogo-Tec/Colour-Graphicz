/**
 * Sri Mahavishnu Colour Graphicz - 3D Hero Section WebGL Engine
 * Built with Three.js (Loads dynamically if available)
 */

(function () {
  "use strict";

  let scene, camera, renderer, boxMesh, wireframeMesh, sphereGroup, particleSystem;
  let mouseX = 0, mouseY = 0;
  let targetX = 0, targetY = 0;

  function init3DHero() {
    const container = document.getElementById("hero3dStage");
    const canvas = document.getElementById("hero3dCanvas");

    if (!container || !canvas || typeof THREE === "undefined") {
      console.log("Three.js not loaded or canvas container missing.");
      return;
    }

    // 1. Scene Setup
    scene = new THREE.Scene();

    // 2. Camera Setup
    const width = container.clientWidth;
    const height = container.clientHeight;
    camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 7;

    // 3. Renderer Setup
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // 4. Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const purplePointLight = new THREE.PointLight(0xa855f7, 2, 20);
    purplePointLight.position.set(3, 4, 3);
    scene.add(purplePointLight);

    const orangePointLight = new THREE.PointLight(0xff5722, 1.8, 20);
    orangePointLight.position.set(-3, -3, 2);
    scene.add(orangePointLight);

    // 5. 3D Packaging Box Mesh
    const boxGeometry = new THREE.BoxGeometry(2.2, 2.2, 2.2);
    const boxMaterial = new THREE.MeshPhongMaterial({
      color: 0x1e0f38,
      shininess: 90,
      transparent: true,
      opacity: 0.85
    });
    boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);

    // Wireframe Outer Frame
    const wireframeGeo = new THREE.WireframeGeometry(boxGeometry);
    const wireframeMat = new THREE.LineBasicMaterial({ color: 0xa855f7, linewidth: 2 });
    wireframeMesh = new THREE.LineSegments(wireframeGeo, wireframeMat);
    boxMesh.add(wireframeMesh);

    scene.add(boxMesh);

    // 6. Floating CMYK Spheres Group
    sphereGroup = new THREE.Group();
    const sphereColors = [0x00aeef, 0xec008c, 0xfff200, 0xa855f7, 0xff5722];
    
    sphereColors.forEach((color, i) => {
      const radius = 0.25 + Math.random() * 0.2;
      const sphereGeo = new THREE.SphereGeometry(radius, 32, 32);
      const sphereMat = new THREE.MeshStandardMaterial({
        color: color,
        roughness: 0.2,
        metalness: 0.6,
        emissive: color,
        emissiveIntensity: 0.2
      });
      const sphere = new THREE.Mesh(sphereGeo, sphereMat);

      const angle = (i / sphereColors.length) * Math.PI * 2;
      const distance = 2.4 + Math.random() * 0.8;
      sphere.position.x = Math.cos(angle) * distance;
      sphere.position.y = Math.sin(angle) * distance;
      sphere.position.z = (Math.random() - 0.5) * 2;

      sphere.userData = { angle, distance, speed: 0.008 + Math.random() * 0.006 };
      sphereGroup.add(sphere);
    });

    scene.add(sphereGroup);

    // 7. Glowing Particle Starfield Background
    const particlesCount = 200;
    const particlesGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 15;
      positions[i + 1] = (Math.random() - 0.5) * 15;
      positions[i + 2] = (Math.random() - 0.5) * 15;
    }

    particlesGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const particlesMat = new THREE.PointsMaterial({
      color: 0xc084fc,
      size: 0.05,
      transparent: true,
      opacity: 0.7
    });
    particleSystem = new THREE.Points(particlesGeo, particlesMat);
    scene.add(particleSystem);

    // 8. Mouse Move Tilt Event Listener
    container.addEventListener("mousemove", (e) => {
      const rect = container.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    });

    container.addEventListener("mouseleave", () => {
      mouseX = 0;
      mouseY = 0;
    });

    // 9. Theme Update Listener
    window.addEventListener("themeChanged", (e) => {
      const isDark = e.detail.theme === "dark";
      if (boxMesh) {
        boxMesh.material.color.setHex(isDark ? 0x160d28 : 0xfffbf5);
        wireframeMesh.material.color.setHex(isDark ? 0xc084fc : 0xff5722);
      }
    });

    // 10. Resize Listener
    window.addEventListener("resize", onWindowResize);

    // Start Animation Loop
    animate();
  }

  function onWindowResize() {
    const container = document.getElementById("hero3dStage");
    if (!container || !renderer || !camera) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }

  function animate() {
    requestAnimationFrame(animate);

    // Smooth Interpolation for Mouse Parallax
    targetX += (mouseX - targetX) * 0.05;
    targetY += (mouseY - targetY) * 0.05;

    // Rotate Central Packaging Box
    if (boxMesh) {
      boxMesh.rotation.x += 0.005;
      boxMesh.rotation.y += 0.008;

      boxMesh.rotation.x += targetY * 0.01;
      boxMesh.rotation.y += targetX * 0.01;
    }

    // Orbit CMYK Spheres
    if (sphereGroup) {
      sphereGroup.children.forEach((sphere) => {
        sphere.userData.angle += sphere.userData.speed;
        sphere.position.x = Math.cos(sphere.userData.angle) * sphere.userData.distance;
        sphere.position.y = Math.sin(sphere.userData.angle) * sphere.userData.distance;
      });
    }

    // Rotate Particles
    if (particleSystem) {
      particleSystem.rotation.y += 0.001;
    }

    renderer.render(scene, camera);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => setTimeout(init3DHero, 200));
  } else {
    setTimeout(init3DHero, 200);
  }
})();
