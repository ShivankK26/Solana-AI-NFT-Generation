import pinataSDK from '@pinata/sdk';
import axios from 'axios';
import dotenv from 'dotenv';
import { Readable } from 'stream';

dotenv.config();

const pinata = new pinataSDK({ pinataJWTKey: process.env.PINATA_JWT });

async function uploadToIPFS(data: Buffer, options: any): Promise<string> {
  try {
    const stream = Readable.from(data);
    const result = await pinata.pinFileToIPFS(stream, options);
    return `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`;
  } catch (error) {
    console.error('Error uploading to IPFS:', error);
    throw new Error('Failed to upload to IPFS');
  }
}

export async function uploadMetadata(metadata: any): Promise<string> {
  try {
    console.log('Uploading image to IPFS...');
    const imageResponse = await axios.get(metadata.image, { responseType: 'arraybuffer' });
    const imageBuffer = Buffer.from(imageResponse.data);
    const imageUrl = await uploadToIPFS(imageBuffer, {
      pinataMetadata: { name: `${metadata.name}_image.png` }
    });

    console.log('Image uploaded to IPFS:', imageUrl);

    const metadataWithIPFSImage = {
      ...metadata,
      image: imageUrl
    };

    console.log('Uploading metadata to IPFS...');
    const metadataBuffer = Buffer.from(JSON.stringify(metadataWithIPFSImage));
    const metadataUrl = await uploadToIPFS(metadataBuffer, {
      pinataMetadata: { name: `${metadata.name}_metadata.json` },
      pinataOptions: { cidVersion: 0 }
    });

    console.log('Metadata uploaded to IPFS:', metadataUrl);

    return metadataUrl;
  } catch (error) {
    console.error('Error in uploadMetadata:', error);
    throw new Error('Failed to upload metadata');
  }
}

export async function mintNFT(metadataUri: string, name: string): Promise<string> {
  // This function is a placeholder for actual minting logic
  console.log('Minting NFT with metadata URI:', metadataUri);
  return metadataUri;
}