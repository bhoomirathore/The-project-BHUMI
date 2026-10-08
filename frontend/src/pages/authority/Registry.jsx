import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import TransactionStatusPill from '../../components/TransactionStatusPill';
import transactionService from '../../services/transactionService';

export default function AuthorityRegistry() {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [retryingId, setRetryingId] = useState(null);
  const [notification, setNotification] = useState(null);

  const loadTransactions = async () => {
    try {
      const data = await transactionService.getAllTransactions();
      setTransactions(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  const handleRetry = async (applicationId) => {
    setRetryingId(applicationId);
    setNotification(null);
    try {
      await transactionService.retry(applicationId);
      setNotification({
        type: 'success',
        message: `Retry initiated for ${applicationId}. Synchronizing transaction with ledger...`,
      });
      // Refresh list after brief moment
      await loadTransactions();
      // Poll again after 2s and 5s to catch mock async transitions
      setTimeout(loadTransactions, 2000);
      setTimeout(loadTransactions, 5000);
    } catch (err) {
      setNotification({
        type: 'error',
        message: err.message || `Failed to retry transaction for ${applicationId}`,
      });
    } finally {
      setRetryingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F2F0] text-[#2B1B14] flex">
      <Sidebar portal="authority" />

      <main className="flex-1 md:ml-[280px] p-4 sm:p-6 md:p-8 lg:p-10 pt-16 md:pt-8 max-w-full overflow-x-hidden">
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 sm:pb-8 border-b border-[#D3CCC8] mb-6 sm:mb-8">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#2B1B14]">
              Blockchain Transactions
            </h1>
            <p className="text-[#6E5D53] text-xs sm:text-sm mt-1">
              Ledger commit tracking, transaction hashes, and state synchronization records
            </p>
          </div>
          <button
            onClick={loadTransactions}
            className="py-2 px-4 bg-transparent border border-[#D3CCC8] hover:border-[#2B1B14] text-[#2B1B14] text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 self-end sm:self-auto"
          >
            <span>↻</span> Refresh Log
          </button>
        </header>

        {/* Notifications */}
        {notification && (
          <div
            className={`mb-6 p-4 rounded-xl border text-xs flex justify-between items-center ${
              notification.type === 'success'
                ? 'bg-[#047857]/10 border-[#047857]/30 text-[#047857]'
                : 'bg-[#DC2626]/10 border-[#DC2626]/30 text-[#DC2626]'
            }`}
          >
            <div className="flex items-center gap-2 font-medium">
              <span>{notification.type === 'success' ? '✓' : '⚠️'}</span>
              <span>{notification.message}</span>
            </div>
            <button
              onClick={() => setNotification(null)}
              className="text-xs font-bold hover:opacity-75"
            >
              ✕
            </button>
          </div>
        )}

        {/* Architecture Note Banner */}
        <div className="mb-6 p-4 rounded-xl bg-[#E6DEDA] border border-[#D3CCC8] text-xs text-[#6E5D53] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="text-base">⛓️</span>
            <div>
              <strong className="text-[#2B1B14] block sm:inline mr-1">Asynchronous Settlement:</strong>
              State mutations are submitted to the ledger upon registrar approval. Relational database records are updated only after confirmed ledger block events are received and verified.
            </div>
          </div>
          <span className="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded bg-[#2563EB]/15 text-[#2563EB] border border-[#2563EB]/30">
            EVENT DRIVEN
          </span>
        </div>

        {/* Transactions Table Card */}
        <section className="bg-[#E6DEDA] border border-[#D3CCC8] rounded-xl overflow-hidden shadow-sm">
          <div className="p-5 border-b border-[#D3CCC8] flex justify-between items-center bg-[#F8F2F0]/50">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[#2B1B14]">
                Ledger Transaction Log ({transactions.length})
              </h2>
              <p className="text-xs text-[#6E5D53]">
                Transfer mutation transactions committed or pending ledger finality
              </p>
            </div>
          </div>

          {loading ? (
            <div className="p-8 text-center text-xs text-[#6E5D53]">Loading transactions...</div>
          ) : transactions.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#6E5D53]">
              No blockchain transactions recorded yet. Approved applications will appear here.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm border-collapse min-w-[800px]">
                <thead>
                  <tr className="border-b border-[#D3CCC8] bg-[#D3CCC8]/30 text-[#6E5D53]">
                    <th className="p-4 font-semibold">Application</th>
                    <th className="p-4 font-semibold">Parcel ULPIN</th>
                    <th className="p-4 font-semibold">Parties</th>
                    <th className="p-4 font-semibold">Transaction Hash</th>
                    <th className="p-4 font-semibold">Timestamp</th>
                    <th className="p-4 font-semibold">Status</th>
                    <th className="p-4 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D3CCC8] text-[#2B1B14]">
                  {transactions.map((tx) => {
                    const isFailed =
                      tx.status === 'FAILED' || tx.status === 'SYNC_FAILED';
                    const isRetrying = retryingId === tx.applicationId;

                    return (
                      <React.Fragment key={tx.applicationId}>
                        <tr
                          onClick={() => navigate(`/authority/applications/${tx.applicationId}`)}
                          className="hover:bg-[#D3CCC8]/30 cursor-pointer transition-colors"
                        >
                          <td className="p-4 font-mono font-bold text-[#2B1B14]">
                            {tx.applicationId}
                          </td>
                          <td className="p-4 font-mono text-[#6E5D53]">
                            {tx.propertyId}
                          </td>
                          <td className="p-4">
                            <div className="text-xs">
                              <span className="font-semibold text-[#2B1B14]">{tx.sellerName}</span>
                              <span className="text-[#6E5D53] mx-1">&rarr;</span>
                              <span className="font-semibold text-[#2B1B14]">{tx.buyerName}</span>
                            </div>
                          </td>
                          <td className="p-4 font-mono text-[11px] text-[#2B1B14] max-w-[180px]">
                            {tx.txHash ? (
                              <span
                                className="truncate block title={tx.txHash}"
                                title={tx.txHash}
                              >
                                {tx.txHash.slice(0, 10)}...{tx.txHash.slice(-8)}
                              </span>
                            ) : (
                              <span className="text-[#7A6B63] italic">Pending Tx Hash</span>
                            )}
                          </td>
                          <td className="p-4 text-[#6E5D53] text-xs">
                            {tx.submittedAt || '—'}
                          </td>
                          <td className="p-4">
                            <TransactionStatusPill status={tx.status} type="blockchain" />
                          </td>
                          <td className="p-4 text-right">
                            {isFailed ? (
                              <button
                                disabled={isRetrying}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRetry(tx.applicationId);
                                }}
                                className="py-1.5 px-3 bg-[#DC2626] text-[#F8F2F0] font-bold text-xs rounded shadow hover:bg-[#B91C1C] disabled:opacity-50 transition-all"
                              >
                                {isRetrying ? 'Retrying...' : 'Retry Sync'}
                              </button>
                            ) : (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/authority/applications/${tx.applicationId}`);
                                }}
                                className="py-1 px-3 bg-[#2B1B14] text-[#F8F2F0] font-bold text-xs rounded shadow hover:bg-[#3D281F]"
                              >
                                View &rarr;
                              </button>
                            )}
                          </td>
                        </tr>

                        {/* Error details row if transaction failed or sync failed */}
                        {isFailed && tx.error && (
                          <tr className="bg-[#DC2626]/5 text-xs">
                            <td colSpan={7} className="px-4 py-2 text-[#DC2626] border-t border-[#DC2626]/20">
                              <div className="flex items-center gap-2">
                                <span className="font-bold">⚠️ Ledger Sync Fault:</span>
                                <span>{tx.error}</span>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
