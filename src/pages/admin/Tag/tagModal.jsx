import { useEffect } from "react";
import { Modal, Form, Input, ColorPicker } from "antd";
import { toast } from "react-toastify";
import { createTagApi, updateTagApi } from "../../../utils/Api/tagApi";

const TagModal = ({ open, tag, onSuccess, onCancel }) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (open) {
            if (tag) {
                // Edit mode
                form.setFieldsValue({
                    name: tag.name,
                    description: tag.description,
                    color: tag.color,
                });
            } else {
                // Create mode
                form.resetFields();
            }
        }
    }, [open, tag, form]);

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();

            // Convert color to hex if it's an object from ColorPicker
            const colorValue = typeof values.color === 'string'
                ? values.color
                : values.color?.toHexString() || '#3b82f6';

            const tagData = {
                ...values,
                color: colorValue,
            };

            let res;
            if (tag) {
                // Update tag
                res = await updateTagApi(tag._id, tagData);
            } else {
                // Create tag
                res = await createTagApi(tagData);
            }

            if (res && res.EC === 0) {
                toast.success(res.EM || `Tag ${tag ? "updated" : "created"} successfully`);
                form.resetFields();
                onSuccess();
            } else {
                toast.error(res.EM || `Failed to ${tag ? "update" : "create"} tag`);
            }
        } catch (error) {
            if (error.errorFields) {
                // Validation error
                return;
            }
            console.error("Submit tag error:", error);
            toast.error(error?.response?.data?.EM || `Failed to ${tag ? "update" : "create"} tag`);
        }
    };

    const handleCancel = () => {
        form.resetFields();
        onCancel();
    };

    return (
        <Modal
            title={tag ? "Edit Tag" : "Create Tag"}
            open={open}
            onOk={handleSubmit}
            onCancel={handleCancel}
            okText={tag ? "Update" : "Create"}
            cancelText="Cancel"
            width={600}
            destroyOnHidden
            className="admin-management-modal"
        >
            <Form
                form={form}
                layout="vertical"
                autoComplete="off"
                initialValues={{
                    color: '#3b82f6'
                }}
            >
                <Form.Item
                    label="Tag Name"
                    name="name"
                    rules={[
                        { required: true, message: "Please input tag name!" },
                        { min: 2, message: "Tag name must be at least 2 characters!" },
                        { max: 50, message: "Tag name must not exceed 50 characters!" },
                    ]}
                >
                    <Input
                        placeholder="Enter tag name"
                        size="large"
                        showCount
                        maxLength={50}
                    />
                </Form.Item>

                <Form.Item
                    label="Description"
                    name="description"
                    rules={[
                        { max: 200, message: "Description must not exceed 200 characters!" },
                    ]}
                >
                    <Input.TextArea
                        placeholder="Enter tag description (optional)"
                        rows={3}
                        showCount
                        maxLength={200}
                    />
                </Form.Item>

                <Form.Item
                    label="Tag Color"
                    name="color"
                    rules={[
                        { required: true, message: "Please select tag color!" },
                    ]}
                >
                    <ColorPicker
                        showText
                        size="large"
                        presets={[
                            {
                                label: 'Recommended',
                                colors: [
                                    '#3b82f6', // Blue
                                    '#10b981', // Green
                                    '#f59e0b', // Yellow
                                    '#ef4444', // Red
                                    '#8b5cf6', // Purple
                                    '#ec4899', // Pink
                                    '#06b6d4', // Cyan
                                    '#f97316', // Orange
                                ],
                            },
                        ]}
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default TagModal;