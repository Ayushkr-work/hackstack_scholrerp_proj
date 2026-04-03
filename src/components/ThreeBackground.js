import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ThreeBackground() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const w = mount.clientWidth || window.innerWidth;
    const h = mount.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
    camera.position.z = 30;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    const count = 1500;
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i*3]=(Math.random()-.5)*100; pos[i*3+1]=(Math.random()-.5)*100; pos[i*3+2]=(Math.random()-.5)*100;
      if (Math.random()<.5){col[i*3]=0;col[i*3+1]=.94;col[i*3+2]=1;}
      else{col[i*3]=.66;col[i*3+1]=.33;col[i*3+2]=.97;}
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
    const pts = new THREE.Points(geo, new THREE.PointsMaterial({ size:.15, vertexColors:true, transparent:true, opacity:.8 }));
    scene.add(pts);

    const t1 = new THREE.Mesh(new THREE.TorusGeometry(8,.5,16,100), new THREE.MeshBasicMaterial({color:0x00f0ff,wireframe:true,transparent:true,opacity:.12}));
    const t2 = new THREE.Mesh(new THREE.TorusGeometry(13,.3,16,100), new THREE.MeshBasicMaterial({color:0xa855f7,wireframe:true,transparent:true,opacity:.08}));
    t2.rotation.x = Math.PI/3;
    scene.add(t1, t2);

    let mx=0, my=0;
    const onMouse = e => { mx=(e.clientX/w-.5)*2; my=-(e.clientY/h-.5)*2; };
    window.addEventListener('mousemove', onMouse);

    let raf;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      pts.rotation.y+=.0003; pts.rotation.x+=.0001;
      t1.rotation.x+=.003; t1.rotation.y+=.002;
      t2.rotation.z+=.002; t2.rotation.y+=.001;
      camera.position.x+=(mx*3-camera.position.x)*.02;
      camera.position.y+=(my*3-camera.position.y)*.02;
      camera.lookAt(scene.position);
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      const nw=mount.clientWidth, nh=mount.clientHeight;
      camera.aspect=nw/nh; camera.updateProjectionMatrix(); renderer.setSize(nw,nh);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMouse);
      window.removeEventListener('resize', onResize);
      try { mount.removeChild(renderer.domElement); } catch {}
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0 w-full h-full" />;
}
