import axios from 'axios';

const request = async <T>(url: string, options?: any): Promise<T> => {
  try {
    const response = await axios({
      url,
      method: options?.method || 'GET',
      data: options?.data,
      params: options?.params,
      responseType: options?.responseType,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default request;