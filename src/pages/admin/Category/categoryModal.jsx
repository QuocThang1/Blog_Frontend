import { useEffect } from "react";
import { Modal, Form, Input } from "antd";
import { toast } from "react-toastify";
import { createCategoryApi, updateCategoryApi } from "../../../utils/Api/categoryApi";

const CategoryModal = ({ open, category, onSuccess, onCancel }) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (open) {
            if (category) {
                // Edit mode
                form.setFieldsValue({
                    name: category.name,
                    description: category.description,
                });
            } else {
                // Create mode
                form.resetFields();
            }
        }
    }, [open, category, form]);

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();

            let res;
            if (category) {
                // Update category
                res = await updateCategoryApi(category._id, values);
            } else {
                // Create category
                res = await createCategoryApi(values);
            }

            if (res && res.EC === 0) {
                toast.success(res.EM || `Category ${category ? "updated" : "created"} successfully`);
                form.resetFields();
                onSuccess();
            } else {
                toast.error(res.message || `Failed to ${category ? "update" : "create"} category`);
            }
        } catch (error) {
            if (error.errorFields) {
                // Validation error
                return;
            }
            console.error("Submit category error:", error);
            toast.error(error.message || `Failed to ${category ? "update" : "create"} category`);
        }
    };

    const handleCancel = () => {
        form.resetFields();
        onCancel();
    };

    return (
        <Modal
            title={category ? "Edit Category" : "Create Category"}
            open={open}
            onOk={handleSubmit}
            onCancel={handleCancel}
            okText={category ? "Update" : "Create"}
            cancelText="Cancel"
            width={600}
            destroyOnHidden
            className="admin-management-modal"
        >
            <Form
                form={form}
                layout="vertical"
                autoComplete="off"
            >
                <Form.Item
                    label="Category Name"
                    name="name"
                    rules={[
                        { required: true, message: "Please input category name!" },
                        { min: 2, message: "Category name must be at least 2 characters!" },
                        { max: 100, message: "Category name must not exceed 100 characters!" },
                    ]}
                >
                    <Input
                        placeholder="Enter category name"
                        size="large"
                        showCount
                        maxLength={100}
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
                        placeholder="Enter category description"
                        rows={4}
                        showCount
                        maxLength={500}
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default CategoryModal;