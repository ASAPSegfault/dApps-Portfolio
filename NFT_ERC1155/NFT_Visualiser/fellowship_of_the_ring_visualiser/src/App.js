import { useState } from 'react';
import styled from 'styled-components';
import { NFTCard, NftImage, NftPopupImage } from './components/NFTCard';

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
        showPopup && <NFTPopup nft={chosenNft} togglePopup={ () => togglePopup()}/>
      }
    </div>
  );
}

const NFTPopup = (props) => {
  let nft = props.nft;
  return (
    <Popup>
      <PopupContent>
        <PopupGrid>
          <NftPopupImage style={{ backgroundImage: `url(${nft && nft.image})`}}/>
          <div>
            <PopupTitle>
              {nft.name}
            </PopupTitle>
            <PopupTextContainer>
              { `You currently have ownership of ${ nft.copies } copies `}
            </PopupTextContainer>
            <PopupSubtitleSection>
              Description
            </PopupSubtitleSection>
            <PopupTextContainer>
              {nft.description}
            </PopupTextContainer>
            <PopupSubtitleSection>
                Attributes
            </PopupSubtitleSection>
          </div>
        </PopupGrid>
        <CloseBtn onClick={ () => props.togglePopup()}>
          &times;
        </CloseBtn>
      </PopupContent>
    </Popup>
  )
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

const Popup = styled.div`
  position: fixed;
  display: flex;
  align-items: center;
  z-index: 100;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.5);
  overflow: auto;
`

const PopupContent = styled.div`
  position: relative;
  width: 900px;
  margin: auto;
  padding: 20px;
  border-radius: 20px;
  background-color: white;
`

const PopupTitle = styled.h1`
  margin: 0;
`

const PopupTextContainer = styled.p`
  margin: 0 0 15px 0;
`

const PopupSubtitleSection = styled.h3`
  margin: 5px 0 5px 0;
`
const PopupGrid = styled.div`
  display: inline-grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 40px;
`

const CloseBtn = styled.span`
  position: absolute;
  padding: 25px 25px 0 0;
  right: 0;
  top: 0;
  cursor: pointer;
  font-size: 20px;
  font-weight: bold;
`

export default App;
