interface NFTMetadata {
  name: string;
  symbol: string;
  description: string;
  image: string;
  attributes: { trait_type: string; value: string }[];
}

export function createNFTMetadata(
  name: string,
  description: string,
  imageUrl: string,
  owner: string
): NFTMetadata {
  return {
    name: name,
    symbol: 'MYAI',
    description: description,
    image: imageUrl,
    attributes: [
      {
        trait_type: 'Creator',
        value: 'AI NFT Generator',
      },
      {
        trait_type: 'Owner',
        value: owner,
      },
    ],
  };
}