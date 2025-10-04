import React, { useEffect, useState } from 'react';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Card, Badge } from './UI/Components';
import { RefreshCw, TrendingUp, TrendingDown, DollarSign, Users, ArrowRightLeft } from 'lucide-react';

const ExpenseSplitting = () => {
  const [balances, setBalances] = useState({});
  const [loading, setLoading] = useState(true);

  const { currentGroup } = useAuth();
  const { theme } = useTheme();

  useEffect(() => {
    if (!currentGroup) return;
    fetchBalances();
  }, [currentGroup]);

  const fetchBalances = async () => {
    try {
      setLoading(true);
      const res = await client.get('/expenses/balances', { params: { groupId: currentGroup } });
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
      <Card className={theme.colors.cardBg}>
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mr-3"></div>
          <div className={theme.colors.textMuted}>Loading balances...</div>
        </div>
      </Card>
    );
  }

  const balanceEntries = Object.entries(balances);

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div>
          <h2 className={`text-xl font-bold ${theme.colors.text} flex items-center`}>
            <ArrowRightLeft className="w-5 h-5 mr-2 text-indigo-600" />
            Balance Summary
          </h2>
          <p className={theme.colors.textSecondary}>Track who owes what and settle up easily</p>
        </div>
        <button
          onClick={fetchBalances}
          className={`
            flex items-center space-x-2 px-4 py-2 text-white rounded-xl transition-all duration-300
            bg-gradient-to-r ${theme.colors.primary} hover:shadow-lg hover:scale-105
            flex-shrink-0
          `}
        >
          <RefreshCw className="w-4 h-4" />
          <span>Refresh</span>
        </button>
      </div>

      {balanceEntries.length === 0 ? (
        <Card className={`text-center py-12 ${theme.colors.cardBg}`}>
          <Users className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <div className={`${theme.colors.textMuted} text-lg mb-2`}>No expense data available</div>
          <div className={`${theme.colors.textMuted} text-sm`}>Add some expenses to see splitting calculations</div>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Individual Balance Cards */}
          <div className="grid gap-6 grid-cols-[repeat(auto-fit,minmax(280px,1fr))]">
            {balanceEntries.map(([userId, data]) => {
              const BalanceIcon = getBalanceIcon(data.balance);
              const balanceColor = getBalanceColor(data.balance);

              return (
                <Card
                  key={userId}
                  className={`${theme.colors.cardBg} ${theme.colors.cardHover} 
                              transition-all duration-300 p-6 min-h-[320px] 
                              flex flex-col w-full max-w-sm mx-auto`}
                >
                  {/* Header Row */}
                  <div className="flex items-start justify-between mb-6 gap-3">
                    <h3
                      className={`font-semibold text-lg ${theme.colors.text} flex-1 break-words leading-tight`}
                      title={data.name}
                    >
                      {data.name}
                    </h3>
                    <div
                      className={`w-10 h-10 flex items-center justify-center rounded-full flex-shrink-0 ${
                        balanceColor === 'green'
                          ? 'bg-green-100 dark:bg-green-900'
                          : balanceColor === 'red'
                          ? 'bg-red-100 dark:bg-red-900'
                          : 'bg-gray-100 dark:bg-gray-700'
                      }`}
                    >
                      <BalanceIcon
                        className={`w-5 h-5 ${
                          balanceColor === 'green'
                            ? 'text-green-600 dark:text-green-400'
                            : balanceColor === 'red'
                            ? 'text-red-600 dark:text-red-400'
                            : 'text-gray-600 dark:text-gray-400'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="space-y-4 flex-1">
                    <div className="flex justify-between items-center py-2">
                      <span className={`${theme.colors.textSecondary} text-sm font-medium`}>Total Paid:</span>
                      <Badge color="green" size="md">₹{data.paid.toFixed(2)}</Badge>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className={`${theme.colors.textSecondary} text-sm font-medium`}>Total Owes:</span>
                      <Badge color="orange" size="md">₹{data.owes.toFixed(2)}</Badge>
                    </div>

                    <div className={`border-t ${theme.colors.border} pt-4 mt-4`}>
                      <div className="flex justify-between items-center">
                        <span className={`font-semibold ${theme.colors.text} text-sm`}>Net Balance:</span>
                        <div className="text-right flex flex-col items-end">
                          <div
                            className={`font-bold text-xl ${
                              balanceColor === 'green'
                                ? 'text-green-600 dark:text-green-400'
                                : balanceColor === 'red'
                                ? 'text-red-600 dark:text-red-400'
                                : 'text-gray-600 dark:text-gray-400'
                            }`}
                          >
                            ₹{Math.abs(data.balance).toFixed(2)}
                          </div>
                          <div className={`text-xs ${theme.colors.textMuted} mt-1`}>
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
          <Card className={`${theme.colors.glass} border-2 border-indigo-200 dark:border-indigo-800 p-6`}>
            <h3 className={`font-semibold text-xl mb-6 text-indigo-800 dark:text-indigo-200 flex items-center`}>
              <DollarSign className="w-5 h-5 mr-2" />
              Settlement Summary
            </h3>
            <div className="space-y-4">
              {balanceEntries
                .filter(([_, data]) => Math.abs(data.balance) > 0.01)
                .sort(([_, a], [__, b]) => a.balance - b.balance)
                .map(([userId, data]) => (
                  <div
                    key={userId}
                    className={`flex justify-between items-center ${theme.colors.surface} p-4 rounded-lg shadow-sm border ${theme.colors.border}`}
                  >
                    <span className={`font-medium ${theme.colors.text} text-base`}>{data.name}</span>
                    <div className="text-right">
                      <div
                        className={`font-semibold text-lg ${
                          data.balance > 0
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-red-600 dark:text-red-400'
                        }`}
                      >
                        {data.balance > 0
                          ? `Should receive ₹${data.balance.toFixed(2)}`
                          : `Owes ₹${Math.abs(data.balance).toFixed(2)}`}
                      </div>
                    </div>
                  </div>
                ))}

              {balanceEntries.every(([_, data]) => Math.abs(data.balance) <= 0.01) && (
                <div className="text-center py-6">
                  <div className="text-green-600 dark:text-green-400 font-medium text-lg">
                    🎉 All balanced! Everyone is settled up.
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* How to Settle Guide */}
          <Card className={`${theme.colors.glass} border-2 border-amber-200 dark:border-amber-800 p-6`}>
            <h4 className={`font-semibold mb-4 text-amber-800 dark:text-amber-200 flex items-center text-lg`}>
              <Users className="w-5 h-5 mr-2" />
              How to Settle Up
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div
                className={`text-center p-4 ${theme.colors.surface} rounded-lg border ${theme.colors.border} min-h-[120px] flex flex-col justify-center`}
              >
                <TrendingUp className="w-8 h-8 text-green-600 dark:text-green-400 mx-auto mb-3" />
                <div className={`text-sm font-medium ${theme.colors.text} mb-2`}>Should Receive</div>
                <div className={`text-xs ${theme.colors.textMuted} leading-relaxed`}>People with positive balances</div>
              </div>
              <div
                className={`text-center p-4 ${theme.colors.surface} rounded-lg border ${theme.colors.border} min-h-[120px] flex flex-col justify-center`}
              >
                <TrendingDown className="w-8 h-8 text-red-600 dark:text-red-400 mx-auto mb-3" />
                <div className={`text-sm font-medium ${theme.colors.text} mb-2`}>Should Pay</div>
                <div className={`text-xs ${theme.colors.textMuted} leading-relaxed`}>People with negative balances</div>
              </div>
              <div
                className={`text-center p-4 ${theme.colors.surface} rounded-lg border ${theme.colors.border} min-h-[120px] flex flex-col justify-center`}
              >
                <DollarSign className="w-8 h-8 text-gray-600 dark:text-gray-400 mx-auto mb-3" />
                <div className={`text-sm font-medium ${theme.colors.text} mb-2`}>All Even</div>
                <div className={`text-xs ${theme.colors.textMuted} leading-relaxed`}>When balances are zero</div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ExpenseSplitting;
