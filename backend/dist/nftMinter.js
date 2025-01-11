"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadMetadata = uploadMetadata;
exports.mintNFT = mintNFT;
const sdk_1 = __importDefault(require("@pinata/sdk"));
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
const stream_1 = require("stream");
dotenv_1.default.config();
const pinata = new sdk_1.default({ pinataJWTKey: process.env.PINATA_JWT });
function uploadToIPFS(data, options) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const stream = stream_1.Readable.from(data);
            const result = yield pinata.pinFileToIPFS(stream, options);
            return `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`;
        }
        catch (error) {
            console.error('Error uploading to IPFS:', error);
            throw new Error('Failed to upload to IPFS');
        }
    });
}
function uploadMetadata(metadata) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log('Uploading image to IPFS...');
            const imageResponse = yield axios_1.default.get(metadata.image, { responseType: 'arraybuffer' });
            const imageBuffer = Buffer.from(imageResponse.data);
            const imageUrl = yield uploadToIPFS(imageBuffer, {
                pinataMetadata: { name: `${metadata.name}_image.png` }
            });
            console.log('Image uploaded to IPFS:', imageUrl);
            const metadataWithIPFSImage = Object.assign(Object.assign({}, metadata), { image: imageUrl });
            console.log('Uploading metadata to IPFS...');
            const metadataBuffer = Buffer.from(JSON.stringify(metadataWithIPFSImage));
            const metadataUrl = yield uploadToIPFS(metadataBuffer, {
                pinataMetadata: { name: `${metadata.name}_metadata.json` },
                pinataOptions: { cidVersion: 0 }
            });
            console.log('Metadata uploaded to IPFS:', metadataUrl);
            return metadataUrl;
        }
        catch (error) {
            console.error('Error in uploadMetadata:', error);
            throw new Error('Failed to upload metadata');
        }
    });
}
function mintNFT(metadataUri, name) {
    return __awaiter(this, void 0, void 0, function* () {
        // This function is a placeholder for actual minting logic
        console.log('Minting NFT with metadata URI:', metadataUri);
        return metadataUri;
    });
}
