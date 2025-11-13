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

export default function ScreenPage() {
  const [data, setData] = useState<DataItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [transactionID, setTransactionID] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const tid = urlParams.get('transactionID');
      setTransactionID(tid);
    }
  }, []);

  useEffect(() => {
    if (!transactionID) {
      setLoading(false);
      setError('Transaction ID not found in URL');
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/getData?transactionID=${transactionID}`);
        if (!res.ok) {
          throw new Error('Failed to fetch data');
        }
        const result = await res.json();
        setData(result);
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Unable to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [transactionID]);

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @media print {
        body * {
          visibility: hidden;
        }
        .print-content,
        .print-content * {
          visibility: visible;
        }
        .print-content {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
        }
        .no-print {
          display: none !important;
        }
        .print-content table {
          border-collapse: collapse;
        }
        .print-content th,
        .print-content td {
          border: 1px solid #ddd;
          padding: 8px;
        }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('vi-VN').format(num);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="text-gray-600">Loading data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="rounded-lg bg-red-50 p-6 text-center">
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
          >
            try again
          </button>
        </div>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex items-center justify-between no-print">
            <div>
              <h1 className="mb-2 text-3xl font-bold text-gray-900">Data Power Apps</h1>
              <p className="text-gray-600">
                Transaction ID: <span className="font-mono">{transactionID}</span> • Total number of records: {data.length}
              </p>
            </div>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white shadow-lg hover:bg-blue-700 transition-colors"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                />
              </svg>
              Print PDF
            </button>
          </div>

          <div className="mb-6 print-content hidden print:block">
            <h1 className="mb-2 text-2xl font-bold text-gray-900">Data Power Apps</h1>
            <p className="text-gray-600">
              Transaction ID: <span className="font-mono">{transactionID}</span> • Total number of records: {data.length}
            </p>
            <p className="mt-2 text-sm text-gray-500">
            Print date: {new Date().toLocaleString('en-US')}
            </p>
          </div>

        {data.length === 0 ? (
          <div className="rounded-lg bg-white p-8 text-center shadow-sm print-content">
            <p className="text-gray-500">No data</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg bg-white shadow-sm print-content">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">
                    ID
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
                {data.map((item, index) => (
                  <tr
                    key={`${item.id}-${item.transactionID}-${index}-${item.月}-${item.エリア}`}
                    className="hover:bg-gray-50"
                  >
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900">
                      {item.id}
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

