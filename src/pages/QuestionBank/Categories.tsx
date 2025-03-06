import { useState } from "react";
import { Input, Button, List, Typography, Card } from "antd";

const { Title } = Typography;

const Categories = () => {
  const [categories, setCategories] = useState([
    { id: 1, name: "Tổng quan" },
    { id: 2, name: "Chuyên sâu" },
    { id: 3, name: "Vận dụng" },
    { id: 4, name: "Vận dụng cao" },
  ]);
  const [newCategory, setNewCategory] = useState("");

  const addCategory = () => {
    if (newCategory.trim()) {
      setCategories([...categories, { id: categories.length + 1, name: newCategory }]);
      setNewCategory("");
    }
  };

  return (
    <Card
      title={<Title level={4} style={{ textAlign: "center" }}>📂 Danh mục khối kiến thức</Title>}
      bordered={false}
      style={{ maxWidth: 400, margin: "auto", boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }}
    >
      <List
        bordered
        dataSource={categories}
        renderItem={(item) => (
          <List.Item>
            <Typography.Text strong>{item.name}</Typography.Text>
          </List.Item>
        )}
        style={{ marginBottom: 16 }}
      />
      <Input.Group compact>
        <Input
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="Thêm khối kiến thức"
          style={{ width: "70%" }}
        />
        <Button type="primary" onClick={addCategory}>
          Thêm
        </Button>
      </Input.Group>
    </Card>
  );
};

export default Categories;
