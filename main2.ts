import './style.css'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { AmbientLight, Matrix4, Mesh, MeshStandardMaterial, PerspectiveCamera, PointLight, PointLightHelper, Scene, Sphere, SphereGeometry, Vector3, WebGL1Renderer } from 'three';

/**
 * Euler321 Sequence implementation in radians
 * @param {Vector3} pos target of rotation {x, y, z}
 * @param {Vector3} angle euler angles of rotation {rho, theta, phi}
 * @param {Vector3} origin origin of rotation {x, y, z}
 * 
 * @returns {Vector3} new position after rotation
 */
function euler321Sequence(pos: Vector3, angle: Vector3, origin: Vector3 = new Vector3()): Vector3 {
    let r = new Vector3().copy(pos).sub(origin);
    let m3 = new Matrix4().makeRotationZ(angle.z)
    let m2 = new Matrix4().makeRotationY(angle.y)
    let m1 = new Matrix4().makeRotationX(angle.x);
    return new Vector3().copy(origin).add(r.applyMatrix4(m3).applyMatrix4(m2).applyMatrix4(m1));
}
/**
 * A transformed Euler313 Sequence implementation
 * @param {Vector3} pos target of rotation {x, y, z}
 * @param {Vector3} angle euler angles of rotation {rho, theta, phi}
 * @param {Vector3} origin origin of rotation {x, y, z}
 * 
 * @returns {Vector3} new position after rotation
 */
 function euler313Sequence(pos: Vector3, angle: Vector3, origin: Vector3 = new Vector3()): Vector3 {
    let r = new Vector3().copy(pos).sub(origin);
    let m3 = new Matrix4().makeRotationY(angle.z)
    let m2 = new Matrix4().makeRotationX(angle.y)
    let m1 = new Matrix4().makeRotationY(angle.x);
    return new Vector3().copy(origin).add(r.applyMatrix4(m3).applyMatrix4(m2).applyMatrix4(m1));
}

const scene = new Scene();
const camera = new PerspectiveCamera(75 , window.innerWidth/ window.innerHeight,0.1,1000 );
const renderer = new WebGL1Renderer({
    canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth,window.innerHeight);
camera.position.set(130,30,130);
renderer.render(scene,camera);

const pointLight = new PointLight(0xffffff);
pointLight.position.set(0,0,0);

const ambientLight = new AmbientLight(0xffffff);
const lightHelper = new PointLightHelper(pointLight);
scene.add(lightHelper);
const controls = new OrbitControls(camera,renderer.domElement);

class Ring
{
    radius: number;
    riseAngle: number;
    inclination: number;
    center: Vector3
    stars: Array<Mesh<SphereGeometry, MeshStandardMaterial>>
    /**
     * Constructs an orbital ring with given parameters.
     * @param radius The radius of the ring
     * @param size The amount of stars on the ring, equally spaced
     * @param riseAngle The rise angle of the ring (radian)
     * @param inclination The inclination angle of the ring (radian)
     * @param center The orbital center of the ring [Optional, assumes (0, 0, 0) if not given]
     * @param color The color of the ring [Optional, assumes 0xffffff if not given]
     */
    constructor(radius: number, size: number, riseAngle: number, inclination: number, color: number = 0xffffff, selective: number = 1, center: Vector3 = new Vector3())
    {
        this.radius = radius
        this.riseAngle = riseAngle
        this.inclination = inclination
        this.center = center
        this.stars = Array(size).fill(0).map((a,s)=>{
            return this.buildStar(s, size, radius, riseAngle, inclination, center, s%selective==0? color:0xffffff);  
        });
    };
    private buildStar(index: number, size: number, radius: number, riseAngle: number, inclination: number, center: Vector3, color: number)
    {
        let geometry = new SphereGeometry(0.75, 24, 24);
        let material = new MeshStandardMaterial({color:color})
        let star = new Mesh(geometry, material)
        let p = euler313Sequence(new Vector3(radius), new Vector3(riseAngle, inclination, 2*Math.PI/size*index)).add(center)
        //console.log(p)
        star.position.set(p.x,p.y,p.z);
        star.material.needsUpdate = true;
        scene.add(star);
        return star;
    }
    animate()
    {
        this.stars.forEach((star: Mesh, s)=>{
            let n = euler321Sequence(star.position, euler313Sequence(new Vector3(0,Math.PI/900, 0), new Vector3(this.riseAngle, this.inclination)), this.center)
            star.position.set(n.x,n.y,n.z);
        });
    }
}

function addStar(color: any ,axis: Vector3, base: Vector3, index: number){
    const geometry = new SphereGeometry(0.75,24,24)
    let material = new MeshStandardMaterial({color:0xffffff})
    if(index<40)
        material = new MeshStandardMaterial({color:color}) 
    const star = new Mesh(geometry,material);
    let a = axis.multiplyScalar(2*Math.PI/120*index).add(base)
    let p = euler321Sequence(new Vector3(100, 0, 0), a)
    star.position.set(p.x,p.y,p.z);
    star.material.needsUpdate = true;
    scene.add(star);
    return star;
}
let ring1 = new Ring(100, 120, 0, 0, 0xff0000, 10)
let ring2 = new Ring(100, 120, Math.PI/3, Math.PI/3, 0x00ff00, 10)
let ring3 = new Ring(100, 120, 2*Math.PI/3, Math.PI/3, 0x0000ff, 10)
let ring4 = new Ring(100, 80, 0, Math.PI/2, 0x0ff00f, 5, new Vector3(100,0,0))

scene.add(pointLight,ambientLight);

function animate()
{
    requestAnimationFrame(animate);
    ring1.animate();
    ring2.animate();
    ring3.animate();
    ring4.animate();

    controls.update();
    renderer.render(scene,camera);
}
animate();