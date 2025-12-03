import { useNavigate } from "react-router-dom";
import { Button } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import "../styles/home.css";

const HomePage = () => {
    const navigate = useNavigate();

    return (
        <div className="home-container">
            {/* Decorative Elements */}
            <div className="home-dot-green" />
            <div className="home-circle-border" />
            <div className="home-glow-effect" />

            {/* Left Content */}
            <div className="home-content">
                <div className="home-title-wrapper">
                    <div className="home-title-dot" />
                    <h1 className="home-title">
                        Exploring the Future
                        <br />
                        of Technology
                    </h1>
                </div>

                <p className="home-description">
                    This web is where we write about technology, creativity, and the stories behind digital innovation — a place to connect, learn, and grow together.
                </p>

                <Button
                    type="primary"
                    size="large"
                    icon={<ArrowRightOutlined />}
                    iconPosition="end"
                    onClick={() => navigate("/blog")}
                    className="home-get-started-button"
                >
                    Explore Blog
                </Button>

                {/* Award Badge */}
                <div className="home-award-badge">
                    <div className="home-award-icon">🏆</div>
                    <div>
                        <div className="home-award-title">PROJECT</div>
                        <div className="home-award-subtitle">GROUP 13 - 2025</div>
                    </div>
                </div>
            </div>

            {/* Right Content - Logo */}
            <div className="home-logo-wrapper">
                <h1 className="home-logo-text">
                    GROUP 13
                    <sup className="home-logo-tm">™</sup>
                </h1>
                <div className="home-logo-circle">
                    <div className="home-logo-triangle" />
                </div>
            </div>
        </div>
    );
};

export default HomePage;