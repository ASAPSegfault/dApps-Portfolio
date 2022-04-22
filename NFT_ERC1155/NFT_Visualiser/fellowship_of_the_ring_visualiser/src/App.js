import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { NFTCard, NftImage, NftPopupImage } from './components/NFTCard';
import { NFTPopup } from './components/NFTModel';
import { ethers } from 'ethers';
import { connectToMetamask } from './utils';

const axios = require('axios');

/*
*  App Component
* * Main application component. Handle all data queries and popup display logic
*/

function App() {

  let dummyNfts = [{ name: "Aragorn", symbol: "FOTRC", copies: 0, image: "https://via.placeholder.com/150" },
  { name: "Frodo", symbol: "FOTRC", copies: 0, image: "https://via.placeholder.com/150" },
  { name: "Gandalf", symbol: "FOTRC", copies: 0, image: "https://via.placeholder.com/150" },
  { name: "Boromir", symbol: "FOTRC", copies: 0, image: "https://via.placeholder.com/150" },
  { name: "Aragorn", symbol: "FOTRC", copies: 0, image: "https://via.placeholder.com/150" },
  { name: "Frodo", symbol: "FOTRC", copies: 0, image: "https://via.placeholder.com/150" },
  { name: "Gandalf", symbol: "FOTRC", copies: 0, image: "https://via.placeholder.com/150" },
  { name: "Boromir", symbol: "FOTRC", copies: 0, image: "https://via.placeholder.com/150" },
  ]

  const [showPopup, setShowPopup] = useState(false);
  const [chosenNft, setChosenNft] = useState();
  const [nfts, setNfts] = useState(dummyNfts);

  useEffect(() => {
    ( async () => {
        const address = await connectToMetamask();

        address ?  getNftsData(address) : console.log('No account has been found.')
      }
    ) ()
  }, [])

  async function getMetadataFromIpfs(tokenUri) {
    let metadata = await axios.get(tokenUri);
    return metadata.data;
  }

  /*
  * Get NFTs data from IPFS through public Mumbai rpc provider
  */
  async function getNftsData(address) {
    const rpc = "https://rpc-mumbai.maticvigil.com/"
    const ethersProvider = new ethers.providers.JsonRpcProvider(rpc);
    
    const abi = [
      "function symbol() public view returns(string memory)",
      "function tokenCounter() public view returns(uint256)",
      "function uri(uint256 _tokenId) public view returns(string memory)",
      "function balanceOfBatch(address[] accounts, uint256[] ids) public view returns(uint256[])"
    ]

    let nftCollection = new ethers.Contract("0x6e7441ec2488FF46B43F4Ff7EACC4Ad9780296B4",
      abi,
      ethersProvider);

    let nftsCount = (await nftCollection.tokenCounter()).toNumber();
    let collectionSymbol = await nftCollection.symbol();
    let accounts = Array(nftsCount).fill(address);
    let ids = Array.from({length : nftsCount}, (_, i) => i + 1);
    let copies = await nftCollection.balanceOfBatch(accounts, ids);
    let baseUrl = "";
    let nftsArray = [];

    for (let i = 1; i <= nftsCount; i++) {
      if (i == 1) {
        let tokenUri = await nftCollection.uri(i);
        baseUrl = tokenUri.replace(/\d+.json/, "");
        let metadata = await getMetadataFromIpfs(tokenUri);
        metadata.symbol = collectionSymbol;
        metadata.copies = copies[i -1].toNumber();
        nftsArray.push(metadata);
      }
      else {
        let metadata = await getMetadataFromIpfs(baseUrl + i + '.json');
        metadata.symbol = collectionSymbol;
        metadata.copies = copies[i -1].toNumber();
        nftsArray.push(metadata);
      }
    }
    setNfts(nftsArray);
  }


  async function togglePopup(nftIndex) {
    if (nftIndex >= 0) {
      setChosenNft(nfts[nftIndex]);
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
            nfts.map((nft, index) =>
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

  @media(max-width: 1200px) {
    grid-template-columns: 1fr 1fr 1fr;
  }
  @media(max-width: 900px) {
    grid-template-columns: 1fr 1fr;
  }
  @media(max-width: 600px) {
    grid-template-columns: 1fr;
  }  
`
export default App;
