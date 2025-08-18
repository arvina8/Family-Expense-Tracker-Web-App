import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ExpenseSplitting = () => {
  const [balances, setBalances] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBalances();
  }, []);

  const fetchBalances = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/expenses/balances');
      setBalances(res.data);
    } catch (error) {
      console.error('Error fetching balances:', error);
    } finally {
      setLoading(false);
    }
  };

  const getBalanceColor = (balance) => {
    if (balance > 0) return 'text-green-600'; // Person is owed money
    if (balance < 0) return 'text-red-600';   // Person owes money
    return 'text-gray-600';                   // Person is even
  };

  const getBalanceStatus = (balance) => {
    if (balance > 0) return 'is owed';
    if (balance < 0) return 'owes';
    return 'is even';
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded shadow-md mt-4">
        <div className="flex justify-center items-center py-8">
          <div className="text-gray-500">Loading balances...</div>
        </div>
      </div>
    );
  }

  const balanceEntries = Object.entries(balances);

  return (
    <div className="bg-white p-6 rounded shadow-md mt-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Expense Splitting & Balances</h2>
        <button
          onClick={fetchBalances}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Refresh
        </button>
      </div>

      {balanceEntries.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No expense data available for splitting calculations.
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
            {balanceEntries.map(([userId, data]) => (
              <div key={userId} className="border rounded-lg p-4 bg-gray-50">
                <h3 className="font-semibold text-lg mb-2">{data.name}</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Total Paid:</span>
                    <span className="font-medium text-green-600">₹{data.paid.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Owes:</span>
                    <span className="font-medium text-red-600">₹{data.owes.toFixed(2)}</span>
                  </div>
                  <hr />
                  <div className="flex justify-between font-semibold">
                    <span>Net Balance:</span>
                    <span className={getBalanceColor(data.balance)}>
                      ₹{Math.abs(data.balance).toFixed(2)} {getBalanceStatus(data.balance)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-3">Settlement Summary</h3>
            <div className="space-y-2">
              {balanceEntries
                .filter(([_, data]) => Math.abs(data.balance) > 0.01)
                .sort(([_, a], [__, b]) => a.balance - b.balance)
                .map(([userId, data]) => (
                  <div key={userId} className="flex justify-between items-center">
                    <span>{data.name}</span>
                    <span className={`font-medium ${getBalanceColor(data.balance)}`}>
                      {data.balance > 0 
                        ? `Should receive ₹${data.balance.toFixed(2)}` 
                        : `Owes ₹${Math.abs(data.balance).toFixed(2)}`
                      }
                    </span>
                  </div>
                ))
              }
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold mb-2">How to settle:</h4>
            <ul className="text-sm space-y-1 text-gray-700">
              <li>• People with positive balances should receive money</li>
              <li>• People with negative balances should pay money</li>
              <li>• The total of all positive balances equals the total of all negative balances</li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default ExpenseSplitting;
