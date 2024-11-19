import { FunctionComponent } from "react"
import { Transaction } from "../../utils/types"

export type SetTransactionApprovalFunction = (params: {
  transactionId: string
  newValue: boolean
}) => Promise<void>

export type TransactionApprovalState = Record<string, boolean>

export type UpdateTransactionApprovalStateFunction = (transactionId: string, newValue: boolean) => void

type TransactionsProps = {
  transactions: Transaction[] | null
  transactionApprovalState: TransactionApprovalState
  updateTransactionApprovalState: UpdateTransactionApprovalStateFunction
}

type TransactionPaneProps = {
  transaction: Transaction
  loading: boolean
  approved?: boolean
  setTransactionApproval: SetTransactionApprovalFunction
  transactionApprovalState: TransactionApprovalState
  updateTransactionApprovalState: UpdateTransactionApprovalStateFunction
}

export type TransactionsComponent = FunctionComponent<TransactionsProps>
export type TransactionPaneComponent = FunctionComponent<TransactionPaneProps>
