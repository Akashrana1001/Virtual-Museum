import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { artworkAPI } from '../services/api';
import ArtworkCard from '../components/ArtworkCard';
import { FiFilter, FiGrid, FiList } from 'react-icons/fi';
import './GalleryBrowse.css';

const categories = ['all', 'painting', 'sculpture', 'photography', 'digital', 'mixed-media', 'installation'];

const GalleryBrowse = () => {
    const [searchParams] = useSearchParams();
    const [artworks, setArtworks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [category, setCategory] = useState('all');
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({});
    const [viewMode, setViewMode] = useState('grid');

    const search = searchParams.get('search') || '';

    useEffect(() => {
        loadArtworks();
    }, [category, page, search]);

    const loadArtworks = async () => {
        setLoading(true);
        try {
            const params = { page, limit: 12 };
            if (category !== 'all') params.category = category;
            if (search) params.search = search;
            const { data } = await artworkAPI.getAll(params);
            setArtworks(data.artworks);
            setPagination(data.pagination);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    return (
        <div className="page gallery-browse container">
            <div className="page-header">
                <h1>{search ? `Results for "${search}"` : 'Art Collection'}</h1>
                <p>Discover masterpieces from talented artists around the world</p>
            </div>

            <div className="gallery-toolbar">
                <div className="category-filters">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            className={`filter-btn ${category === cat ? 'active' : ''}`}
                            onClick={() => { setCategory(cat); setPage(1); }}
                            id={`filter-${cat}`}
                        >
                            {cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </button>
                    ))}
                </div>
                <div className="view-toggle">
                    <button
                        className={`toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                        onClick={() => setViewMode('grid')}
                    >
                        <FiGrid />
                    </button>
                    <button
                        className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                        onClick={() => setViewMode('list')}
                    >
                        <FiList />
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="loading-page"><div className="spinner"></div></div>
            ) : artworks.length === 0 ? (
                <div className="empty-state">
                    <p>No artworks found{search ? ` for "${search}"` : ''}. Try adjusting your filters.</p>
                </div>
            ) : (
                <>
                    <div className={`gallery-grid ${viewMode === 'list' ? 'list-view' : 'grid grid-4'}`}>
                        {artworks.map((art, i) => (
                            <ArtworkCard key={art._id} artwork={art} index={i} />
                        ))}
                    </div>

                    {pagination.pages > 1 && (
                        <div className="pagination">
                            <button
                                className="btn btn-ghost btn-sm"
                                disabled={page <= 1}
                                onClick={() => setPage(p => p - 1)}
                            >
                                Previous
                            </button>
                            <span className="page-info">Page {page} of {pagination.pages}</span>
                            <button
                                className="btn btn-ghost btn-sm"
                                disabled={page >= pagination.pages}
                                onClick={() => setPage(p => p + 1)}
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default GalleryBrowse;
