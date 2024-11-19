import { useCallback } from "react"
import { useCustomFetch } from "src/hooks/useCustomFetch"
import { SetTransactionApprovalParams } from "src/utils/types"
import { TransactionPane } from "./TransactionPane"
import { SetTransactionApprovalFunction, TransactionsComponent } from "./types"

export const Transactions: TransactionsComponent = ({
  transactions,
  transactionApprovalState,
  updateTransactionApprovalState,
  
}) => {
  // console.log({ transactions })
  const { fetchWithoutCache, loading } = useCustomFetch()

  const setTransactionApproval = useCallback<SetTransactionApprovalFunction>(
    async ({ transactionId, newValue }) => {
      await fetchWithoutCache<void, SetTransactionApprovalParams>("setTransactionApproval", {
        transactionId,
        value: newValue,
      })
    },
    [fetchWithoutCache]
  )

  if (transactions === null) {
    return <div className="RampLoading--container">Loading...</div>
  }

  return (
    <div data-testid="transaction-container">
      {transactions.map((transaction: any, index: any) => (
        <TransactionPane
          key={index}
          transaction={transaction}
          loading={loading}
          transactionApprovalState={transactionApprovalState}
          updateTransactionApprovalState={updateTransactionApprovalState}
          setTransactionApproval={setTransactionApproval}
        />
      ))}
    </div>
  )
}
