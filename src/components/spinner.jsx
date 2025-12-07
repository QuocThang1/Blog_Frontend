import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const Spinner = ({
    size = "large",
    tip = "",
    fullScreen = false,
    style = {}
}) => {
    const customIcon = <LoadingOutlined style={{ fontSize: size === "large" ? 48 : 24 }} spin />;

    if (fullScreen) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                width: '100%',
                ...style
            }}>
                <Spin indicator={customIcon} size={size} tip={tip} />
            </div>
        );
    }

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '60px 0',
            width: '100%',
            ...style
        }}>
            <Spin indicator={customIcon} size={size} tip={tip} />
        </div>
    );
};

export default Spinner;