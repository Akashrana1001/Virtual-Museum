import { useState, useEffect, useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Link } from 'react-router-dom';
import * as THREE from 'three';
import { artworkAPI } from '../services/api';
import { FiArrowLeft, FiMove, FiMaximize2 } from 'react-icons/fi';
import './Gallery3D.css';

/* ===== Art Frame Component ===== */
function ArtFrame({ artwork, position, rotation = [0, 0, 0], onClick }) {
    const meshRef = useRef();
    const [hovered, setHovered] = useState(false);
    const [texture, setTexture] = useState(null);

    useEffect(() => {
        if (!artwork.imageUrl) return;
        const loader = new THREE.TextureLoader();
        loader.crossOrigin = 'anonymous';
        loader.load(
            artwork.imageUrl,
            (tex) => {
                tex.colorSpace = THREE.SRGBColorSpace;
                tex.needsUpdate = true;
                setTexture(tex);
            },
            undefined,
            (err) => console.warn('Texture load failed:', artwork.title, err)
        );
    }, [artwork.imageUrl]);

    useFrame(() => {
        if (meshRef.current) {
            const s = hovered ? 1.05 : 1;
            meshRef.current.scale.lerp(new THREE.Vector3(s, s, s), 0.1);
        }
    });

    const fw = 2.0;
    const fh = 1.5;

    return (
        <group position={position} rotation={rotation}>
            {/* Gold/dark frame border */}
            <mesh
                ref={meshRef}
                onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
                onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto'; }}
                onClick={(e) => { e.stopPropagation(); onClick(); }}
            >
                <boxGeometry args={[fw + 0.12, fh + 0.12, 0.06]} />
                <meshStandardMaterial
                    color={hovered ? '#d4a530' : '#333333'}
                    metalness={0.5}
                    roughness={0.3}
                />
            </mesh>

            {/* Artwork image */}
            {texture ? (
                <mesh position={[0, 0, 0.04]}>
                    <planeGeometry args={[fw, fh]} />
                    <meshBasicMaterial map={texture} />
                </mesh>
            ) : (
                <mesh position={[0, 0, 0.04]}>
                    <planeGeometry args={[fw, fh]} />
                    <meshStandardMaterial color="#1a1a2e" />
                </mesh>
            )}

            {/* Spotlight on artwork */}
            <pointLight
                position={[0, 1.5, 1]}
                intensity={hovered ? 2 : 0.8}
                color={hovered ? '#f0c040' : '#ffffff'}
                distance={5}
            />
        </group>
    );
}

/* ===== Room Component ===== */
function GalleryRoom({ roomNumber, artworks, onArtClick }) {
    const offsetZ = (roomNumber - 1) * 14;

    // Build wall positions from seed data
    const frames = [];
    artworks.forEach((a) => {
        const pos3D = a.position3D;
        if (!pos3D || !pos3D.wall) return;

        let position, rotation;
        switch (pos3D.wall) {
            case 'north':
                position = [pos3D.x, pos3D.y, -4.95 + offsetZ];
                rotation = [0, 0, 0];
                break;
            case 'south':
                position = [pos3D.x, pos3D.y, 4.95 + offsetZ];
                rotation = [0, Math.PI, 0];
                break;
            case 'east':
                position = [4.95, pos3D.y, (pos3D.z || 0) + offsetZ];
                rotation = [0, -Math.PI / 2, 0];
                break;
            case 'west':
                position = [-4.95, pos3D.y, (pos3D.z || 0) + offsetZ];
                rotation = [0, Math.PI / 2, 0];
                break;
            default:
                return;
        }
        frames.push({ artwork: a, position, rotation });
    });

    return (
        <group>
            {/* Floor — polished dark */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, offsetZ]} receiveShadow>
                <planeGeometry args={[10, 10]} />
                <meshStandardMaterial color="#1a1a2e" metalness={0.2} roughness={0.6} />
            </mesh>

            {/* Ceiling */}
            <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 3.5, offsetZ]}>
                <planeGeometry args={[10, 10]} />
                <meshStandardMaterial color="#0d0d1a" />
            </mesh>

            {/* North wall */}
            <mesh position={[0, 1.75, -5 + offsetZ]}>
                <planeGeometry args={[10, 3.5]} />
                <meshStandardMaterial color="#16213e" />
            </mesh>
            {/* South wall */}
            <mesh position={[0, 1.75, 5 + offsetZ]} rotation={[0, Math.PI, 0]}>
                <planeGeometry args={[10, 3.5]} />
                <meshStandardMaterial color="#16213e" />
            </mesh>
            {/* East wall */}
            <mesh position={[5, 1.75, offsetZ]} rotation={[0, -Math.PI / 2, 0]}>
                <planeGeometry args={[10, 3.5]} />
                <meshStandardMaterial color="#1a1a3e" />
            </mesh>
            {/* West wall */}
            <mesh position={[-5, 1.75, offsetZ]} rotation={[0, Math.PI / 2, 0]}>
                <planeGeometry args={[10, 3.5]} />
                <meshStandardMaterial color="#1a1a3e" />
            </mesh>

            {/* Room lights */}
            <pointLight position={[0, 3.2, offsetZ]} intensity={0.8} color="#e8d5b7" distance={12} />
            <pointLight position={[-3, 2.5, -3 + offsetZ]} intensity={0.4} color="#ffffff" distance={8} />
            <pointLight position={[3, 2.5, 3 + offsetZ]} intensity={0.4} color="#ffffff" distance={8} />

            {/* Artwork frames */}
            {frames.map(({ artwork, position, rotation }) => (
                <ArtFrame
                    key={artwork._id}
                    artwork={artwork}
                    position={position}
                    rotation={rotation}
                    onClick={() => onArtClick(artwork)}
                />
            ))}
        </group>
    );
}

