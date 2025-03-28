import { useCallback, useState, useEffect } from 'react';
import { message } from 'antd';

export type FieldType = 'string' | 'number' | 'date';

export interface TruongThongTin {
  id: string;
  ten: string;
  ma: string;
  kieuDuLieu: FieldType;
  required: boolean;
  order: number;
  active: boolean;
}

// Storage key
const STORAGE_KEY = 'bieuMauVanBangList';

export default function useBieuMauVanBangModel() {
  const [loading, setLoading] = useState<boolean>(false);
  const [truongThongTinList, setTruongThongTinList] = useState<TruongThongTin[]>([]);
  const [currentTruongThongTin, setCurrentTruongThongTin] = useState<TruongThongTin | null>(null);

  // Load data from localStorage on init
  useEffect(() => {
    fetchTruongThongTinList();
  }, []);

  // Save data to localStorage whenever truongThongTinList changes
  useEffect(() => {
    if (truongThongTinList.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(truongThongTinList));
    }
  }, [truongThongTinList]);

  const fetchTruongThongTinList = useCallback(async () => {
    setLoading(true);
    try {
      // Try to get data from localStorage
      const storedData = localStorage.getItem(STORAGE_KEY);
      
      if (storedData) {
        setTruongThongTinList(JSON.parse(storedData));
      } else {
        // Use mock data if no stored data
        const mockData: TruongThongTin[] = [
          {
            id: '1',
            ten: 'Dân tộc',
            ma: 'dan_toc',
            kieuDuLieu: 'string',
            required: true,
            order: 1,
            active: true,
          },
          {
            id: '2',
            ten: 'Nơi sinh',
            ma: 'noi_sinh',
            kieuDuLieu: 'string',
            required: true,
            order: 2,
            active: true,
          },
          {
            id: '3',
            ten: 'Điểm trung bình',
            ma: 'diem_trung_binh',
            kieuDuLieu: 'number',
            required: true,
            order: 3,
            active: true,
          },
          {
            id: '4',
            ten: 'Xếp loại',
            ma: 'xep_loai',
            kieuDuLieu: 'string',
            required: true,
            order: 4,
            active: true,
          },
          {
            id: '5',
            ten: 'Ngày nhập học',
            ma: 'ngay_nhap_hoc',
            kieuDuLieu: 'date',
            required: false,
            order: 5,
            active: true,
          },
          {
            id: '6',
            ten: 'Hệ đào tạo',
            ma: 'he_dao_tao',
            kieuDuLieu: 'string',
            required: true,
            order: 6,
            active: true,
          }
        ];
        setTruongThongTinList(mockData);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(mockData));
      }
    } catch (error) {
      message.error('Lỗi khi tải danh sách trường thông tin');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const createTruongThongTin = useCallback(async (truongThongTin: Omit<TruongThongTin, 'id'>) => {
    setLoading(true);
    try {
      // Create new record
      const newTruongThongTin: TruongThongTin = {
        id: Math.random().toString(36).substring(2, 9),
        ...truongThongTin,
      };
      
      // Update state and localStorage
      const updatedList = [...truongThongTinList, newTruongThongTin];
      setTruongThongTinList(updatedList);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
      
      message.success('Tạo trường thông tin thành công');
      return newTruongThongTin;
    } catch (error) {
      message.error('Lỗi khi tạo trường thông tin');
      console.error(error);
      return null;
    } finally {
      setLoading(false);
    }
  }, [truongThongTinList]);

  const updateTruongThongTin = useCallback(async (id: string, data: Partial<TruongThongTin>) => {
    setLoading(true);
    try {
      // Update in state
      const updatedList = truongThongTinList.map(item => 
        item.id === id ? { ...item, ...data } : item
      );
      
      // Update state and localStorage
      setTruongThongTinList(updatedList);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
      
      message.success('Cập nhật trường thông tin thành công');
      return true;
    } catch (error) {
      message.error('Lỗi khi cập nhật trường thông tin');
      console.error(error);
      return false;
    } finally {
      setLoading(false);
    }
  }, [truongThongTinList]);

  const deleteTruongThongTin = useCallback(async (id: string) => {
    setLoading(true);
    try {
      // Delete from state
      const filteredList = truongThongTinList.filter(item => item.id !== id);
      
      // Update state and localStorage
      setTruongThongTinList(filteredList);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredList));
      
      message.success('Xóa trường thông tin thành công');
      return true;
    } catch (error) {
      message.error('Lỗi khi xóa trường thông tin');
      console.error(error);
      return false;
    } finally {
      setLoading(false);
    }
  }, [truongThongTinList]);

  const updateThuTu = useCallback(async (items: { id: string, order: number }[]) => {
    setLoading(true);
    try {
      // Create a copy of the current list
      const updatedList = [...truongThongTinList];
      
      // Update orders in the list
      items.forEach(({ id, order }) => {
        const index = updatedList.findIndex(item => item.id === id);
        if (index !== -1) {
          updatedList[index] = { ...updatedList[index], order };
        }
      });
      
      // Sort by order and update state + localStorage
      const sortedList = updatedList.sort((a, b) => a.order - b.order);
      setTruongThongTinList(sortedList);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sortedList));
      
      message.success('Cập nhật thứ tự thành công');
      return true;
    } catch (error) {
      message.error('Lỗi khi cập nhật thứ tự');
      console.error(error);
      return false;
    } finally {
      setLoading(false);
    }
  }, [truongThongTinList]);

  const getActiveTruongThongTin = useCallback(() => {
    return truongThongTinList.filter(item => item.active).sort((a, b) => a.order - b.order);
  }, [truongThongTinList]);

  return {
    loading,
    truongThongTinList,
    currentTruongThongTin,
    setCurrentTruongThongTin,
    fetchTruongThongTinList,
    createTruongThongTin,
    updateTruongThongTin,
    deleteTruongThongTin,
    updateThuTu,
    getActiveTruongThongTin,
  };
} 