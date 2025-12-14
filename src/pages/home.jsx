import { useNavigate } from "react-router-dom";
import { Button, Carousel } from "antd";
import { ArrowRightOutlined, LeftOutlined, RightOutlined } from "@ant-design/icons";
import { useRef } from "react";
import "../styles/home.css";

const HomePage = () => {
    const navigate = useNavigate();
    const carouselRef = useRef(null);

    const slides = [
        {
            id: 1,
            image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200",
            title: "Discover Amazing Stories",
            description: "Explore thousands of blogs written by talented creators",
            buttonText: "Share your ideas",
            buttonLink: "/blog" // 
        },
        {
            id: 2,
            image: "https://images.unsplash.com/photo-1432821596592-e2c18b78144f?w=1200",
            title: "Share Your Ideas",
            description: "Create and publish your own blog posts with ease",
            buttonText: "Share your ideas",
            buttonLink: "/profile"
        },
        {
            id: 3,
            image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1200",
            title: "Join Our Community",
            description: "Connect with readers and writers from around the world",
            buttonText: "Share your ideas",
            buttonLink: "/register"
        }
    ];

    const handlePrev = () => {
        carouselRef.current?.prev();
    };

    const handleNext = () => {
        carouselRef.current?.next();
    };

    return (
        <div className="home-page">
            {/* Slider Section */}
            <section className="home-slider-section">
                <Carousel
                    ref={carouselRef}
                    autoplay
                    autoplaySpeed={5000}
                    effect="fade"
                    dots={{ className: 'slider-dots' }}
                >
                    {slides.map((slide) => (
                        <div key={slide.id} className="slider-item">
                            <div className="slider-overlay" />
                            <img src={slide.image} alt={slide.title} className="slider-image" />
                            <div className="slider-content">
                                <h1 className="slider-title">{slide.title}</h1>
                                <p className="slider-description">{slide.description}</p>

                                {/* CTA Button */}
                                <Button
                                    type="primary"
                                    size="large"
                                    icon={<ArrowRightOutlined />}
                                    onClick={() => navigate(slide.buttonLink)}
                                    className="slider-cta-button"
                                >
                                    {slide.buttonText}
                                </Button>
                            </div>
                        </div>
                    ))}
                </Carousel>

                {/* Navigation Arrows */}
                <button className="slider-arrow slider-arrow-prev" onClick={handlePrev}>
                    <LeftOutlined />
                </button>
                <button className="slider-arrow slider-arrow-next" onClick={handleNext}>
                    <RightOutlined />
                </button>
            </section>

            {/* Welcome Section */}
            <section className="home-welcome-section">
                <div className="welcome-container">
                    <div className="welcome-dot-green" />
                    <div className="welcome-circle-border" />
                    <div className="welcome-glow-effect" />

                    <div className="welcome-content">
                        <div className="welcome-badge">
                            <span className="badge-icon">✨</span>
                            <span className="badge-text">Welcome to Our Blog</span>
                        </div>

                        <h2 className="welcome-title">
                            Exploring the Future
                            <br />
                            of <span className="highlight-text">Technology</span>
                        </h2>

                        <p className="welcome-description">
                            This is where we write about technology, creativity, and the stories
                            behind digital innovation — a place to connect, learn, and grow together.
                        </p>

                        <div className="welcome-features">
                            <div className="feature-item">
                                <div className="feature-icon">📚</div>
                                <div className="feature-text">
                                    <h4>Rich Content</h4>
                                    <p>High-quality articles on various topics</p>
                                </div>
                            </div>
                            <div className="feature-item">
                                <div className="feature-icon">💡</div>
                                <div className="feature-text">
                                    <h4>Expert Writers</h4>
                                    <p>Learn from industry professionals</p>
                                </div>
                            </div>
                            <div className="feature-item">
                                <div className="feature-icon">🌍</div>
                                <div className="feature-text">
                                    <h4>Global Community</h4>
                                    <p>Connect with readers worldwide</p>
                                </div>
                            </div>
                        </div>

                        <div className="welcome-actions">
                            <Button
                                type="primary"
                                size="large"
                                icon={<ArrowRightOutlined />}
                                onClick={() => navigate("/blog")}
                                className="explore-button"
                            >
                                Explore Blogs
                            </Button>
                            <Button
                                size="large"
                                onClick={() => navigate("/register")}
                                className="join-button"
                            >
                                Join Us Today
                            </Button>
                        </div>

                        <div className="welcome-award-badge">
                            <div className="award-icon">🏆</div>
                            <div className="award-info">
                                <div className="award-title">BLOG GROUP 13</div>
                                <div className="award-subtitle">Excellence Blog - 2025</div>
                            </div>
                        </div>
                    </div>

                    <div className="welcome-visual">
                        <div className="visual-card">
                            <div className="card-number">13</div>
                            <div className="card-label">GROUP</div>
                        </div>
                        <div className="visual-circles">
                            <div className="circle circle-1"></div>
                            <div className="circle circle-2"></div>
                            <div className="circle circle-3"></div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;