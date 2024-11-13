import { useState, useEffect, ChangeEvent, useCallback } from 'react'
import './App.css'


// Display a list of past transactions, each with a unique ID and an amount., use a promise that returns an array with the past transactions. //ok
//Display a target amount input field that users can use to check if any two transactions add up to that target / ok
//After the user enters a target amount and clicks “Check Transactions,” display the indices (or IDs) of two transactions that add up to that target.
//If no two transactions add up to the target, display a message like “No matching transactions found.”
//Users should be able to add new transactions (ID and amount) to the list. Done

const initialTransactions: Transaction[] = [
  { id: 1, amount: 10, date: new Date("2020-10-14") },
  { id: 2, amount: 20, date: new Date("2019-10-14") },
  { id: 3, amount: 30, date: new Date("2018-10-14") },
];

interface Transaction {
  id: number;
  amount: number;
  date: Date;
}

const fetchData = () =>  new Promise((resolve, reject ) => {
  setTimeout(() => {
    resolve(initialTransactions);
  }, 300);

  if (initialTransactions.length === 0) {
    reject("No data");
  }

})

function App() {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions)
  const [initialDate, setInitialDate] = useState<Date>(new Date("2020-10-14"));
  const [endDate, setEndDate] = useState<Date>(new Date("2020-10-14"));
  const [transactionAmount, setTransactionAmount] = useState("")
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[] | null>(null)

  useEffect(() => {
   fetchData().then(response => setTransactions(response as Transaction[]));
  },[])


  const handleInitialDateChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setInitialDate(new Date(event.target.value));
  }, [setInitialDate]);
  
  const handleEndDateChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setEndDate(new Date(event.target.value));
  }, [setEndDate]);
  
  const handleSubmit = useCallback((event: ChangeEvent<HTMLFormElement>) => {
    event.preventDefault()
    const newTransaction = {
      id: transactions.length + 1,
      amount: Number(transactionAmount),
      date: new Date()
    }
  
    setTransactions([...transactions, newTransaction])
  }, [transactions, transactionAmount, setTransactions]);
  
  const handleFilterByDate = useCallback(() => {
    if (!initialDate || !endDate) {
      alert("Please select both dates");
      return;
    }
  
    const filteredTransactions = transactions.filter(
      (transaction) =>
        new Date(transaction.date) >= new Date(initialDate) &&
        new Date(transaction.date) <= new Date(endDate)
    );
  
    setFilteredTransactions(filteredTransactions);
  }, [initialDate, endDate, transactions, setFilteredTransactions]);
  
  const formatDate = useCallback((date: Date) => {
    return date.toISOString().slice(0, 10);
  }, []);

  return (
    <div>
      <header>
        <h2>Payment Transaction Dashboard</h2>
      </header>

      <div>
        <h3>Transaction List:</h3>
        <ul>
          {transactions.map((transaction: Transaction) => (
           <Transaction key={transaction.id} transaction={transaction}/>
          ))}
        </ul>
      </div>

      <div>
        <h3>Filter Transactions by Date</h3>
        <div>
          <label htmlFor="initial-date">Select initial date:</label>
          <input
            type="date"
            id="initial-date"
            value={formatDate(initialDate)}
            onChange={handleInitialDateChange}
            />
        </div>

        <div>
          <label htmlFor="end-date">Select end date:</label>
          <input
            type="date"
            id="end-date"
            value={formatDate(endDate)}
            onChange={handleEndDateChange}
            />
        </div>
        <button onClick={handleFilterByDate} style={{ marginTop: "1rem" }}>Filter by Date</button>
      </div>

      {filteredTransactions && filteredTransactions.length > 0 ? (
        <div>
          <h3>Filtered Transactions between {formatDate(initialDate)} and {formatDate(endDate)}:</h3>
          <ul>
            {filteredTransactions.map((transaction: Transaction) => (
               <Transaction key={transaction.id} transaction={transaction}/>
              ))}
          </ul>
        </div>
      ) : (
        <p>No matching transactions found</p>
      )}

      <div>
        <h3>Add New Transaction</h3>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="transaction-amount">Transaction Amount:</label>
            <input
              type="text"
              id="transaction-amount"
              onChange={(e: ChangeEvent<HTMLInputElement>) => setTransactionAmount(e.target.value)}
              />
          </div>
          <button type="submit" style={{ marginTop: "1rem" }}>Add Transaction</button>
        </form>
      </div>
    </div>
  )
}

export default App


const Transaction = ({ transaction }: { transaction: Transaction } ) => {
  return (
    <div key={transaction.id} style={{ border: "1px solid #ccc", marginBottom: "1rem" }}>
      <p><strong>Id:</strong> {transaction.id}</p>
      <p><strong>Amount:</strong> {Intl.NumberFormat().format(transaction.amount)}</p>
      <p><strong>Date:</strong> {transaction.date.toISOString().slice(0, 10)}</p>
    </div>
  );
};

