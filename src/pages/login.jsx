import { useState, useContext } from "react";
import { Form, Input, Button, Card, Checkbox } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { loginApi, googleLoginApi, getAccountApi } from "../utils/Api/accountApi";
import FavoriteCategoriesModal from "../components/FavoriteCategoriesModal";
import { useGoogleLogin } from "@react-oauth/google";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/auth.context";
import "../styles/login.css";

const Login = () => {
    const [loading, setLoading] = useState(false);
    const [showTopicsModal, setShowTopicsModal] = useState(false);
    const navigate = useNavigate();
    const { setAuth, auth } = useContext(AuthContext);

    const refreshAccountAndMaybeShowModal = async () => {
        try {
            const acc = await getAccountApi();
            const accountData = acc?.data || {};
            setAuth({
                isAuthenticated: true,
                user: {
                    _id: accountData._id || "",
                    email: accountData.email || "",
                    fullName: accountData.fullName || "",
                    username: accountData.username || "",
                    dob: accountData.dob || "",
                    gender: accountData.gender || "",
                    phone: accountData.phone || "",
                    role: accountData.role || "user",
                    categories: accountData.categories || [],
                }
            });

            if (!accountData.categories || accountData.categories.length === 0) {
                setShowTopicsModal(true);
            }
        } catch (err) {
            console.error('Failed to refresh account after login:', err);
        }
    };

    // prepare Google login function (hook must be called at top-level)
    const googleLogin = useGoogleLogin({
        onSuccess: async (credentialResponse) => {
            console.log('Google credentialResponse:', credentialResponse);
            setLoading(true);
            try {
                // `useGoogleLogin` can return either a credential response (credential) or a token response (access_token)
                const idToken = credentialResponse?.credential || null;
                const accessToken = credentialResponse?.access_token || credentialResponse?.accessToken || null;
                if (!idToken && !accessToken) throw new Error('No credential from Google');

                const res = await googleLoginApi({ idToken, accessToken });
                if (res && res.access_token) {
                    localStorage.setItem('access_token', res.access_token);
                    toast.success(res.EM || 'Login with Google successful', { autoClose: 2000 });
                    // Refresh full account and show modal if needed
                    await refreshAccountAndMaybeShowModal();
                    navigate('/');
                } else {
                    toast.error('Google login failed');
                }
            } catch (err) { 
                console.error('Google login error:', err);
                toast.error(`Google login failed: ${err?.message || 'see console'}`);
            } finally {
                setLoading(false);
            }
        },
        onError: (err) => {
            console.error('Google login onError:', err);
            toast.error('Google login failed — see console for details');
        },
    });

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const { username, password } = values;
            const res = await loginApi(username, password);
            if (res && res.access_token) {
                // Lưu token vào localStorage
                localStorage.setItem("access_token", res.access_token);

                toast.success(res.EM || "Login successful!", { autoClose: 2000 });

                // Refresh full account and show modal if no categories
                await refreshAccountAndMaybeShowModal();

                // Chuyển hướng về trang chủ
                navigate("/");
            } else {
                toast.error(res?.message || "Login failed. Please try again.", {
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
                            onClick={() => navigate('/forgot-password')}
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

                    <Form.Item>
                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
                            {import.meta.env.VITE_GOOGLE_CLIENT_ID ? (
                                <Button
                                    className="login-gooogle-button"
                                    block
                                    size="large"
                                    loading={loading}
                                    onClick={async () => {
                                        try {
                                            await googleLogin();
                                        } catch (err) {
                                            console.error('Google login invocation error:', err);
                                            toast.error('Google login failed — try again or use normal login.');
                                        }
                                    }}
                                    aria-label="Login with Google"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="20" height="20" style={{ marginRight: 10 }}>
                                        <path fill="currentColor" d="M44.5 20H24v8.5h11.9C34.8 33 30.9 36 26 36c-7 0-12.6-5.6-12.6-12.6S19 10.8 26 10.8c3.3 0 6 1.2 8.1 3.2l6-6C36.9 4 31.8 1.8 26 1.8 13.7 1.8 3.9 11.6 3.9 23.9S13.7 46 26 46c12.3 0 20.6-8.1 20.6-19.9 0-1.3-.2-2.4-.1-4.1z"/>
                                    </svg>
                                    <span>Login with Google</span>
                                </Button>
                            ) : (
                                <Button
                                    type="default"
                                    onClick={() => toast.error('Google client ID is missing. Set VITE_GOOGLE_CLIENT_ID in .env and restart the dev server.')}
                                >
                                    Login with Google
                                </Button>
                            )}
                        </div>
                    </Form.Item>

                    <div className="login-register-link">
                        Don't have an account?{" "}
                        <a onClick={() => navigate("/register")}>
                            Register now
                        </a>
                    </div>
                </Form>
            </Card>            <FavoriteCategoriesModal
                open={showTopicsModal}
                onClose={() => setShowTopicsModal(false)}
                onSaved={async () => { await refreshAccountAndMaybeShowModal(); setShowTopicsModal(false); }}
                initialSelected={auth?.user?.categories || []}
            />        </div>
    );
};

export default Login;