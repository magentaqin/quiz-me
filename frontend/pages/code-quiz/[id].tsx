import dynamic from "next/dynamic";

const CodeEditor = dynamic(() => import("../../components/code-editor/CodeEditor"), { ssr: false });
const Action = dynamic(() => import("../../components/code-editor/Action"), { ssr: false });

const CodeQuizPage = () => {
  const mockedVal = `
var maxProfit = function(prices) {
  let minprice = Number.MAX_VALUE;
  let maxprofit = 0;
  for (const price of prices) {
      maxprofit = Math.max(price - minprice, maxprofit);
      minprice = Math.min(price, minprice);
  }
  return maxprofit;
};

module.exports = maxProfit;
`;
  return (
    <div>
      <div>
        <h1>Quiz</h1>
      </div>
      <div>
        <CodeEditor defaultValue={mockedVal} />
        <Action value={mockedVal} />
      </div>
    </div>
  );
};

export default CodeQuizPage;
