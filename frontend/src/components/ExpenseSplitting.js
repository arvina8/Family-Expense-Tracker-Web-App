import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Badge } from './UI/Components';
import { RefreshCw, TrendingUp, TrendingDown, DollarSign, Users, ArrowRightLeft } from 'lucide-react';

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
    if (balance > 0) return 'green'; // Person is owed money
    if (balance < 0) return 'red';   // Person owes money
    return 'gray';                   // Person is even
  };

  const getBalanceStatus = (balance) => {
    if (balance > 0) return 'is owed';
    if (balance < 0) return 'owes';
    return 'is even';
  };

  const getBalanceIcon = (balance) => {
    if (balance > 0) return TrendingUp;
    if (balance < 0) return TrendingDown;
    return DollarSign;
  };

  if (loading) {
    return (
      <Card>
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
          <div className="text-gray-500">Loading balances...</div>
        </div>
      </Card>
    );
  }

  const balanceEntries = Object.entries(balances);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <ArrowRightLeft className="w-6 h-6 mr-2 text-blue-600" />
            Expense Splitting & Balances
          </h2>
          <p className="text-gray-600">Track who owes what and settle up easily</p>
        </div>
        <button
          onClick={fetchBalances}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Refresh</span>
        </button>
      </div>

      {balanceEntries.length === 0 ? (
        <Card className="text-center py-12">
          <Users className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <div className="text-gray-500 text-lg mb-2">No expense data available</div>
          <div className="text-gray-400 text-sm">Add some expenses to see splitting calculations</div>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Individual Balance Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {balanceEntries.map(([userId, data]) => {
              const BalanceIcon = getBalanceIcon(data.balance);
              const balanceColor = getBalanceColor(data.balance);
              
              return (
                <Card key={userId} className="hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-lg text-gray-800">{data.name}</h3>
                    <div className={`p-2 rounded-full ${
                      balanceColor === 'green' ? 'bg-green-100' : 
                      balanceColor === 'red' ? 'bg-red-100' : 'bg-gray-100'
                    }`}>
                      <BalanceIcon className={`w-5 h-5 ${
                        balanceColor === 'green' ? 'text-green-600' : 
                        balanceColor === 'red' ? 'text-red-600' : 'text-gray-600'
                      }`} />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total Paid:</span>
                      <Badge color="green" size="md">₹{data.paid.toFixed(2)}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total Owes:</span>
                      <Badge color="orange" size="md">₹{data.owes.toFixed(2)}</Badge>
                    </div>
                    <div className="border-t pt-3">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-800">Net Balance:</span>
                        <div className="text-right">
                          <div className={`font-bold text-lg ${
                            balanceColor === 'green' ? 'text-green-600' : 
                            balanceColor === 'red' ? 'text-red-600' : 'text-gray-600'
                          }`}>
                            ₹{Math.abs(data.balance).toFixed(2)}
                          </div>
                          <div className="text-xs text-gray-500">
                            {getBalanceStatus(data.balance)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Settlement Summary */}
          <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
            <h3 className="font-semibold text-xl mb-4 text-blue-800 flex items-center">
              <DollarSign className="w-5 h-5 mr-2" />
              Settlement Summary
            </h3>
            <div className="space-y-3">
              {balanceEntries
                .filter(([_, data]) => Math.abs(data.balance) > 0.01)
                .sort(([_, a], [__, b]) => a.balance - b.balance)
                .map(([userId, data]) => (
                  <div key={userId} className="flex justify-between items-center bg-white p-3 rounded-lg shadow-sm">
                    <span className="font-medium text-gray-800">{data.name}</span>
                    <div className="text-right">
                      <div className={`font-semibold ${
                        data.balance > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {data.balance > 0 
                          ? `Should receive ₹${data.balance.toFixed(2)}` 
                          : `Owes ₹${Math.abs(data.balance).toFixed(2)}`
                        }
                      </div>
                    </div>
                  </div>
                ))
              }
              
              {balanceEntries.every(([_, data]) => Math.abs(data.balance) <= 0.01) && (
                <div className="text-center py-4">
                  <div className="text-green-600 font-medium">🎉 All balanced! Everyone is settled up.</div>
                </div>
              )}
            </div>
          </Card>

          {/* How to Settle Guide */}
          <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
            <h4 className="font-semibold mb-3 text-yellow-800 flex items-center">
              <Users className="w-5 h-5 mr-2" />
              How to Settle Up
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-3 bg-white rounded-lg">
                <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <div className="text-sm font-medium text-gray-800 mb-1">Should Receive</div>
                <div className="text-xs text-gray-600">People with positive balances</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg">
                <TrendingDown className="w-8 h-8 text-red-600 mx-auto mb-2" />
                <div className="text-sm font-medium text-gray-800 mb-1">Should Pay</div>
                <div className="text-xs text-gray-600">People with negative balances</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg">
                <DollarSign className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                <div className="text-sm font-medium text-gray-800 mb-1">All Even</div>
                <div className="text-xs text-gray-600">When balances are zero</div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ExpenseSplitting;
