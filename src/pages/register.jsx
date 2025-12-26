import { useState } from "react";
import { Form, Input, Button, DatePicker, Select, Card } from "antd";
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined } from "@ant-design/icons";
import { signUpApi } from "../utils/Api/accountApi";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "../styles/register.css";

const Register = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const userData = {
                username: values.username,
                password: values.password,
                fullName: values.fullName,
                email: values.email,
                phone: values.phone,
                dob: values.dob.format("YYYY-MM-DD"),
                gender: values.gender,
            };

            const res = await signUpApi(userData);

            if (res && res.data) {
                toast.success(res.EM || "Registration successful!", { autoClose: 2000 });
                setTimeout(() => navigate("/login"), 2000);
            } else {
                toast.error(res.mesage || "Registration failed. Please try again.", {
                    autoClose: 2000,
                });
            }
        } catch (error) {
            console.error("Registration error:", error);
            toast.error(error.message || "Registration failed. Please try again.", {
                autoClose: 2000,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-container">
            <Card
                title="Create Account"
                className="register-card"
            >
                <Form
                    name="register"
                    onFinish={onFinish}
                    layout="vertical"
                    className="register-form"
                >
                    <Form.Item
                        label="Username"
                        name="username"
                        rules={[
                            { required: true, message: "Please input your username!" },
                            { min: 3, message: "Username must be at least 3 characters!" }
                        ]}
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
                        rules={[
                            { required: true, message: "Please input your password!" },
                            { min: 6, message: "Password must be at least 6 characters!" }
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined className="input-icon" />}
                            placeholder="Password"
                            size="large"
                            className="custom-input"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Confirm Password"
                        name="confirmPassword"
                        dependencies={["password"]}
                        rules={[
                            { required: true, message: "Please confirm your password!" },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue("password") === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error("Passwords do not match!"));
                                },
                            }),
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined className="input-icon" />}
                            placeholder="Confirm Password"
                            size="large"
                            className="custom-input"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Full Name"
                        name="fullName"
                        rules={[{ required: true, message: "Please input your full name!" }]}
                    >
                        <Input
                            prefix={<UserOutlined style={{ color: '#000000' }} />}
                            placeholder="Full Name"
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            { required: true, message: "Please input your email!" },
                            { type: "email", message: "Please enter a valid email!" }
                        ]}
                    >
                        <Input
                            prefix={<MailOutlined style={{ color: '#000000' }} />}
                            placeholder="Email"
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Phone"
                        name="phone"
                        rules={[
                            { required: true, message: "Please input your phone number!" },
                            { pattern: /^[0-9]{10,11}$/, message: "Please enter a valid phone number!" }
                        ]}
                    >
                        <Input
                            prefix={<PhoneOutlined style={{ color: '#000000' }} />}
                            placeholder="Phone Number"
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Date of Birth"
                        name="dob"
                        rules={[{ required: true, message: "Please select your date of birth!" }]}
                    >
                        <DatePicker
                            style={{ width: "100%" }}
                            placeholder="Select Date of Birth"
                            size="large"
                            format="DD/MM/YYYY"
                            className="custom-input"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Gender"
                        name="gender"
                        rules={[{ required: true, message: "Please select your gender!" }]}
                    >
                        <Select
                            placeholder="Select Gender"
                            size="large"
                            className="custom-input"
                        >
                            <Select.Option value="male">Male</Select.Option>
                            <Select.Option value="female">Female</Select.Option>
                            <Select.Option value="other">Other</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            block
                            size="large"
                            loading={loading}
                            className="register-submit-button"
                        >
                            Register
                        </Button>
                    </Form.Item>

                    <div className="register-login-link">
                        Already have an account?{" "}
                        <a onClick={() => navigate("/login")}>
                            Login here
                        </a>
                    </div>
                </Form>
            </Card>
        </div>
    );
};

export default Register;