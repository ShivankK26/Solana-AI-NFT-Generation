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
exports.generateImage = generateImage;
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const DALLE_API_KEY = process.env.DALLE_API_KEY;
function generateImage(prompt) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.post('https://api.openai.com/v1/images/generations', {
                prompt: prompt,
                n: 1,
                size: '1024x1024',
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${DALLE_API_KEY}`,
                },
            });
            return response.data.data[0].url;
        }
        catch (error) {
            console.error('Error generating image:', error);
            throw new Error('Failed to generate image');
        }
    });
}
