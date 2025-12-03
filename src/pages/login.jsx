import { useState, useContext } from "react";
import { Form, Input, Button, Card, Checkbox } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { loginApi } from "../utils/Api/accountApi";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/auth.context";
import "../styles/login.css";

const Login = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { setAuth } = useContext(AuthContext);

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const { username, password } = values;
            const res = await loginApi(username, password);
            if (res && res.data) {
                // Lưu token vào localStorage
                localStorage.setItem("access_token", res.access_token);

                toast.success(res.EM || "Login successful!", { autoClose: 2000 });

                // Cập nhật auth context
                setAuth({
                    isAuthenticated: true,
                    user: {
                        email: res.data.email || "",
                        fullName: res.data.fullName || "",
                        username: res.data.username || "",
                        dob: res.data.dob || "",
                        gender: res.data.gender || "",
                        phone: res.data.phone || "",
                        role: res.data.role || "user",
                    },
                });

                // Chuyển hướng về trang chủ
                navigate("/");
            } else {
                toast.error(res.message || "Login failed. Please try again.", {
                    autoClose: 2000,
                });
            }
        } catch (error) {
            console.error("Login error:", error);
            toast.error(
                error?.response?.data?.message || "Login failed. Please check your credentials.",
                { autoClose: 2000 }
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <Card
                title="Login"
                className="login-card"
            >
                <Form
                    name="login"
                    onFinish={onFinish}
                    layout="vertical"
                    autoComplete="off"
                    initialValues={{ remember: true }}
                    className="login-form"
                >
                    <Form.Item
                        label="Username"
                        name="username"
                        rules={[{ required: true, message: "Please input your username!" }]}
                    >
                        <Input
                            prefix={<UserOutlined style={{ color: '#000000' }} />}
                            placeholder="Username"
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[{ required: true, message: "Please input your password!" }]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            placeholder="Password"
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item>
                        <Form.Item name="remember" valuePropName="checked" noStyle>
                            <Checkbox>Remember me</Checkbox>
                        </Form.Item>
                        <a
                            className="login-forgot-link"
                            style={{ float: "right" }}
                            onClick={() => toast.info("Contact admin to reset password")}
                        >
                            Forgot password?
                        </a>
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            block
                            size="large"
                            loading={loading}
                            className="login-submit-button"
                        >
                            Login
                        </Button>
                    </Form.Item>

                    <div className="login-register-link">
                        Don't have an account?{" "}
                        <a onClick={() => navigate("/register")}>
                            Register now
                        </a>
                    </div>
                </Form>
            </Card>
        </div>
    );
};

export default Login;