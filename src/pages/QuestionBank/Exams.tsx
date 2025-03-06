import { useState, useEffect } from "react";
import { Card, Input, Button, List, message, Typography } from "antd";

const { TextArea } = Input;
const { Title } = Typography;

const Exams = () => {
  const [questions, setQuestions] = useState([]);
  const [examStructure, setExamStructure] = useState("");
  const [exam, setExam] = useState([]);

  useEffect(() => {
    const storedQuestions = localStorage.getItem("questions");
    if (storedQuestions) {
      setQuestions(JSON.parse(storedQuestions));
    }
    const storedExamStructure = localStorage.getItem("examStructure");
    if (storedExamStructure) {
      setExamStructure(storedExamStructure);
    }
    const storedExam = localStorage.getItem("exam");
    if (storedExam) {
      setExam(JSON.parse(storedExam));
    }
  }, []);

  const handleCreateExam = () => {
    let parsedStructure;
    try {
      parsedStructure = JSON.parse(examStructure);
    } catch (error) {
      message.error("Cấu trúc đề thi không hợp lệ!");
      return;
    }

    if (!parsedStructure || Object.keys(parsedStructure).length === 0) {
      message.error("Cấu trúc đề thi chưa được thiết lập!");
      return;
    }

    let selectedQuestions = [];
    let hasError = false;

    Object.keys(parsedStructure).forEach((subject) => {
      Object.keys(parsedStructure[subject]).forEach((difficulty) => {
        Object.keys(parsedStructure[subject][difficulty]).forEach((knowledgeBlock) => {
          let filtered = questions.filter(
            (q) =>
              q.subject === subject &&
              q.difficulty === difficulty &&
              q.knowledgeBlock === knowledgeBlock
          );

          const requiredCount = parsedStructure[subject][difficulty][knowledgeBlock];

          if (filtered.length < requiredCount) {
            message.error(`Không đủ ${requiredCount} câu hỏi mức ${difficulty} của môn ${subject} trong khối ${knowledgeBlock}`);
            hasError = true;
          } else {
            selectedQuestions = selectedQuestions.concat(filtered.slice(0, requiredCount));
          }
        });
      });
    });

    if (hasError) return;

    setExam(selectedQuestions);
    message.success("Đề thi đã được tạo thành công!");
    localStorage.setItem("exam", JSON.stringify(selectedQuestions));
  };

  const handleSaveStructure = () => {
    try {
      JSON.parse(examStructure);
      localStorage.setItem("examStructure", examStructure);
      message.success("Cấu trúc đề thi đã được lưu!");
    } catch (error) {
      message.error("Cấu trúc nhập vào không hợp lệ!");
    }
  };

  return (
    <Card title={<Title level={4}>📚 Tạo đề thi</Title>} style={{ maxWidth: 800, margin: "auto" }}>
      <TextArea
        rows={4}
        placeholder='Nhập cấu trúc đề thi dưới dạng JSON (Ví dụ: {"Toán": {"Dễ": {"Đại số": 2, "Hình học": 3}}})'
        value={examStructure}
        onChange={(e) => setExamStructure(e.target.value)}
      />
      <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
        <Button type="primary" onClick={handleCreateExam}>
          Tạo đề thi
        </Button>
        <Button onClick={handleSaveStructure}>Lưu cấu trúc</Button>
      </div>

      <List
        bordered
        style={{ marginTop: 20 }}
        header={<b>📜 Đề thi</b>}
        dataSource={exam}
        renderItem={(q) => (
          <List.Item>
            <b>[{q.difficulty}]</b> {q.text} - <i>({q.subject} - {q.knowledgeBlock})</i>
          </List.Item>
        )}
      />
    </Card>
  );
};

export default Exams;
