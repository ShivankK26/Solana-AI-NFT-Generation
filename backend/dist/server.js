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
const express_1 = __importDefault(require("express"));
const imageGenerator_1 = require("./imageGenerator");
const nftMetadata_1 = require("./nftMetadata");
const nftMinter_1 = require("./nftMinter");
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.post('/generate-nft', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('Received request:', req.body);
        const { prompt, name, description, owner } = req.body;
        console.log('Generating image...');
        const imageUrl = yield (0, imageGenerator_1.generateImage)(prompt);
        console.log('Image generated:', imageUrl);
        console.log('Creating metadata...');
        const metadata = (0, nftMetadata_1.createNFTMetadata)(name, description, imageUrl, owner);
        console.log('Metadata created:', metadata);
        console.log('Uploading metadata to IPFS...');
        const metadataUri = yield (0, nftMinter_1.uploadMetadata)(metadata);
        console.log('Metadata uploaded to IPFS:', metadataUri);
        res.json({ success: true, metadataUri, imageUrl });
    }
    catch (error) {
        console.error('Detailed error:', error);
        if (error instanceof Error) {
            console.error('Error message:', error.message);
            console.error('Error stack:', error.stack);
        }
        res.status(500).json({ success: false, error: 'Failed to generate NFT', details: error instanceof Error ? error.message : 'Unknown error' });
    }
}));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
