import { Fragment, useCallback, useEffect, useMemo, useState } from "react"
import { InputSelect } from "./components/InputSelect"
import { Instructions } from "./components/Instructions"
import { Transactions } from "./components/Transactions"
import { useEmployees } from "./hooks/useEmployees"
import { usePaginatedTransactions } from "./hooks/usePaginatedTransactions"
import { useTransactionsByEmployee } from "./hooks/useTransactionsByEmployee"
import { EMPTY_EMPLOYEE } from "./utils/constants"
import { Employee, Transaction } from "./utils/types"


export function App() {
  const { data: employees, ...employeeUtils } = useEmployees()
  const { data: paginatedTransactions, ...paginatedTransactionsUtils } = usePaginatedTransactions()
  const { data: transactionsByEmployee, ...transactionsByEmployeeUtils } = useTransactionsByEmployee()
  const [isLoading, setIsLoading] = useState(false)
  const [updatedTransactions, setUpdatedTransactions] = useState<Transaction[]>([])
  const [flag, setFlag] = useState<boolean>(false)
  const [id, setId] = useState<string>("")
  const [page,setPage]=useState<number|null|undefined>(0);

  const [transactionApprovalState, setTransactionApprovalState] = useState<Record<string, boolean>>({})

  const updateTransactionApprovalState = (transactionId: string, newValue: boolean) => {
    setTransactionApprovalState((prev) => ({
      ...prev,
      [transactionId]: newValue,
    }))
  }


  const transactions = useMemo(() => {
    console.log(paginatedTransactions?.nextPage)
    return flag ? transactionsByEmployee ?? null : paginatedTransactions?.data ?? null
  }, [paginatedTransactions, transactionsByEmployee])

  const loadAllTransactions = useCallback(async () => {
    setFlag(false)
    setId("")
    transactionsByEmployeeUtils.invalidateData()

    setIsLoading(true)

    await employeeUtils.fetchAll()

    setIsLoading(false)

    await paginatedTransactionsUtils.fetchAll()
  }, [employeeUtils, paginatedTransactionsUtils, transactionsByEmployeeUtils])

  const loadTransactionsByEmployee = useCallback(
    async (employeeId: string) => {
      setFlag(true)
      paginatedTransactionsUtils.invalidateData()
      setPage(null)
      await transactionsByEmployeeUtils.fetchById(employeeId)
    },
    [paginatedTransactionsUtils, transactionsByEmployeeUtils]
  )

  useEffect(() => {
    if (employees === null && !employeeUtils.loading) {
      loadAllTransactions()
    }
  }, [employeeUtils.loading, employees, loadAllTransactions])

  const updateTheTransaction = () => {
    console.log({ transactions })
    if (transactions && transactions.length > 0) {
      if (flag) {
        setUpdatedTransactions(() => [...transactions])
      }
      setUpdatedTransactions((prevTransactions: Transaction[]) => [...prevTransactions, ...transactions])
    }
  }

  useEffect(() => {
    updateTheTransaction()
  }, [transactions])

  return (
    <Fragment>
      <main className="MainContainer">
        <Instructions />

        <hr className="RampBreak--l" />

        <InputSelect<Employee>
          isLoading={isLoading}
          defaultValue={EMPTY_EMPLOYEE}
          items={employees === null ? [] : [EMPTY_EMPLOYEE, ...employees]}
          label="Filter by employee"
          loadingLabel="Loading employees"
          parseItem={(item) => ({
            value: item.id,
            label: `${item.firstName} ${item.lastName}`,
          })}
          onChange={async (newValue) => {
            if (newValue === null) {
              return
            }
            console.log({ newValue, flag })
            if (newValue.id === "") {
              setUpdatedTransactions([])
              loadAllTransactions()
              setId("")
              setFlag(false)
            } else {
              setId(newValue.id)
              await loadTransactionsByEmployee(newValue.id)
            }
          }}
        />

        <div className="RampBreak--l" />

        <div className="RampGrid">
          <Transactions
            transactions={updatedTransactions}        
            transactionApprovalState={transactionApprovalState}
            updateTransactionApprovalState={updateTransactionApprovalState}

          />

          {transactions !== null && !flag && paginatedTransactions?.nextPage != null && (
            <button
              className="RampButton"
              disabled={paginatedTransactionsUtils.loading}
              onClick={async () => {
                console.log({ id })
                id != "" ? await loadTransactionsByEmployee(id) : await loadAllTransactions()
              }}
            >
              View More
            </button>
          )}
        </div>
      </main>
    </Fragment>
  )
}
