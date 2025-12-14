import { Row, Col, Space } from "antd";
import {
    GithubOutlined,
    FacebookOutlined,
    TwitterOutlined,
    LinkedinOutlined,
    MailOutlined,
    PhoneOutlined,
    EnvironmentOutlined,
    HomeOutlined,
    FileTextOutlined,
    UserOutlined,
    InfoCircleOutlined
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import "../styles/footer.css";

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                <Row gutter={[32, 32]} className="footer-content">
                    {/* About Section */}
                    <Col xs={24} sm={12} md={6}>
                        <div className="footer-section">
                            <h3 className="footer-title">About Us</h3>
                            <p className="footer-description">
                                A modern blogging platform where you can share your thoughts,
                                ideas, and stories with the world.
                            </p>
                            <div className="footer-social">
                                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="social-link">
                                    <GithubOutlined />
                                </a>
                                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-link">
                                    <FacebookOutlined />
                                </a>
                                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-link">
                                    <TwitterOutlined />
                                </a>
                                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-link">
                                    <LinkedinOutlined />
                                </a>
                            </div>
                        </div>
                    </Col>

                    {/* Quick Links Section */}
                    <Col xs={24} sm={12} md={6}>
                        <div className="footer-section">
                            <h3 className="footer-title">Quick Links</h3>
                            <ul className="footer-links">
                                <li>
                                    <Link to="/" className="footer-link">
                                        <HomeOutlined /> Home
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/blog" className="footer-link">
                                        <FileTextOutlined /> Blogs
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/profile" className="footer-link">
                                        <UserOutlined /> Profile
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/about" className="footer-link">
                                        <InfoCircleOutlined /> About
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </Col>

                    {/* Categories Section */}
                    <Col xs={24} sm={12} md={6}>
                        <div className="footer-section">
                            <h3 className="footer-title">Categories</h3>
                            <ul className="footer-links">
                                <li>
                                    <a href="#" className="footer-link">Technology</a>
                                </li>
                                <li>
                                    <a href="#" className="footer-link">Lifestyle</a>
                                </li>
                                <li>
                                    <a href="#" className="footer-link">Travel</a>
                                </li>
                                <li>
                                    <a href="#" className="footer-link">Food</a>
                                </li>
                            </ul>
                        </div>
                    </Col>

                    {/* Contact Section */}
                    <Col xs={24} sm={12} md={6}>
                        <div className="footer-section">
                            <h3 className="footer-title">Contact Us</h3>
                            <Space direction="vertical" size="middle" className="footer-contact">
                                <div className="contact-item">
                                    <EnvironmentOutlined className="contact-icon" />
                                    <span>1 Vo Van Ngan, Thu Duc, Ho Chi Minh City</span>
                                </div>
                                <div className="contact-item">
                                    <PhoneOutlined className="contact-icon" />
                                    <span>+84 32 348 484</span>
                                </div>
                                <div className="contact-item">
                                    <MailOutlined className="contact-icon" />
                                    <span>contact@blogapp.com</span>
                                </div>
                            </Space>
                        </div>
                    </Col>
                </Row>

                {/* Bottom Bar */}
                <div className="footer-bottom">
                    <div className="footer-bottom-content">
                        <p className="copyright">
                            © {new Date().getFullYear()} Blog App - Group 13. All rights reserved.
                        </p>
                        <div className="footer-bottom-links">
                            <a href="#" className="bottom-link">Privacy Policy</a>
                            <span className="separator">|</span>
                            <a href="#" className="bottom-link">Terms of Service</a>
                            <span className="separator">|</span>
                            <a href="#" className="bottom-link">Cookie Policy</a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;