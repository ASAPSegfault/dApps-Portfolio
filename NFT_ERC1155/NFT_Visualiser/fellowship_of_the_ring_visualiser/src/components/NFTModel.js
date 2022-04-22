import styled from "styled-components"
import { NftPopupImage } from "./NFTCard";
import { NFTProgressBar } from "./NFTProgressBar";

/*
* NFT Popup Component
* * Displays the popup with NFT details inside 
*/

const NFTPopup = (props) => {
    let nft = props.nft;
    return (
      <Popup onClick={ () => props.togglePopup()}>
        <PopupContent onClick={ (event) => event.stopPropagation()}>
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
              {
                nft.attributes ? 
                nft.attributes.map((attr, index) => 
                  <div key={index}>
                    {
                        attr.display_type ? "" :
                        <AttributeContainer>
                        <AttributeText>
                          { attr.trait_type }
                        </AttributeText>
                        <AttributeText style={{float: "right"}}>
                          { attr.value }
                        </AttributeText>
                        <NFTProgressBar percent={attr.value * 10} hasExcess={ attr.display_type ? true : false }/>
                      </AttributeContainer>
                    }
                  </div>
                ) : ""
              }
            </div>
          </PopupGrid>
          <CloseBtn onClick={ () => props.togglePopup()}>
            &times;
          </CloseBtn>
        </PopupContent>
      </Popup>
    )
  }

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
  @media(max-width: 900px) {
    width: 400px; 
  }
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
  @media(max-width: 900px) {
    grid-template-columns: 1fr;
  } 
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

const AttributeText = styled.h4`
  margin: 0;
  display: inline;
  color: gray;
`
const AttributeContainer = styled.div`
  margin: 10px 0px 5px 0px;
`

export { NFTPopup }