import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// --- Basic Scene Setup ---
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// --- Lighting ---
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
directionalLight.position.set(50, 50, 50);
scene.add(directionalLight);

// --- Camera Controls ---
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(40, 0, 0);
camera.position.set(40, 0, 100);


// --- Global variables for interaction ---
const tooltip = document.getElementById('tooltip');
const userSelector = document.getElementById('user-selector');
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let intersectedObject = null;
const linesGroup = new THREE.Group();
scene.add(linesGroup);

// To store our created objects for easy lookup
const showObjects = [];
const userObjects = [];
const ratingsMap = new Map();

// --- Materials for Highlighting ---
const originalShowMaterial = new THREE.MeshStandardMaterial({ color: 0x00aaff, roughness: 0.5 });
const originalUserMaterial = new THREE.MeshStandardMaterial({ color: 0xff4400, roughness: 0.5 });
const recommendedShowMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00, emissive: 0x33ff33, roughness: 0.5 }); // Bright Green
const selectedUserMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xeeeeee, roughness: 0.5 }); // Bright White

// --- Line Materials for Watched vs. Recommended ---
const watchedLineMaterial = new THREE.LineBasicMaterial({ color: 0xffff00, transparent: true, opacity: 0.6 }); // Yellow for watched
const recommendedLineMaterial = new THREE.LineBasicMaterial({ color: 0xff00ff, transparent: true, opacity: 0.9, linewidth: 2 }); // Magenta for recommended


// --- Placeholder for Top 5 Recommendations ---
const userRecommendations = {
    "user_499": [
        { "name": "FOX 28 News at 10pm", "index": 99 },
        { "name": "Family Guy", "index": 82 },
        { "name": "2009 NCAA Basketball Tournament", "index": 46 },
        { "name": "NBC 4 at Eleven", "index": 65 },
        { "name": "Two and a Half Men", "index": 9 }
    ]
};


// --- Load Data and Create Scene ---
async function setupScene() {
    try {
        const response = await fetch('visualization_data.json');
        const data = await response.json();

        // 1. Create Show Points
        const showGeometry = new THREE.SphereGeometry(0.3, 16, 16);
        data.shows.forEach((show, index) => {
            const sphere = new THREE.Mesh(showGeometry, originalShowMaterial.clone());
            sphere.position.set(show.x, show.y, show.z);
            sphere.userData = { name: show.name, type: 'show', index: index };
            scene.add(sphere);
            showObjects.push(sphere);
        });

        // 2. Create User Points and Populate Dropdown
        const userGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
        data.users.forEach(user => {
            const cube = new THREE.Mesh(userGeometry, originalUserMaterial.clone());
            cube.position.set(user.x, user.y, user.z);
            cube.userData = { name: user.name, type: 'user', id: user.id };
            scene.add(cube);
            userObjects.push(cube);

            const option = document.createElement('option');
            option.value = user.id;
            option.textContent = user.name;
            userSelector.appendChild(option);
        });
        
        // 3. Store ratings data in a Map
        for (const [userId, showIndices] of Object.entries(data.ratings)) {
            ratingsMap.set(userId, showIndices);
        }

        console.log(`Successfully loaded ${data.shows.length} shows and ${data.users.length} users.`);

    } catch (error) {
        console.error("Failed to load or process visualization data:", error);
    }
}

// --- Interaction Functions ---

// Draws lines for shows a user has already watched.
function drawWatchedConnections(userObject) {
    const userId = userObject.userData.id;
    const watchedShowIndices = ratingsMap.get(userId);
    if (!watchedShowIndices) return;

    const startPoint = userObject.position;

    watchedShowIndices.forEach(showIndex => {
        if (showObjects[showIndex]) {
            const endPoint = showObjects[showIndex].position;
            const points = [startPoint, endPoint];
            const geometry = new THREE.BufferGeometry().setFromPoints(points);
            const line = new THREE.Line(geometry, watchedLineMaterial);
            linesGroup.add(line);
        }
    });
}

// Draws lines for recommended shows.
function drawRecommendationConnections(userObject) {
    const userId = userObject.userData.id;
    const recommendations = userRecommendations[userId];
    if (!recommendations) return;

    const startPoint = userObject.position;

    recommendations.forEach(rec => {
        const showIndex = rec.index;
        if (showObjects[showIndex]) {
            const endPoint = showObjects[showIndex].position;
            const points = [startPoint, endPoint];
            const geometry = new THREE.BufferGeometry().setFromPoints(points);
            const line = new THREE.Line(geometry, recommendedLineMaterial);
            linesGroup.add(line);
        }
    });
}

// Resets all visual changes (colors and lines).
function resetHighlights() {
    // Clear all lines from the group
    while (linesGroup.children.length > 0) {
        linesGroup.remove(linesGroup.children[0]);
    }
    // Reset all show and user objects to their original materials
    showObjects.forEach(obj => obj.material = originalShowMaterial);
    userObjects.forEach(obj => obj.material = originalUserMaterial);
}

// Master function to handle user selection and update the visualization.
function handleUserSelection() {
    // 1. Start with a clean slate
    resetHighlights();
    const selectedUserId = userSelector.value;
    if (!selectedUserId) return; // Do nothing if the placeholder is selected

    const userObject = userObjects.find(obj => obj.userData.id === selectedUserId);
    if (!userObject) return;

    // 2. Highlight the selected user
    userObject.material = selectedUserMaterial;

    // 3. Draw lines for watched shows (Yellow Arrows)
    drawWatchedConnections(userObject);
    
    // 4. Highlight recommended shows and draw lines to them (Magenta Arrows)
    const recommendations = userRecommendations[selectedUserId];
    if (recommendations) {
        drawRecommendationConnections(userObject); // Draw the magenta lines
        recommendations.forEach(rec => {
            if (showObjects[rec.index]) {
                showObjects[rec.index].material = recommendedShowMaterial; // Highlight the sphere green
            }
        });
    }
}


// --- Animation Loop ---
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

// --- Event Listeners ---
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

window.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
    tooltip.style.left = `${event.clientX + 10}px`;
    tooltip.style.top = `${event.clientY + 10}px`;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children);

    if (intersects.length > 0 && intersects[0].object.userData.name) {
        if (intersectedObject !== intersects[0].object) {
            intersectedObject = intersects[0].object;
            tooltip.style.display = 'block';
            tooltip.textContent = intersectedObject.userData.name;
        }
    } else {
        intersectedObject = null;
        tooltip.style.display = 'none';
    }
});

// Event for clicking on a user cube to select them in the dropdown
window.addEventListener('click', () => {
    if (intersectedObject && intersectedObject.userData.type === 'user') {
        userSelector.value = intersectedObject.userData.id;
        handleUserSelection();
    }
});

// Event Listener for the User Selector Dropdown
userSelector.addEventListener('change', handleUserSelection);

// --- Start Everything ---
setupScene();
animate();