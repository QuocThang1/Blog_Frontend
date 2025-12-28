import { useState, useEffect } from "react";
import { Modal, Form, Input, Select, Upload, Button, Image } from "antd";
import { UploadOutlined, DeleteOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import { createBlogApi, updateBlogApi } from "../../../utils/Api/blogApi";
import { getAllCategoriesApi } from "../../../utils/Api/categoryApi";
import { getAllTagsApi } from "../../../utils/Api/tagApi";
import { uploadImageApi } from "../../../utils/Api/uploadImageApi";

const BlogModal = ({ open, blog, onSuccess, onCancel }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [tags, setTags] = useState([]);
    const [imageUrl, setImageUrl] = useState("");
    const [imagePublicId, setImagePublicId] = useState("");
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (open) {
            fetchCategories();
            fetchTags();
            if (blog) {
                // Edit mode
                form.setFieldsValue({
                    title: blog.title,
                    description: blog.description,
                    content: blog.content,
                    categoryId: blog.category?._id || blog.categoryId,
                    tags: blog.tags?.map(tag => tag._id) || [],
                });
                setImageUrl(blog.image || "");
                setImagePublicId(blog.imagePublicId || "");
            } else {
                // Create mode
                form.resetFields();
                setImageUrl("");
                setImagePublicId("");
            }
        }
    }, [open, blog, form]);

    const fetchCategories = async () => {
        try {
            const res = await getAllCategoriesApi();
            if (res && res.EC === 0) {
                setCategories(res.data || []);
            }
        } catch (error) {
            console.error("Fetch categories error:", error);
        }
    };

    const fetchTags = async () => {
        try {
            const res = await getAllTagsApi();
            if (res && res.EC === 0) {
                setTags(res.data || []);
            }
        } catch (error) {
            console.error("Fetch tags error:", error);
        }
    };

    const handleUpload = async ({ file, onSuccess: onUploadSuccess, onError }) => {
        setUploading(true);
        try {
            const res = await uploadImageApi(file);
            if (res && res.EC === 0) {
                setImageUrl(res.data.url);
                setImagePublicId(res.data.publicId);
                toast.success(res.EM || "Image uploaded successfully", { autoClose: 1500 });
                onUploadSuccess("ok");
            } else {
                toast.error(res.message || "Failed to upload image");
                onError(new Error(res.message || "Upload failed"));
            }
        } catch (error) {
            console.error("Upload image error:", error);
            toast.error(error.message || "Failed to upload image");
            onError(error);
        } finally {
            setUploading(false);
        }
    };

    const handleRemoveImage = () => {
        setImageUrl("");
        setImagePublicId("");
    };

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();

            if (!imageUrl) {
                toast.error("Please upload an image");
                return;
            }

            setLoading(true);

            const blogData = {
                title: values.title,
                description: values.description,
                content: values.content,
                image: imageUrl,
                imagePublicId: imagePublicId,
                categoryId: values.categoryId,
                tags: values.tags || [],
            };

            let res;
            if (blog) {
                res = await updateBlogApi(blog._id, blogData);
            } else {
                res = await createBlogApi(blogData);
            }

            if (res && res.EC === 0) {
                toast.success(res.EM || `Blog ${blog ? "updated" : "created"} successfully`);
                form.resetFields();
                setImageUrl("");
                setImagePublicId("");
                onSuccess();
            } else {
                toast.error(res.message || `Failed to ${blog ? "update" : "create"} blog`);
            }
        } catch (error) {
            if (error.errorFields) {
                return;
            }
            console.error("Submit blog error:", error);
            toast.error(error.message || `Failed to ${blog ? "update" : "create"} blog`);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        form.resetFields();
        setImageUrl("");
        setImagePublicId("");
        onCancel();
    };

    return (
        <Modal
            title={blog ? "Edit Blog" : "Create Blog"}
            open={open}
            onOk={handleSubmit}
            onCancel={handleCancel}
            okText={blog ? "Update" : "Create"}
            cancelText="Cancel"
            width={800}
            confirmLoading={loading}
            destroyOnHidden
            className="admin-management-modal"
        >
            <Form
                form={form}
                layout="vertical"
                autoComplete="off"
            >
                <Form.Item
                    label="Blog Title"
                    name="title"
                    rules={[
                        { required: true, message: "Please input blog title!" },
                        { min: 5, message: "Title must be at least 5 characters!" },
                        { max: 200, message: "Title must not exceed 200 characters!" },
                    ]}
                >
                    <Input
                        placeholder="Enter blog title"
                        size="large"
                        showCount
                        maxLength={200}
                    />
                </Form.Item>

                <Form.Item
                    label="Description"
                    name="description"
                    rules={[
                        { required: true, message: "Please input description!" },
                        { min: 10, message: "Description must be at least 10 characters!" },
                        { max: 500, message: "Description must not exceed 500 characters!" },
                    ]}
                >
                    <Input.TextArea
                        placeholder="Enter blog description"
                        rows={3}
                        showCount
                        maxLength={500}
                    />
                </Form.Item>

                <Form.Item
                    label="Content"
                    name="content"
                    rules={[
                        { required: true, message: "Please input content!" },
                        { min: 50, message: "Content must be at least 50 characters!" },
                    ]}
                >
                    <Input.TextArea
                        placeholder="Enter blog content"
                        rows={8}
                        showCount
                    />
                </Form.Item>

                <Form.Item
                    label="Category"
                    name="categoryId"
                    rules={[{ required: true, message: "Please select a category!" }]}
                >
                    <Select
                        placeholder="Select category"
                        size="large"
                        loading={categories.length === 0}
                        showSearch
                        filterOption={(input, option) =>
                            (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                        }
                        options={categories.map(cat => ({
                            value: cat._id,
                            label: cat.name,
                        }))}
                    />
                </Form.Item>

                <Form.Item
                    label="Tags"
                    name="tags"
                >
                    <Select
                        mode="multiple"
                        placeholder="Select tags (optional)"
                        size="large"
                        loading={tags.length === 0}
                        showSearch
                        filterOption={(input, option) =>
                            (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                        }
                        options={tags.map(tag => ({
                            value: tag._id,
                            label: tag.name,
                        }))}
                        tagRender={(props) => {
                            const { label, value, closable, onClose } = props;
                            const tag = tags.find(t => t._id === value);
                            return (
                                <span
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        backgroundColor: tag?.color || '#3b82f6',
                                        color: '#fff',
                                        padding: '2px 8px',
                                        borderRadius: '4px',
                                        margin: '2px',
                                        fontSize: '13px'
                                    }}
                                >
                                    {label}
                                    {closable && (
                                        <span
                                            onClick={onClose}
                                            style={{
                                                marginLeft: '6px',
                                                cursor: 'pointer',
                                                fontSize: '12px'
                                            }}
                                        >
                                            ×
                                        </span>
                                    )}
                                </span>
                            );
                        }}
                    />
                </Form.Item>

                <Form.Item
                    label="Blog Image"
                    required
                >
                    {imageUrl ? (
                        <div style={{ position: "relative", display: "inline-block" }}>
                            <Image
                                src={imageUrl}
                                alt="blog"
                                width={200}
                                height={200}
                                style={{ objectFit: "cover", borderRadius: "8px" }}
                            />
                            <Button
                                type="primary"
                                danger
                                icon={<DeleteOutlined />}
                                onClick={handleRemoveImage}
                                style={{
                                    position: "absolute",
                                    top: 10,
                                    right: 10,
                                }}
                                size="small"
                            >
                                Remove
                            </Button>
                        </div>
                    ) : (
                        <Upload
                            customRequest={handleUpload}
                            showUploadList={false}
                            accept="image/*"
                            disabled={uploading}
                        >
                            <Button
                                icon={<UploadOutlined />}
                                loading={uploading}
                                size="large"
                            >
                                {uploading ? "Uploading..." : "Upload Image"}
                            </Button>
                        </Upload>
                    )}
                    <div style={{ color: "rgba(255, 255, 255, 0.6)", marginTop: 8, fontSize: 12 }}>
                        Supported formats: JPG, PNG
                    </div>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default BlogModal;