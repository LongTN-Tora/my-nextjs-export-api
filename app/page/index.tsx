interface DataItem {
  id: number;
  エリア: string; // Area
  予想比: number; // Forecast Ratio
  予算: number; // Budget
  実績: number; // Actual
  月: number; // Month
  製品名: string; // Product Name
  見込: number; // Outlook
  顧客名: string; // Customer Name
  created_at?: string;
}

import { useEffect, useState } from 'react';

const Home = () => {
  const [data, setData] = useState<DataItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/getData');
        if (!res.ok) {
          throw new Error('Failed to fetch data');
        }
        const result = await res.json();
        setData(result);
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Không thể tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>Đang tải dữ liệu...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Dữ liệu từ Power Apps</h1>
      {data.length === 0 ? (
        <p>Không có dữ liệu</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f3f4f6' }}>
                <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>ID</th>
                <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>エリア (Khu vực)</th>
                <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>予想比 (Tỷ lệ dự báo)</th>
                <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>予算 (Ngân sách)</th>
                <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>実績 (Thực tế)</th>
                <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>月 (Tháng)</th>
                <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>製品名 (Tên sản phẩm)</th>
                <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>見込 (Triển vọng)</th>
                <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>顧客名 (Tên khách hàng)</th>
                <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Ngày tạo</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.id} style={{ backgroundColor: '#fff' }}>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{item.id}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{item.エリア}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{item.予想比}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{item.予算}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{item.実績}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{item.月}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{item.製品名}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{item.見込}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{item.顧客名}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                    {item.created_at ? new Date(item.created_at).toLocaleString('vi-VN') : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Home;
