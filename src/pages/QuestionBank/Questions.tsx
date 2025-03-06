import { useState, useEffect } from "react";
import { Card, Select, Input, List } from "antd";

const { Option } = Select;

interface Question {
  id: number;
  subject: string;
  text: string;
  difficulty: string;
  category: string;
}

const defaultQuestions: Question[] = [
  { id: 1, subject: "Giải tích", text: "Định nghĩa đạo hàm của một hàm số?", difficulty: "Dễ", category: "Đạo hàm" },
  { id: 2, subject: "Giải tích", text: "Phát biểu và chứng minh định lý giá trị trung bình?", difficulty: "Khó", category: "Giá trị trung bình" },
  { id: 3, subject: "Giải tích", text: "Giải phương trình vi phân y' + y = 0?", difficulty: "Trung bình", category: "Phương trình vi phân" },
  { id: 4, subject: "Giải tích", text: "Khảo sát sự hội tụ của chuỗi số dương?", difficulty: "Rất khó", category: "Chuỗi số" },
  { id: 5, subject: "Giải tích", text: "Tính tích phân xác định bằng phương pháp đổi biến?", difficulty: "Trung bình", category: "Tích phân" }
];

const Questions = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [searchText, setSearchText] = useState<string>("");

  useEffect(() => {
    // Đọc dữ liệu từ localStorage, kiểm tra nếu null thì gán mảng mặc định
    const storedQuestions = localStorage.getItem("questions");
    if (storedQuestions) {
      try {
        setQuestions(JSON.parse(storedQuestions) as Question[]);
      } catch (error) {
        console.error("Lỗi khi parse JSON từ localStorage:", error);
        localStorage.setItem("questions", JSON.stringify(defaultQuestions));
        setQuestions(defaultQuestions);
      }
    } else {
      localStorage.setItem("questions", JSON.stringify(defaultQuestions));
      setQuestions(defaultQuestions);
    }
  }, []);

  useEffect(() => {
    let filtered = [...questions];
    if (selectedSubject) {
      filtered = filtered.filter(q => q.subject === selectedSubject);
    }
    if (selectedDifficulty) {
      filtered = filtered.filter(q => q.difficulty === selectedDifficulty);
    }
    if (searchText.trim()) {
      filtered = filtered.filter(q => q.text.toLowerCase().includes(searchText.toLowerCase()));
    }
    setFilteredQuestions(filtered);
  }, [questions, selectedSubject, selectedDifficulty, searchText]);

  return (
    <Card title="❓ Quản lý câu hỏi" style={{ maxWidth: 800, margin: "auto" }}>
      <div style={{ marginBottom: 16 }}>
        <Select
          placeholder="Chọn môn học"
          allowClear
          style={{ width: 200, marginRight: 10 }}
          onChange={(value) => setSelectedSubject(value || null)}
        >
          <Option value="Giải tích">Giải tích</Option>
          <Option value="Xác suất thống kê">Xác suất thống kê</Option>
          <Option value="Pháp luật đại cương">Pháp luật đại cương</Option>
          <Option value="Kinh tế chính trị">Kinh tế chính trị</Option>
        </Select>

        <Select
          placeholder="Chọn mức độ khó"
          allowClear
          style={{ width: 200, marginRight: 10 }}
          onChange={(value) => setSelectedDifficulty(value || null)}
        >
          <Option value="Dễ">Dễ</Option>
          <Option value="Trung bình">Trung bình</Option>
          <Option value="Khó">Khó</Option>
          <Option value="Rất khó">Rất khó</Option>
        </Select>

        <Input
          placeholder="Tìm kiếm theo nội dung"
          style={{ width: 200 }}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      <List
        dataSource={filteredQuestions}
        renderItem={(q) => (
          <List.Item>
            <b>[{q.difficulty}]</b> {q.text} - <i>({q.category})</i>
          </List.Item>
        )}
      />
    </Card>
  );
};

export default Questions;
