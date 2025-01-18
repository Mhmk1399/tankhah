import TransactionList from "@/components/transactionList";

const Home = () => {
  return (
    <div className="flex flex-col justify-center items-center ">
      <div className="space-y-4">
        <div id="income-list">
          <TransactionList type="incomes" />
        </div>
        <div id="outcome-list">
          <TransactionList type="outcomes" />
        </div>
      </div>
    </div>
  );
};
export default Home;
