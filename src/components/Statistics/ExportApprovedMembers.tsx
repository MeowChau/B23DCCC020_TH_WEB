import React from 'react';
import { Button } from 'antd';

const ExportApprovedMembers: React.FC = () => {
  const handleExport = () => {
    // Lấy danh sách câu lạc bộ từ localStorage
    const storedClubs = JSON.parse(localStorage.getItem('clubs') || '[]');

    // Kiểm tra nếu không có dữ liệu
    if (!Array.isArray(storedClubs) || storedClubs.length === 0) {
      alert('Không có dữ liệu để xuất.');
      return;
    }

    // Tạo dữ liệu CSV
    const rows = [
      ['Tên CLB', 'Họ tên', 'Email', 'Số điện thoại'], // Header
      ...storedClubs.reduce((acc, club) => {
        const approvedMembers = (club.members || [])
          .filter((member: any) => member.status === 'approved')
          .map((member: any) => [club.name, member.name, member.email, member.phone]);
        return acc.concat(approvedMembers);
      }, [] as string[][]),
    ];

    // Chuyển dữ liệu thành chuỗi CSV
    const csvContent = rows.map((row) => row.join(',')).join('\n');

    // Tạo file và tải xuống
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'ApprovedMembers.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Button type="primary" onClick={handleExport}>
      Xuất danh sách thành viên
    </Button>
  );
};

export default ExportApprovedMembers;