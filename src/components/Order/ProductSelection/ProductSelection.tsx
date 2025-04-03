import React, { useState } from 'react';
import { Select } from 'antd';
import type { Product } from '../../../models/Order';

const { Option } = Select;

interface ProductSelectionProps {
  products: Product[];
  selectedProducts: Product[];
  onSelect: (productId: string) => void;
}

const ProductSelection: React.FC<ProductSelectionProps> = ({
  products,
  selectedProducts,
  onSelect,
}) => {
  const [searchText, setSearchText] = useState('');

  return (
    <Select
      showSearch
      placeholder="Tìm kiếm sản phẩm"
      value={null}
      onChange={onSelect}
      onSearch={setSearchText}
      filterOption={(input, option) =>
        typeof option?.children === 'string' &&
        (option.children as string).toLowerCase().includes(input.toLowerCase())
      }
      style={{ width: '100%', marginBottom: 16 }}
    >
      {products
        .filter(
          (product) =>
            !selectedProducts.some((p) => p.id === product.id) &&
            product.name.toLowerCase().includes(searchText.toLowerCase()),
        )
        .map((product) => (
          <Option key={product.id} value={product.id}>
            {product.name} - {product.price.toLocaleString()} VND
          </Option>
        ))}
    </Select>
  );
};

export default ProductSelection;