/* ===== Main Gallery3D Page ===== */
const Gallery3D = () => {
    const [rooms, setRooms] = useState({});
    const [selectedArt, setSelectedArt] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadAllRooms();
    }, []);

    const loadAllRooms = async () => {
        try {
            const roomData = {};
            for (let i = 1; i <= 3; i++) {
                const { data } = await artworkAPI.getByRoom(i);
                roomData[i] = data;
            }
            setRooms(roomData);
        } catch (err) {
            console.error('Failed to load rooms:', err);
            setError('Failed to load gallery data');
        }
        setLoading(false);
    };

    const totalArtworks = Object.values(rooms).reduce((sum, arr) => sum + arr.length, 0);

    return (
        <div className="gallery3d-page">
            <div className="gallery3d-overlay">
                <Link to="/" className="btn btn-ghost btn-sm gallery3d-back">
                    <FiArrowLeft /> Exit Gallery
                </Link>
                <div className="gallery3d-controls">
                    <span><FiMove size={14} /> Drag to look</span>
                    <span><FiMaximize2 size={14} /> Scroll to zoom</span>
                    <span>{totalArtworks} artworks loaded</span>
                </div>
            </div>

            {loading ? (
                <div className="loading-page" style={{ height: '100vh', background: '#060a13' }}>
                    <div className="spinner"></div>
                    <p style={{ color: '#94a3b8', marginTop: '1rem' }}>Loading gallery...</p>
                </div>
            ) : error ? (
                <div className="loading-page" style={{ height: '100vh', background: '#060a13' }}>
                    <p style={{ color: '#f43f5e' }}>{error}</p>
                    <Link to="/" className="btn btn-outline" style={{ marginTop: '1rem' }}>Go Home</Link>
                </div>
            ) : (
                <Canvas
                    className="gallery3d-canvas"
                    id="gallery3d-canvas"
                    dpr={[1, 1.5]}
                    gl={{
                        antialias: true,
                        alpha: false,
                        powerPreference: 'default',
                        failIfMajorPerformanceCaveat: false,
                    }}
                    onCreated={({ gl }) => {
                        gl.setClearColor('#060a13');
                    }}
                >
                    <PerspectiveCamera makeDefault position={[0, 1.6, 7]} fov={65} />
                    <OrbitControls
                        target={[0, 1.5, 0]}
                        minPolarAngle={Math.PI * 0.1}
                        maxPolarAngle={Math.PI * 0.85}
                        minDistance={1}
                        maxDistance={20}
                        enableDamping
                        dampingFactor={0.08}
                        enablePan={true}
                    />

                    {/* Global lighting — bright enough to see */}
                    <ambientLight intensity={0.5} />
                    <directionalLight position={[5, 8, 5]} intensity={0.6} color="#ffeedd" />
                    <directionalLight position={[-3, 6, -3]} intensity={0.3} color="#ffffff" />

                    <fog attach="fog" args={['#060a13', 12, 40]} />

                    {/* Render all rooms — NO Suspense wrapping */}
                    {Object.entries(rooms).map(([num, artworks]) => (
                        <GalleryRoom
                            key={num}
                            roomNumber={parseInt(num)}
                            artworks={artworks}
                            onArtClick={setSelectedArt}
                        />
                    ))}
                </Canvas>
            )}

            {/* Artwork Detail Modal */}
            {selectedArt && (
                <div className="modal-overlay" onClick={() => setSelectedArt(null)}>
                    <div className="gallery3d-modal" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close" onClick={() => setSelectedArt(null)}>×</button>
                        <img src={selectedArt.imageUrl} alt={selectedArt.title} className="modal-art-image" />
                        <div className="modal-art-info">
                            <span className="badge badge-gold">{selectedArt.category}</span>
                            <h2>{selectedArt.title}</h2>
                            <p className="modal-artist">{selectedArt.artist?.name}</p>
                            <p className="modal-desc">{selectedArt.description}</p>
                            <div className="modal-meta">
                                <span>{selectedArt.medium}</span>
                                <span>{selectedArt.year}</span>
                            </div>
                            <div className="modal-actions">
                                <Link to={`/artwork/${selectedArt._id}`} className="btn btn-primary btn-sm">View Full Details</Link>
                                <Link to={`/ar/${selectedArt._id}`} className="btn btn-gold btn-sm">View in AR</Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Gallery3D;
