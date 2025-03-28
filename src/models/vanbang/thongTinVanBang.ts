import { useCallback, useState, useEffect } from 'react';
import { message } from 'antd';
import type { QuyetDinhTotNghiep } from './quyetDinhTotNghiep';
import type { SoVanBang } from './soVanBang';
import type { TruongThongTin } from './bieuMauVanBang';

export interface ThongTinVanBang {
  id: string;
  soVaoSo: number;
  soHieuVanBang: string;
  maSinhVien: string;
  hoTen: string;
  ngaySinh: string;
  quyetDinhId: string;
  quyetDinh?: QuyetDinhTotNghiep;
  soVanBangId: string;
  soVanBang?: SoVanBang;
  ngayTao: string;
  ngayCapNhat?: string;
  thongTinMoRong: Record<string, string | number | Date>;
}

export interface ThongTinVanBangSearchParams {
  soHieuVanBang?: string;
  soVaoSo?: number;
  maSinhVien?: string;
  hoTen?: string;
  ngaySinh?: string;
  quyetDinhId?: string;
  soVanBangId?: string;
}

// Storage key
const STORAGE_KEY = 'thongTinVanBangList';

export default function useThongTinVanBangModel() {
  const [loading, setLoading] = useState<boolean>(false);
  const [vanBangList, setVanBangList] = useState<ThongTinVanBang[]>([]);
  const [currentVanBang, setCurrentVanBang] = useState<ThongTinVanBang | null>(null);

  // Load data from localStorage on init
  useEffect(() => {
    fetchVanBangList();
  }, []);

  // Save data to localStorage whenever vanBangList changes
  useEffect(() => {
    if (vanBangList.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(vanBangList));
    }
  }, [vanBangList]);

  const fetchVanBangList = useCallback(async (params?: ThongTinVanBangSearchParams) => {
    setLoading(true);
    try {
      // Try to get data from localStorage
      const storedData = localStorage.getItem(STORAGE_KEY);
      let data: ThongTinVanBang[] = [];
      
      if (storedData) {
        data = JSON.parse(storedData);
      } else {
        // Use mock data if no stored data
        data = [
          {
            id: '1',
            soVaoSo: 1,
            soHieuVanBang: 'B001/2023',
            maSinhVien: 'SV001',
            hoTen: 'Nguyễn Văn A',
            ngaySinh: '2000-05-15',
            quyetDinhId: '1',
            soVanBangId: '1',
            ngayTao: '2023-05-20',
            thongTinMoRong: {
              dan_toc: 'Kinh',
              noi_sinh: 'Hà Nội',
              diem_trung_binh: 8.5,
              xep_loai: 'Giỏi',
              he_dao_tao: 'Chính quy',
            },
          },
          {
            id: '2',
            soVaoSo: 2,
            soHieuVanBang: 'B002/2023',
            maSinhVien: 'SV002',
            hoTen: 'Trần Thị B',
            ngaySinh: '1999-10-20',
            quyetDinhId: '1',
            soVanBangId: '1',
            ngayTao: '2023-05-20',
            thongTinMoRong: {
              dan_toc: 'Kinh',
              noi_sinh: 'Hải Phòng',
              diem_trung_binh: 9.2,
              xep_loai: 'Xuất sắc',
              he_dao_tao: 'Chính quy',
            },
          },
          {
            id: '3',
            soVaoSo: 3,
            soHieuVanBang: 'B003/2023',
            maSinhVien: 'SV003',
            hoTen: 'Lê Văn C',
            ngaySinh: '2001-03-12',
            quyetDinhId: '2',
            soVanBangId: '1',
            ngayTao: '2023-09-25',
            thongTinMoRong: {
              dan_toc: 'Kinh',
              noi_sinh: 'TP. Hồ Chí Minh',
              diem_trung_binh: 7.8,
              xep_loai: 'Khá',
              he_dao_tao: 'Chính quy',
            },
          },
        ];
        
        // Save mock data to localStorage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      }

      // Filter data based on search params
      if (params) {
        let filteredData = [...data];
        
        if (params.soHieuVanBang) {
          filteredData = filteredData.filter(item => 
            item.soHieuVanBang.toLowerCase().includes(params.soHieuVanBang!.toLowerCase())
          );
        }
        if (params.soVaoSo) {
          filteredData = filteredData.filter(item => item.soVaoSo === params.soVaoSo);
        }
        if (params.maSinhVien) {
          filteredData = filteredData.filter(item => 
            item.maSinhVien.toLowerCase().includes(params.maSinhVien!.toLowerCase())
          );
        }
        if (params.hoTen) {
          filteredData = filteredData.filter(item => 
            item.hoTen.toLowerCase().includes(params.hoTen!.toLowerCase())
          );
        }
        if (params.ngaySinh) {
          filteredData = filteredData.filter(item => item.ngaySinh === params.ngaySinh);
        }
        if (params.quyetDinhId) {
          filteredData = filteredData.filter(item => item.quyetDinhId === params.quyetDinhId);
        }
        if (params.soVanBangId) {
          filteredData = filteredData.filter(item => item.soVanBangId === params.soVanBangId);
        }
        
        setVanBangList(filteredData);
      } else {
        setVanBangList(data);
      }
    } catch (error) {
      message.error('Lỗi khi tải danh sách văn bằng');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const createVanBang = useCallback(async (
    vanBang: Omit<ThongTinVanBang, 'id' | 'ngayTao' | 'soVaoSo'>,
    soVanBangId: string,
    truongThongTin: TruongThongTin[],
  ) => {
    setLoading(true);
    try {
      // Thêm giá trị mặc định cho các trường bắt buộc
      const updatedThongTinMoRong = { ...vanBang.thongTinMoRong };
      
      for (const field of truongThongTin) {
        if (field.required && (updatedThongTinMoRong[field.ma] === undefined || updatedThongTinMoRong[field.ma] === '')) {
          // Đặt giá trị mặc định dựa trên kiểu dữ liệu
          switch (field.kieuDuLieu) {
            case 'number':
              updatedThongTinMoRong[field.ma] = 0;
              break;
            case 'date':
              updatedThongTinMoRong[field.ma] = new Date().toISOString().split('T')[0];
              break;
            default:
              updatedThongTinMoRong[field.ma] = 'Chưa cập nhật';
              break;
          }
        }
      }

      // Get all data from localStorage
      const storedData = localStorage.getItem(STORAGE_KEY);
      const allData: ThongTinVanBang[] = storedData ? JSON.parse(storedData) : [];
      
      // Generate new soVaoSo based on soVanBangId
      const soVanBangItems = allData.filter(item => item.soVanBangId === soVanBangId);
      const mockLatestSoVaoSo = soVanBangItems.length > 0 
        ? Math.max(...soVanBangItems.map(item => item.soVaoSo))
        : 0;
      
      const newSoVaoSo = mockLatestSoVaoSo + 1;

      // Generate new vanBang with updated thongTinMoRong
      const newVanBang: ThongTinVanBang = {
        id: Math.random().toString(36).substring(2, 9),
        soVaoSo: newSoVaoSo,
        ngayTao: new Date().toISOString().split('T')[0],
        ...vanBang,
        thongTinMoRong: updatedThongTinMoRong,
      };

      // Update all data in localStorage
      const updatedAllData = [...allData, newVanBang];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedAllData));
      
      // Update current filtered view
      setVanBangList([...vanBangList, newVanBang]);
      
      message.success('Tạo thông tin văn bằng thành công');
      return newVanBang;
    } catch (error) {
      message.error('Lỗi khi tạo thông tin văn bằng');
      console.error(error);
      return null;
    } finally {
      setLoading(false);
    }
  }, [vanBangList]);

  const updateVanBang = useCallback(async (
    id: string, 
    data: Partial<Omit<ThongTinVanBang, 'soVaoSo' | 'soVanBangId'>>,
    truongThongTin: TruongThongTin[],
  ) => {
    setLoading(true);
    try {
      // Get all data from localStorage
      const storedData = localStorage.getItem(STORAGE_KEY);
      const allData: ThongTinVanBang[] = storedData ? JSON.parse(storedData) : [];
      
      // Find the record to update
      const existingRecord = allData.find(item => item.id === id);
      if (!existingRecord) {
        message.error('Không tìm thấy thông tin văn bằng cần cập nhật');
        return false;
      }
      
      // Thêm giá trị mặc định cho các trường bắt buộc trong thongTinMoRong
      let updatedThongTinMoRong = { ...existingRecord.thongTinMoRong };
      
      if (data.thongTinMoRong) {
        updatedThongTinMoRong = { ...updatedThongTinMoRong, ...data.thongTinMoRong };
      }
      
      for (const field of truongThongTin) {
        if (field.required && (updatedThongTinMoRong[field.ma] === undefined || updatedThongTinMoRong[field.ma] === '')) {
          // Đặt giá trị mặc định dựa trên kiểu dữ liệu
          switch (field.kieuDuLieu) {
            case 'number':
              updatedThongTinMoRong[field.ma] = 0;
              break;
            case 'date':
              updatedThongTinMoRong[field.ma] = new Date().toISOString().split('T')[0];
              break;
            default:
              updatedThongTinMoRong[field.ma] = 'Chưa cập nhật';
              break;
          }
        }
      }
      
      // Update record in all data
      const updatedAllData = allData.map(item => 
        item.id === id ? { 
          ...item, 
          ...data,
          ngayCapNhat: new Date().toISOString().split('T')[0],
          thongTinMoRong: updatedThongTinMoRong,
        } : item
      );
      
      // Save to localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedAllData));
      
      // Update current filtered view
      const updatedList = vanBangList.map(item => 
        item.id === id ? { 
          ...item, 
          ...data,
          ngayCapNhat: new Date().toISOString().split('T')[0],
          thongTinMoRong: updatedThongTinMoRong,
        } : item
      );
      
      setVanBangList(updatedList);
      
      message.success('Cập nhật thông tin văn bằng thành công');
      return true;
    } catch (error) {
      message.error('Lỗi khi cập nhật thông tin văn bằng');
      console.error(error);
      return false;
    } finally {
      setLoading(false);
    }
  }, [vanBangList]);

  const deleteVanBang = useCallback(async (id: string) => {
    setLoading(true);
    try {
      // Get all data from localStorage
      const storedData = localStorage.getItem(STORAGE_KEY);
      const allData: ThongTinVanBang[] = storedData ? JSON.parse(storedData) : [];
      
      // Delete from all data
      const updatedAllData = allData.filter(item => item.id !== id);
      
      // Save to localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedAllData));
      
      // Update current filtered view
      const filteredList = vanBangList.filter(item => item.id !== id);
      setVanBangList(filteredList);
      
      message.success('Xóa thông tin văn bằng thành công');
      return true;
    } catch (error) {
      message.error('Lỗi khi xóa thông tin văn bằng');
      console.error(error);
      return false;
    } finally {
      setLoading(false);
    }
  }, [vanBangList]);

  const searchVanBang = useCallback(async (params: ThongTinVanBangSearchParams) => {
    // Check if at least 2 search parameters are provided
    const paramValues = Object.values(params).filter(value => value !== undefined && value !== '');
    if (paramValues.length < 2) {
      message.error('Vui lòng nhập ít nhất 2 điều kiện tìm kiếm');
      return [];
    }

    await fetchVanBangList(params);
    return vanBangList;
  }, [fetchVanBangList, vanBangList]);

  return {
    loading,
    vanBangList,
    currentVanBang,
    setCurrentVanBang,
    fetchVanBangList,
    createVanBang,
    updateVanBang,
    deleteVanBang,
    searchVanBang,
  };
} 