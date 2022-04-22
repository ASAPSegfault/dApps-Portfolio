import styled from 'styled-components';

/*
* NFT Card Component
* * Displays the card component used in the grid
*/

const NFTCard = (props) => {
  let nft = props.nft;

  return (
    <NftCard onClick={() => props.togglePopup() }>
      <NftImage style={{ backgroundImage: `url(${nft && nft.image})` }} />
      <div style={{ margin: 5 }}>
        <NftCollectionText>
          {nft && nft.symbol}
        </NftCollectionText>
        <NftName>
          {nft && nft.name}
        </NftName>
        <NftNumberOfCopies>
          {`x${nft && nft.copies}`}
        </NftNumberOfCopies>
      </div>
    </NftCard>
  )
}

const NftCollectionText = styled.div`
    font-size: 12px;
    color: grey;
  `

const NftName = styled.div`
    font-size: 12px;
    font-weight: bold;
    display: inline;
  `

const NftNumberOfCopies = styled.div`
    font-size: 12px;
    font-weight: bold;
    display: inline;
    float: right;
  `

const NftCard = styled.div`
    width: 200px;
    height: 250px;
    margin: auto;
    border-radius: 10px;
    padding: 0px;
    cursor: pointer;
    box-shadow: 6px 6px 12px #d9d9d9,
                -6px -6px 12px #ffffff
  `
const NftImage = styled.div`
    display: block;
    width: 200px;
    height: 200px;
    background-position: center center;
    background-size: cover;
    border-radius: 10px;
    margin: auto;
  `

  const NftPopupImage = styled.div`
  display: block;
  width: 400px;
  height: 400px;
  background-position: center center;
  background-size: cover;
  border-radius: 10px;
  margin: auto;
`

export { NFTCard, NftImage, NftPopupImage}