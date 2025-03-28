import { useCallback, useState, useEffect } from 'react';
import { message } from 'antd';
import { useModel } from 'umi';

export interface SoVanBang {
  id: string;
  nam: number;
  ten: string;
  moTa?: string;
  soVaoSoHienTai: number;
  ngayTao: string;
  trangThai: 'active' | 'closed';
}

// Storage key
const STORAGE_KEY = 'soVanBangList';

export default function useSoVanBangModel() {
  const [loading, setLoading] = useState<boolean>(false);
  const [soVanBangList, setSoVanBangList] = useState<SoVanBang[]>([]);
  const [currentSoVanBang, setCurrentSoVanBang] = useState<SoVanBang | null>(null);

  // Load data from localStorage on init
  useEffect(() => {
    fetchSoVanBangList();
  }, []);

  // Save data to localStorage whenever soVanBangList changes
  useEffect(() => {
    if (soVanBangList.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(soVanBangList));
    }
  }, [soVanBangList]);

  const fetchSoVanBangList = useCallback(async () => {
    setLoading(true);
    try {
      // Try to get data from localStorage
      const storedData = localStorage.getItem(STORAGE_KEY);
      
      if (storedData) {
        setSoVanBangList(JSON.parse(storedData));
      } else {
        // Use mock data if no stored data
        const mockData: SoVanBang[] = [
          {
            id: '1',
            nam: 2023,
            ten: 'Sổ văn bằng 2023',
            moTa: 'Sổ văn bằng năm 2023',
            soVaoSoHienTai: 120,
            ngayTao: '2023-01-01',
            trangThai: 'active',
          },
          {
            id: '2',
            nam: 2022,
            ten: 'Sổ văn bằng 2022',
            moTa: 'Sổ văn bằng năm 2022',
            soVaoSoHienTai: 245,
            ngayTao: '2022-01-01',
            trangThai: 'closed',
          },
        ];
        setSoVanBangList(mockData);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(mockData));
      }
    } catch (error) {
      message.error('Lỗi khi tải danh sách sổ văn bằng');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const createSoVanBang = useCallback(async (soVanBang: Omit<SoVanBang, 'id' | 'soVaoSoHienTai' | 'ngayTao'>) => {
    setLoading(true);
    try {
      // Create new record
      const newSoVanBang: SoVanBang = {
        id: Math.random().toString(36).substring(2, 9),
        soVaoSoHienTai: 0,
        ngayTao: new Date().toISOString().split('T')[0],
        ...soVanBang,
      };
      
      // Update state
      const updatedList = [...soVanBangList, newSoVanBang];
      setSoVanBangList(updatedList);
      
      // Save to localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
      
      message.success('Tạo sổ văn bằng thành công');
      return newSoVanBang;
    } catch (error) {
      message.error('Lỗi khi tạo sổ văn bằng');
      console.error(error);
      return null;
    } finally {
      setLoading(false);
    }
  }, [soVanBangList]);

  const updateSoVanBang = useCallback(async (id: string, data: Partial<SoVanBang>) => {
    setLoading(true);
    try {
      // Update record
      const updatedList = soVanBangList.map(item => 
        item.id === id ? { ...item, ...data } : item
      );
      
      // Update state
      setSoVanBangList(updatedList);
      
      // Save to localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
      
      message.success('Cập nhật sổ văn bằng thành công');
      return true;
    } catch (error) {
      message.error('Lỗi khi cập nhật sổ văn bằng');
      console.error(error);
      return false;
    } finally {
      setLoading(false);
    }
  }, [soVanBangList]);

  const closeSoVanBang = useCallback(async (id: string) => {
    return updateSoVanBang(id, { trangThai: 'closed' });
  }, [updateSoVanBang]);

  const openSoVanBang = useCallback(async (id: string) => {
    // Kiểm tra xem đã có sổ nào đang active chưa
    const hasActiveBook = soVanBangList.some(item => item.trangThai === 'active');
    
    if (hasActiveBook) {
      message.warning('Đã có sổ văn bằng đang hoạt động. Vui lòng đóng sổ hiện tại trước khi mở sổ mới.');
      return false;
    }
    
    return updateSoVanBang(id, { trangThai: 'active' });
  }, [soVanBangList, updateSoVanBang]);

  const getActiveSoVanBang = useCallback(() => {
    return soVanBangList.find(item => item.trangThai === 'active') || null;
  }, [soVanBangList]);

  const incrementSoVaoSo = useCallback(async (soVanBangId: string) => {
    const soVanBang = soVanBangList.find(item => item.id === soVanBangId);
    if (!soVanBang) return null;
    
    const newSoVaoSo = soVanBang.soVaoSoHienTai + 1;
    const success = await updateSoVanBang(soVanBangId, { soVaoSoHienTai: newSoVaoSo });
    return success ? newSoVaoSo : null;
  }, [soVanBangList, updateSoVanBang]);

  return {
    loading,
    soVanBangList,
    currentSoVanBang,
    setCurrentSoVanBang,
    fetchSoVanBangList,
    createSoVanBang,
    updateSoVanBang,
    closeSoVanBang,
    openSoVanBang,
    getActiveSoVanBang,
    incrementSoVaoSo,
  };
} 