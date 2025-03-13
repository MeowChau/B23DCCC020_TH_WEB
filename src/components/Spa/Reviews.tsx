import { Table, Button, Modal, Form, Input, Rate, message, Select } from "antd";
import { useState } from "react";
import { Review, saveReviews, calculateAverageRating } from "@/services/Spa/Reviews";

const { Option } = Select;

const services = [
  { value: "Massage", label: "Massage" },
  { value: "Facial", label: "Chăm sóc da mặt" },
  { value: "Haircut", label: "Cắt tóc" },
  { value: "Nail", label: "Làm móng" },
  { value: "Sauna", label: "Xông hơi" }
];

const employees = [
  { value: "Anna", label: "Anna" },
  { value: "Minh", label: "Minh" },
  { value: "Lan", label: "Lan" },
  { value: "Huy", label: "Huy" },
  { value: "Quang", label: "Quang" },
];

interface Props {
  reviews: Review[];
  setReviews: (reviews: Review[]) => void;
}

const ReviewsComponent: React.FC<Props> = ({ reviews, setReviews }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isResponseModalOpen, setIsResponseModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [responseForm] = Form.useForm();
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);

  const submitReview = (values: Omit<Review, "id" | "response">) => {
    if (!values.rating) {
      message.error("Vui lòng chọn số sao đánh giá!");
      return;
    }
    const newReview: Review = { id: reviews.length + 1, ...values, response: "" };
    const updatedReviews = [...reviews, newReview];
    setReviews(updatedReviews);
    saveReviews(updatedReviews);
    setIsModalOpen(false);
    form.resetFields();
    message.success("Đánh giá đã được thêm!");
  };

  const submitResponse = (values: { response: string }) => {
    if (!selectedReview) return;
    const updatedReviews = reviews.map((review) =>
      review.id === selectedReview.id ? { ...review, response: values.response } : review
    );
    setReviews(updatedReviews);
    saveReviews(updatedReviews);
    setIsResponseModalOpen(false);
    responseForm.resetFields();
    message.success("Phản hồi đã được gửi!");
  };

  const columns = [
    { title: "Tên khách hàng", dataIndex: "customer", key: "customer" },
    { title: "Dịch vụ", dataIndex: "service", key: "service" },
    { title: "Nhân viên", dataIndex: "employee", key: "employee" },
    {
      title: "Đánh giá",
      dataIndex: "rating",
      key: "rating",
      render: (rating: number) => <Rate disabled defaultValue={rating} />,
    },
    { title: "Bình luận", dataIndex: "comment", key: "comment" },
    {
      title: "Phản hồi từ nhân viên",
      dataIndex: "response",
      key: "response",
      render: (response: string | undefined) => response || "Chưa phản hồi",
    },
    {
      title: "Hành động",
      key: "action",
      render: (_: any, record: Review) => (
        <Button
          type="link"
          onClick={() => {
            setSelectedReview(record);
            responseForm.setFieldsValue({ response: record.response || "" });
            setIsResponseModalOpen(true);
          }}
        >
          Phản hồi
        </Button>
      ),
    }
  ];

  return (
    <>
      <Button type="primary" onClick={() => { form.resetFields(); setIsModalOpen(true); }}>
        Viết đánh giá
      </Button>
      <Table dataSource={reviews} columns={columns} rowKey={(record) => record.id.toString()} style={{ marginTop: 20 }} />
      
      {reviews.length > 0 && (
        <>
          <h3>Đánh giá trung bình của nhân viên</h3>
          <Table
            dataSource={Array.from(new Set(reviews.map((r) => r.employee))).map((employee) => ({
              key: employee,
              employee,
              averageRating: calculateAverageRating(reviews, employee),
            }))}
            columns={[
              { title: "Nhân viên", dataIndex: "employee", key: "employee" },
              { title: "Đánh giá trung bình", dataIndex: "averageRating", key: "averageRating" },
            ]}
            rowKey="key"
          />
        </>
      )}

      {/* Modal Đánh giá */}
      <Modal title="Viết Đánh Giá" visible={isModalOpen} onCancel={() => setIsModalOpen(false)} onOk={() => form.submit()} okText="Gửi đánh giá" cancelText="Hủy">
        <Form form={form} onFinish={submitReview} layout="vertical">
          <Form.Item name="customer" label="Tên khách hàng" rules={[{ required: true, message: "Vui lòng nhập tên khách hàng!" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="service" label="Dịch vụ" rules={[{ required: true, message: "Vui lòng chọn dịch vụ!" }]}>
            <Select>{services.map((service) => (<Option key={service.value} value={service.value}>{service.label}</Option>))}</Select>
          </Form.Item>
          <Form.Item name="employee" label="Nhân viên" rules={[{ required: true, message: "Vui lòng chọn nhân viên!" }]}>
            <Select>{employees.map((employee) => (<Option key={employee.value} value={employee.value}>{employee.label}</Option>))}</Select>
          </Form.Item>
          <Form.Item name="rating" label="Đánh giá" rules={[{ required: true, message: "Vui lòng chọn đánh giá sao!" }]}>
            <Rate />
          </Form.Item>
          <Form.Item name="comment" label="Bình luận"><Input.TextArea /></Form.Item>
        </Form>
      </Modal>

      {/* Modal Phản hồi */}
      <Modal title="Phản hồi đánh giá" visible={isResponseModalOpen} onCancel={() => setIsResponseModalOpen(false)} onOk={() => responseForm.submit()} okText="Gửi phản hồi" cancelText="Hủy">
        <Form form={responseForm} onFinish={submitResponse} layout="vertical">
          <Form.Item name="response" label="Phản hồi" rules={[{ required: true, message: "Vui lòng nhập phản hồi!" }]}>
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ReviewsComponent;