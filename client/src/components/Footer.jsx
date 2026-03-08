import { Link } from 'react-router-dom';
import { FiGithub, FiTwitter, FiInstagram, FiMail } from 'react-icons/fi';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer" id="footer">
            <div className="container">
                <div className="footer-grid">
                    <div className="footer-brand">
                        <div className="footer-logo">
                            <span className="logo-icon">◆</span>
                            <span>Virtual<span className="logo-accent">Museum</span></span>
                        </div>
                        <p className="footer-desc">
                            Explore art in an immersive 3D gallery. Experience masterpieces in
                            Augmented Reality. Connect with artists worldwide.
                        </p>
                        <div className="footer-social">
                            <a href="#" aria-label="Twitter"><FiTwitter /></a>
                            <a href="#" aria-label="Instagram"><FiInstagram /></a>
                            <a href="#" aria-label="GitHub"><FiGithub /></a>
                            <a href="#" aria-label="Email"><FiMail /></a>
                        </div>
                    </div>

                    <div className="footer-links">
                        <h4>Explore</h4>
                        <Link to="/gallery">Gallery</Link>
                        <Link to="/gallery3d">3D Experience</Link>
                        <Link to="/artists">Artists</Link>
                        <Link to="/events">Events</Link>
                    </div>

                    <div className="footer-links">
                        <h4>Community</h4>
                        <Link to="/register">Join as Artist</Link>
                        <Link to="/events">Upcoming Shows</Link>
                        <a href="#">Help Center</a>
                        <a href="#">Guidelines</a>
                    </div>

                    <div className="footer-links">
                        <h4>Platform</h4>
                        <a href="#">About Us</a>
                        <a href="#">Privacy Policy</a>
                        <a href="#">Terms of Use</a>
                        <a href="#">Contact</a>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>© 2026 VirtualMuseum. All rights reserved.</p>
                    <p>Built with ♥ for art lovers everywhere</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
