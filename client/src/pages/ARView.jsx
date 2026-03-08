import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { artworkAPI } from '../services/api';
import { FiArrowLeft, FiMaximize2, FiMinimize2, FiRotateCw, FiCamera, FiInfo } from 'react-icons/fi';
import './ARView.css';

const ARView = () => {
    const { id } = useParams();
    const [artwork, setArtwork] = useState(null);
    const [loading, setLoading] = useState(true);
    const [cameraActive, setCameraActive] = useState(false);
    const [cameraError, setCameraError] = useState('');
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 50, y: 50 });
    const [showInfo, setShowInfo] = useState(false);
    const [dragging, setDragging] = useState(false);
    const videoRef = useRef(null);
    const streamRef = useRef(null);
    const containerRef = useRef(null);
    const dragStartRef = useRef({ x: 0, y: 0 });

    useEffect(() => {
        loadArtwork();
        return () => stopCamera();
    }, [id]);

    const loadArtwork = async () => {
        try {
            const { data } = await artworkAPI.getById(id);
            setArtwork(data);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    const startCamera = async () => {
        try {
            setCameraError('');
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: { ideal: 'environment' },
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                },
                audio: false,
            });
            streamRef.current = stream;
            setCameraActive(true);
        } catch (err) {
            console.error('Camera error:', err);
            if (err.name === 'NotAllowedError') {
                setCameraError('Camera permission denied. Please allow camera access and try again.');
            } else if (err.name === 'NotFoundError') {
                setCameraError('No camera found on this device.');
            } else {
                setCameraError(`Unable to access camera: ${err.message}. Make sure you're using HTTPS.`);
            }
        }
    };

    // Attach stream to video element once it's rendered
    useEffect(() => {
        if (cameraActive && videoRef.current && streamRef.current) {
            videoRef.current.srcObject = streamRef.current;
            videoRef.current.play().catch(err => {
                console.error('Video play error:', err);
            });
        }
    }, [cameraActive]);

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
        setCameraActive(false);
    };

    // Touch/mouse drag to move artwork
    const handlePointerDown = (e) => {
        setDragging(true);
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        dragStartRef.current = {
            x: clientX - (position.x / 100) * window.innerWidth,
            y: clientY - (position.y / 100) * window.innerHeight,
        };
    };

    const handlePointerMove = (e) => {
        if (!dragging) return;
        e.preventDefault();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        const newX = ((clientX - dragStartRef.current.x) / window.innerWidth) * 100;
        const newY = ((clientY - dragStartRef.current.y) / window.innerHeight) * 100;
        setPosition({
            x: Math.max(10, Math.min(90, newX)),
            y: Math.max(10, Math.min(90, newY)),
        });
    };

    const handlePointerUp = () => {
        setDragging(false);
    };

    // Pinch to zoom
    const lastPinchRef = useRef(0);
    const handleTouchMove = (e) => {
        if (e.touches.length === 2) {
            e.preventDefault();
            const dist = Math.hypot(
                e.touches[0].clientX - e.touches[1].clientX,
                e.touches[0].clientY - e.touches[1].clientY
            );
            if (lastPinchRef.current > 0) {
                const delta = (dist - lastPinchRef.current) * 0.005;
                setScale(s => Math.max(0.2, Math.min(3, s + delta)));
            }
            lastPinchRef.current = dist;
        } else if (e.touches.length === 1) {
            handlePointerMove(e);
        }
    };

    const handleTouchEnd = () => {
        lastPinchRef.current = 0;
        setDragging(false);
    };

    if (loading) return <div className="loading-page"><div className="spinner"></div></div>;
    if (!artwork) return <div className="page container"><p>Artwork not found.</p></div>;

    return (
        <div
            className="ar-page"
            ref={containerRef}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseMove={handlePointerMove}
            onMouseUp={handlePointerUp}
        >
            {/* Top overlay */}
            <div className="ar-overlay-top">
                <Link to={`/artwork/${id}`} className="btn btn-ghost btn-sm">
                    <FiArrowLeft /> Back
                </Link>
                <h2 className="ar-title">{artwork.title}</h2>
                <button className="btn btn-ghost btn-sm" onClick={() => setShowInfo(!showInfo)}>
                    <FiInfo />
                </button>
            </div>

            {/* Camera feed or start screen */}
            <div className="ar-content">
                {cameraActive ? (
                    <>
                        {/* Live camera background */}
                        <video
                            ref={videoRef}
                            className="ar-camera-feed"
                            autoPlay
                            playsInline
                            muted
                        />

                        {/* Artwork overlay — draggable & scalable */}
                        <div
                            className="ar-artwork-floating"
                            style={{
                                left: `${position.x}%`,
                                top: `${position.y}%`,
                                transform: `translate(-50%, -50%) scale(${scale})`,
                            }}
                            onTouchStart={handlePointerDown}
                            onMouseDown={handlePointerDown}
                        >
                            <img src={artwork.imageUrl} alt={artwork.title} draggable={false} />
                            <div className="ar-artwork-shadow"></div>
                        </div>

                        {/* Crosshair */}
                        <div className="ar-crosshair">
                            <div className="crosshair-h"></div>
                            <div className="crosshair-v"></div>
                        </div>
                    </>
                ) : (
                    <div className="ar-start-screen">
                        <div className="ar-preview-frame">
                            <img src={artwork.imageUrl} alt={artwork.title} />
                        </div>
                        <h3>AR Viewer</h3>
                        <p>Place <strong>{artwork.title}</strong> in your real environment</p>
                        {cameraError && (
                            <div className="ar-error">{cameraError}</div>
                        )}
                        <button className="btn btn-gold btn-lg" onClick={startCamera} id="ar-start-camera">
                            <FiCamera /> Start Camera & Place Artwork
                        </button>
                        <p className="ar-hint">
                            Drag to move artwork · Pinch to resize · Works best on mobile
                        </p>
                    </div>
                )}
            </div>

            {/* Controls bar */}
            {cameraActive && (
                <div className="ar-controls">
                    <button className="ar-control-btn" onClick={() => setScale(s => Math.max(0.2, s - 0.15))}>
                        <FiMinimize2 /> Smaller
                    </button>
                    <button className="ar-control-btn" onClick={() => setScale(1)}>
                        <FiRotateCw /> Reset
                    </button>
                    <button className="ar-control-btn" onClick={() => setScale(s => Math.min(3, s + 0.15))}>
                        <FiMaximize2 /> Larger
                    </button>
                    <button className="ar-control-btn ar-stop" onClick={stopCamera}>
                        Stop Camera
                    </button>
                </div>
            )}

            {/* Info overlay */}
            {showInfo && (
                <div className="ar-info-overlay" onClick={() => setShowInfo(false)}>
                    <div className="ar-info-card glass-card" onClick={(e) => e.stopPropagation()}>
                        <h3>{artwork.title}</h3>
                        <p className="ar-info-artist">{artwork.artist?.name}</p>
                        <p className="ar-info-medium">{artwork.medium} · {artwork.year}</p>
                        <p className="ar-info-desc">{artwork.description}</p>
                    </div>
                </div>
            )}

            {/* Bottom info bar */}
            <div className="ar-info-bar">
                <div className="ar-info-detail">
                    <span className="ar-info-label">Title</span>
                    <span>{artwork.title}</span>
                </div>
                <div className="ar-info-detail">
                    <span className="ar-info-label">Artist</span>
                    <span>{artwork.artist?.name}</span>
                </div>
                <div className="ar-info-detail">
                    <span className="ar-info-label">Scale</span>
                    <span>{Math.round(scale * 100)}%</span>
                </div>
            </div>
        </div>
    );
};

export default ARView;
