import { NFTCard } from './components/NFTCard';

function App() {

  let dummynft = [ { name: "Aragorn", symbol: "FOTRC", copies: 10, image: "https://via.placeholder.com/150"},
    { name: "Frodo", symbol: "FOTRC", copies: 10, image: "https://via.placeholder.com/150"},
    { name: "Gandalf", symbol: "FOTRC", copies: 10, image: "https://via.placeholder.com/150"},
    { name: "Boromir", symbol: "FOTRC", copies: 10, image: "https://via.placeholder.com/150"},
  ]

  return (
    <div className="App">
      {
        dummynft.map((nft, index) => 
        <NFTCard nft={nft} key={index}>

        </NFTCard>)
      }
    </div>
  );
}

export default App;
