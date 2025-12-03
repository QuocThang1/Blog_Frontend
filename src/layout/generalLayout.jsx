import Header from "../components/header.jsx";
import { Outlet } from "react-router-dom";
import Footer from "../components/footer.jsx";
import "../styles/generalLayout.css";

function App() {
    return (
        <div className="layout-container">
            <Header />
            <div className="layout-content">
                <Outlet />
            </div>
            <Footer />
        </div>
    );
}

export default App;