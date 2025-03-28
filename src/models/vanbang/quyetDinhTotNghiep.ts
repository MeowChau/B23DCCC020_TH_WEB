import { useCallback, useState, useEffect } from 'react';
import { message } from 'antd';
import type { SoVanBang } from './soVanBang';

export interface QuyetDinhTotNghiep {
  id: string;
  soQuyetDinh: string;
  ngayBanHanh: string;
  trichYeu: string;
  soVanBangId: string;
  soVanBang?: SoVanBang;
  ngayTao: string;
  luotTraCuu: number;
}

const STORAGE_KEY = 'quyetDinhTotNghiepList';

export default function useQuyetDinhTotNghiepModel() {
  const [loading, setLoading] = useState<boolean>(false);
  const [quyetDinhList, setQuyetDinhList] = useState<QuyetDinhTotNghiep[]>([]);
  const [currentQuyetDinh, setCurrentQuyetDinh] = useState<QuyetDinhTotNghiep | null>(null);

  // Load data from localStorage on init
  useEffect(() => {
    fetchQuyetDinhList();
  }, []);

  // Save data to localStorage whenever quyetDinhList changes
  useEffect(() => {
    if (quyetDinhList.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(quyetDinhList));
    }
  }, [quyetDinhList]);

  const fetchQuyetDinhList = useCallback(async (soVanBangId?: string) => {
    setLoading(true);
    try {
      // Try to get data from localStorage
      const storedData = localStorage.getItem(STORAGE_KEY);
      let data: QuyetDinhTotNghiep[] = [];
      
      if (storedData) {
        data = JSON.parse(storedData);
      } else {
        // Use mock data if no stored data
        data = [
          {
            id: '1',
            soQuyetDinh: 'QĐ-123/2023',
            ngayBanHanh: '2023-05-15',
            trichYeu: 'Quyết định công nhận tốt nghiệp đợt 1/2023',
            soVanBangId: '1',
            ngayTao: '2023-05-10',
            luotTraCuu: 45,
          },
          {
            id: '2',
            soQuyetDinh: 'QĐ-456/2023',
            ngayBanHanh: '2023-09-20',
            trichYeu: 'Quyết định công nhận tốt nghiệp đợt 2/2023',
            soVanBangId: '1',
            ngayTao: '2023-09-15',
            luotTraCuu: 28,
          },
          {
            id: '3',
            soQuyetDinh: 'QĐ-789/2022',
            ngayBanHanh: '2022-12-15',
            trichYeu: 'Quyết định công nhận tốt nghiệp đợt 3/2022',
            soVanBangId: '2',
            ngayTao: '2022-12-10',
            luotTraCuu: 120,
          },
        ];
        
        // Save mock data to localStorage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      }

      if (soVanBangId) {
        const filtered = data.filter(item => item.soVanBangId === soVanBangId);
        setQuyetDinhList(filtered);
      } else {
        setQuyetDinhList(data);
      }
    } catch (error) {
      message.error('Lỗi khi tải danh sách quyết định tốt nghiệp');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const createQuyetDinh = useCallback(async (quyetDinh: Omit<QuyetDinhTotNghiep, 'id' | 'ngayTao' | 'luotTraCuu'>) => {
    setLoading(true);
    try {
      // Get all data from localStorage to ensure we don't lose any
      const storedData = localStorage.getItem(STORAGE_KEY);
      const allData: QuyetDinhTotNghiep[] = storedData ? JSON.parse(storedData) : [];
      
      // Create new record
      const newQuyetDinh: QuyetDinhTotNghiep = {
        id: Math.random().toString(36).substring(2, 9),
        ngayTao: new Date().toISOString().split('T')[0],
        luotTraCuu: 0,
        ...quyetDinh,
      };
      
      // Add to all data and save to localStorage
      const updatedAllData = [...allData, newQuyetDinh];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedAllData));
      
      
      const updatedList = [...quyetDinhList, newQuyetDinh];
      setQuyetDinhList(updatedList);
      
      message.success('Tạo quyết định tốt nghiệp thành công');
      return newQuyetDinh;
    } catch (error) {
      message.error('Lỗi khi tạo quyết định tốt nghiệp');
      console.error(error);
      return null;
    } finally {
      setLoading(false);
    }
  }, [quyetDinhList]);

  const updateQuyetDinh = useCallback(async (id: string, data: Partial<QuyetDinhTotNghiep>) => {
    setLoading(true);
    try {
      
      const storedData = localStorage.getItem(STORAGE_KEY);
      const allData: QuyetDinhTotNghiep[] = storedData ? JSON.parse(storedData) : [];
      
      
      const updatedAllData = allData.map(item => 
        item.id === id ? { ...item, ...data } : item
      );
      
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedAllData));
      
     
      const updatedList = quyetDinhList.map(item => 
        item.id === id ? { ...item, ...data } : item
      );
      setQuyetDinhList(updatedList);
      
      message.success('Cập nhật quyết định tốt nghiệp thành công');
      return true;
    } catch (error) {
      message.error('Lỗi khi cập nhật quyết định tốt nghiệp');
      console.error(error);
      return false;
    } finally {
      setLoading(false);
    }
  }, [quyetDinhList]);

  const deleteQuyetDinh = useCallback(async (id: string) => {
    setLoading(true);
    try {
     
      const storedData = localStorage.getItem(STORAGE_KEY);
      const allData: QuyetDinhTotNghiep[] = storedData ? JSON.parse(storedData) : [];
      
    
      const updatedAllData = allData.filter(item => item.id !== id);
      
     
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedAllData));
      
      const filteredList = quyetDinhList.filter(item => item.id !== id);
      setQuyetDinhList(filteredList);
      
      message.success('Xóa quyết định tốt nghiệp thành công');
      return true;
    } catch (error) {
      message.error('Lỗi khi xóa quyết định tốt nghiệp');
      console.error(error);
      return false;
    } finally {
      setLoading(false);
    }
  }, [quyetDinhList]);

  const incrementLuotTraCuu = useCallback(async (id: string) => {
    const storedData = localStorage.getItem(STORAGE_KEY);
    const allData: QuyetDinhTotNghiep[] = storedData ? JSON.parse(storedData) : [];
    
    const item = allData.find(item => item.id === id);
    if (!item) return false;
    
  
    return updateQuyetDinh(id, { luotTraCuu: item.luotTraCuu + 1 });
  }, [updateQuyetDinh]);

  return {
    loading,
    quyetDinhList,
    currentQuyetDinh,
    setCurrentQuyetDinh,
    fetchQuyetDinhList,
    createQuyetDinh,
    updateQuyetDinh,
    deleteQuyetDinh,
    incrementLuotTraCuu,
  };
} 