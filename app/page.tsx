'use client';

import { useEffect, useState } from 'react';

interface DataItem {
  id: number;
  transactionID: number | string;
  エリア: string;
  予想比: number;
  予算: number;
  実績: number;
  月: number;
  製品名: string;
  見込: number;
  顧客名: string;
  createdAt: string | Date;
}

export default function Home() {
  const [data, setData] = useState<DataItem[]>([]);
  const [filteredData, setFilteredData] = useState<DataItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [transactionFilter, setTransactionFilter] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/getData');
        console.log('Fetch response:', res);
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

  useEffect(() => {
    let filtered = [...data];

    // Filter theo Transaction ID (partial match)
    if (transactionFilter) {
      filtered = filtered.filter((item) => {
        return String(item.transactionID).includes(transactionFilter);
      });
    }

    // Filter theo search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter((item) => {
        return (
          item.エリア.toLowerCase().includes(searchLower) ||
          item.製品名.toLowerCase().includes(searchLower) ||
          item.顧客名.toLowerCase().includes(searchLower) ||
          String(item.transactionID).includes(searchTerm)
        );
      });
    }

    setFilteredData(filtered);
  }, [searchTerm, transactionFilter, data]);

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('vi-VN').format(num);
  };

  const formatDate = (date: string | Date) => {
    if (!date) return '-';
    return new Date(date).toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="rounded-lg bg-red-50 p-6 text-center">
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">Dữ liệu từ Power Apps</h1>
          <p className="text-gray-600">Tổng số bản ghi: {filteredData.length} / {data.length}</p>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col gap-4 rounded-lg bg-white p-4 shadow-sm md:flex-row">
          <div className="flex-1">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Tìm kiếm (Khu vực, Sản phẩm, Khách hàng)
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Nhập từ khóa..."
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div className="flex-1">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Lọc theo Transaction ID
            </label>
            <input
              type="text"
              value={transactionFilter}
              onChange={(e) => setTransactionFilter(e.target.value)}
              placeholder="Nhập Transaction ID..."
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          {transactionFilter && (
            <div className="flex items-end">
              <button
                onClick={() => setTransactionFilter('')}
                className="rounded-md bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300"
              >
                Xóa filter
              </button>
            </div>
          )}
        </div>

        {/* Table */}
        {filteredData.length === 0 ? (
          <div className="rounded-lg bg-white p-8 text-center shadow-sm">
            <p className="text-gray-500">Không có dữ liệu</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg bg-white shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">
                    ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">
                    Transaction ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">
                    エリア
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-700">
                    予想比
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-700">
                    予算
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-700">
                    実績
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-700">
                    月
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">
                    製品名
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-700">
                    見込
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">
                    顧客名
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {filteredData.map((item, index) => (
                  <tr key={`${item.id}-${item.transactionID}-${index}-${item.月}-${item.エリア}`} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900">
                      {item.id}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm font-mono text-gray-600">
                      {String(item.transactionID)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900">
                      {item.エリア}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right text-sm text-gray-900">
                      {formatNumber(item.予想比)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right text-sm text-gray-900">
                      {formatNumber(item.予算)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right text-sm font-medium text-gray-900">
                      {formatNumber(item.実績)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-center text-sm text-gray-900">
                      {item.月}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">{item.製品名}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-right text-sm text-gray-900">
                      {formatNumber(item.見込)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">{item.顧客名}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
