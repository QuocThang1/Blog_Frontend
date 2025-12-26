import { useState, useEffect, useContext } from "react";
import { Card, Form, Input, Button, DatePicker, Select, Avatar, Tag } from "antd";
import { UserOutlined, MailOutlined, PhoneOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import { updateProfileApi, getAccountApi } from "../utils/Api/accountApi";
import { getAllCategoriesApi } from "../utils/Api/categoryApi";
import { AuthContext } from "../context/auth.context";
import dayjs from "dayjs";
import "../styles/profile.css";

const Profile = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [categoryOptions, setCategoryOptions] = useState([]);
    const { auth, setAuth } = useContext(AuthContext);

    useEffect(() => {
        fetchUserData();
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await getAllCategoriesApi();
            if (res?.data) {
                const options = res.data.map(cat => ({
                    label: cat.name,
                    value: cat._id
                }));
                setCategoryOptions(options);
            }
        } catch (error) {
            console.error("Fetch categories error:", error);
            toast.error("Failed to load categories");
        }
    };

    const fetchUserData = async () => {
        try {
            const res = await getAccountApi();
            if (res && res.data) {
                const userData = res.data;
                form.setFieldsValue({
                    username: userData.username,
                    fullName: userData.fullName,
                    email: userData.email,
                    phone: userData.phone,
                    dob: userData.dob ? dayjs(userData.dob) : null,
                    gender: userData.gender,
                    categories: userData.categories || [], // <-- thêm categories
                });
            }
        } catch (error) {
            console.error("Fetch user data error:", error);
            toast.error("Failed to load user data");
        }
    };

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const profileData = {
                username: values.username,
                fullName: values.fullName,
                email: values.email,
                phone: values.phone,
                dob: values.dob ? values.dob.format("YYYY-MM-DD") : "",
                gender: values.gender,
                categories: values.categories || [], // <-- gửi mảng category _id
            };

            const res = await updateProfileApi(profileData);

            if (res && res.data) {
                toast.success("Profile updated successfully!");

                // Update auth context
                setAuth({
                    ...auth,
                    user: {
                        ...auth.user,
                        fullName: profileData.fullName,
                        email: profileData.email,
                        phone: profileData.phone,
                        dob: profileData.dob,
                        gender: profileData.gender,
                        categories: profileData.categories,
                    },
                });
            } else {
                toast.error(res.message || "Failed to update profile");
            }
        } catch (error) {
            console.error("Update profile error:", error);
            toast.error(error.message || "Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="profile-container">
            <Card className="profile-card" title="My Profile">
                <div className="profile-header">
                    <Avatar size={100} icon={<UserOutlined />} className="profile-avatar" />
                    <h2>{auth.user.fullName || auth.user.username}</h2>
                    <p className="profile-role">{auth.user.role || "User"}</p>
                </div>

                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    className="profile-form"
                >
                    <Form.Item label="Username" name="username">
                        <Input
                            prefix={<UserOutlined style={{ color: '#64b5f6' }} />}
                            size="large"
                            disabled
                            className="profile-input"
                            style={{ color: '#ffffff' }}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Full Name"
                        name="fullName"
                        rules={[{ required: true, message: "Please input your full name!" }]}
                    >
                        <Input
                            prefix={<UserOutlined style={{ color: '#64b5f6' }} />}
                            placeholder="Full Name"
                            size="large"
                            className="profile-input"
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
                            prefix={<MailOutlined style={{ color: '#64b5f6' }} />}
                            placeholder="Email"
                            size="large"
                            className="profile-input"
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
                            prefix={<PhoneOutlined style={{ color: '#64b5f6' }} />}
                            placeholder="Phone Number"
                            size="large"
                            className="profile-input"
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
                            className="profile-input"
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
                            className="profile-input"
                        >
                            <Select.Option value="male">Male</Select.Option>
                            <Select.Option value="female">Female</Select.Option>
                            <Select.Option value="other">Other</Select.Option>
                        </Select>
                    </Form.Item>

                    {/* NEW: Multi-Select Categories */}
                    <Form.Item label="Preferred Categories" name="categories">
                        <Select
                            mode="multiple"
                            placeholder="Select categories"
                            size="large"
                            className="profile-input"
                            options={categoryOptions}
                            allowClear
                            tagRender={({ label, closable, onClose }) => (
                                <Tag
                                    color="#409cff"   // màu xanh dương
                                    closable={closable}
                                    onClose={onClose}
                                    style={{ marginRight: 3 }}
                                >
                                    {label}
                                </Tag>
                            )}
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            block
                            size="large"
                            loading={loading}
                            className="profile-submit-button"
                        >
                            Update Profile
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default Profile;
