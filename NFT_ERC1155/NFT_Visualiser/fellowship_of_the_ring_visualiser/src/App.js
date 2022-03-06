import { useState } from 'react';
import styled from 'styled-components';
import { NFTCard, NftImage, NftPopupImage } from './components/NFTCard';
import { NFTPopup } from './components/NFTModel';

function App() {

  const [showPopup, setShowPopup] = useState(false);
  const [chosenNft, setChosenNft] = useState();

  let dummynft = [{ name: "Aragorn", symbol: "FOTRC", copies: 10, image: "https://via.placeholder.com/150" },
  { name: "Frodo", symbol: "FOTRC", copies: 10, image: "https://via.placeholder.com/150" },
  { name: "Gandalf", symbol: "FOTRC", copies: 10, image: "https://via.placeholder.com/150" },
  { name: "Boromir", symbol: "FOTRC", copies: 10, image: "https://via.placeholder.com/150" },
  { name: "Aragorn", symbol: "FOTRC", copies: 10, image: "https://via.placeholder.com/150" },
  { name: "Frodo", symbol: "FOTRC", copies: 10, image: "https://via.placeholder.com/150" },
  { name: "Gandalf", symbol: "FOTRC", copies: 10, image: "https://via.placeholder.com/150" },
  { name: "Boromir", symbol: "FOTRC", copies: 10, image: "https://via.placeholder.com/150" },
  ]

  function togglePopup(nftIndex) {
    if (nftIndex >= 0) {
      setChosenNft(dummynft[nftIndex]);
    }
    setShowPopup(!showPopup);
  }

  return (
    <div className="App">
      <Container>
        <Title> Fellowship Of The Ring Collection </Title>
        <SubTitle> The most epic fellowship of all times </SubTitle>
        <Grid>
          {
            dummynft.map((nft, index) =>
              <NFTCard nft={nft} key={index} togglePopup={ () => togglePopup(index)}>

              </NFTCard>)
          }
        </Grid>
      </Container>
      {
        showPopup ? <NFTPopup nft={chosenNft} togglePopup={ () => togglePopup()}/> : ""
      }
    </div>
  );
}

const Title = styled.h1`
  margin: 0;
  text-align: center;
`
const SubTitle = styled.h4`
  margin-top: 0;
  text-align: center;
  color: gray;
`

const Container = styled.div`
  width: 70%;
  margin: auto;
  margin-top: 200px;
  max-width: 1200px;
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  row-gap: 40px;
`
export default App;
