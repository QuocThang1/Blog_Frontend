import { useEffect, useState } from "react";
import { Table, Tag, Space, Button, Input, Popconfirm, Empty } from "antd";
import { EditOutlined, DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import { getAllUsersApi } from "../../../utils/Api/userAPI";
import "../../../styles/adminManagement.css";

const ListOfUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await getAllUsersApi();
      if (res?.EC === 0) {
        setUsers(res.data || []);
      } else {
        toast.error(res.EM);
      }
    } catch {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.username?.toLowerCase().includes(searchText.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: "No",
      render: (_, __, index) => index + 1,
      width: 60,
      align: "center",
    },
    {
      title: "Username",
      dataIndex: "username",
    },
    {
        title: "Birthday",
        dataIndex: "dob",
        render: (d) => d ? new Date(d).toLocaleDateString("vi-VN") : "N/A",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Role",
      dataIndex: "role",
      render: (role = "user") => (
        <Tag color={role === "admin" ? "red" : "blue"}>
          {role.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Gender",
      dataIndex: "gender",
      render: (gender = "unknown") => (
        <Tag
          color={
            gender === "male"
              ? "green"
              : gender === "female"
              ? "pink"
              : "gray"
          }
        >
          {gender.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Categories",
      dataIndex: "categories",
      render: (categories) => (
        <div>
          {categories && categories.length > 0 ? (
            categories.map((cat, index) => (
              <Tag key={index} color="blue">
                {cat.name}
              </Tag>
            ))
          ) : (
            <span>No categories</span>
          )}
        </div>
      ),
    },
    {
      title: "",
      width: 150,
      align: "center",
      render: () => (
        <Space size="small">
          <Button type="primary" icon={<EditOutlined />} size="small">
            Edit
          </Button>
          <Popconfirm title="Delete user?" okText="Yes" cancelText="No">
            <Button danger size="small" icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="admin-management-container">
      {/* HEADER */}
      <div className="admin-management-header">
        <h2>User Management</h2>

        <div className="admin-management-actions">
          <Input
            prefix={<SearchOutlined />}
            placeholder="Search users..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
            style={{ width: 300 }}
          />
        </div>
      </div>

      {/* TABLE */}
      <Table
        rowKey="_id"
        loading={loading}
        columns={columns}
        dataSource={filteredUsers}
        pagination={{
          pageSize: 6,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} users`,
        }}
        className="admin-management-table"
        locale={{
          emptyText: (
            <Empty
              description={
                <span style={{ color: "#fff", opacity: 0.7 }}>
                  No User Available
                </span>
              }
            />
          ),
        }}
      />
    </div>
  );
};

export default ListOfUsers;
