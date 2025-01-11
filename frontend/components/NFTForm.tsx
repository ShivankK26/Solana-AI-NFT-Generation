import React, { useState } from 'react';
import axios from 'axios';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletNotConnectedError } from '@solana/wallet-adapter-base';
import { Metaplex, walletAdapterIdentity } from "@metaplex-foundation/js";
import { Connection, PublicKey } from "@solana/web3.js";
import dynamic from 'next/dynamic';

const WalletMultiButton = dynamic(
  () => import('@solana/wallet-adapter-react-ui').then((mod) => mod.WalletMultiButton),
  { ssr: false }
);

const NFTForm: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [minting, setMinting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [mintedAddress, setMintedAddress] = useState<string | null>(null);
  const wallet = useWallet();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wallet.connected || !wallet.publicKey) {
      alert('Please connect your wallet first!');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('http://localhost:3000/generate-nft', {
        prompt,
        name,
        description,
        owner: wallet.publicKey.toBase58()
      });
      console.log('Server response:', response.data);
      setResult(response.data);
    } catch (error) {
      console.error('Error generating NFT:', error);
      setError('Failed to generate NFT. Please try again.');
      setResult(null);
    }
    setLoading(false);
  };

  const handleMint = async () => {
    if (!wallet.connected || !wallet.publicKey) {
      throw new WalletNotConnectedError();
    }

    if (!result || !result.metadataUri) {
      alert('Please generate an NFT first!');
      return;
    }

    setMinting(true);
    try {
      const connection = new Connection("https://api.devnet.solana.com");
      const metaplex = Metaplex.make(connection)
        .use(walletAdapterIdentity(wallet));

      const { nft } = await metaplex.nfts().create({
        uri: result.metadataUri,
        name: name,
        sellerFeeBasisPoints: 500,
      });

      console.log('NFT minted:', nft.address.toBase58());
      setMintedAddress(nft.address.toBase58());
    } catch (error) {
      console.error('Error minting NFT:', error);
      setError('Failed to mint NFT. Please try again.');
    }
    setMinting(false);
  };

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-gray-900 via-purple-900 to-violet-800">
      {/* Animated Background */}
      <div className="mesh-gradient"></div>

      {/* Content Container */}
      <div className="relative z-10">
        {/* Header */}
        <div className="fixed top-0 left-0 right-0 bg-black/30 backdrop-blur-md border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                AI NFT Generator
              </h1>
              <WalletMultiButton className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg shadow-lg transition-all duration-300" />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Form Section */}
            <div className="w-full lg:w-1/2">
              <div className="glass-effect rounded-xl p-6 shadow-2xl">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <input
                        type="text"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Describe your NFT image..."
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Name your NFT"
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Describe your NFT"
                        rows={4}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-medium shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    disabled={loading || !wallet.connected}
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Generating...
                      </div>
                    ) : 'Generate NFT'}
                  </button>
                </form>
                {error && (
                  <div className="mt-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200">
                    {error}
                  </div>
                )}
              </div>
            </div>

            {/* Preview Section */}
            <div className="w-full lg:w-1/2">
              <div className="glass-effect rounded-xl p-6 shadow-2xl">
                {result ? (
                  <div className="space-y-6">
                    <div className="relative group">
                      <div className="aspect-square rounded-lg overflow-hidden bg-black/20">
                        <img 
                          src={result.imageUrl} 
                          alt="Generated NFT" 
                          className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="absolute bottom-0 left-0 right-0 p-6">
                            <h3 className="text-xl font-bold text-white">{name}</h3>
                            <p className="text-sm text-gray-200 mt-2">{description}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleMint}
                      className="w-full py-3 px-6 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-lg font-medium shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                      disabled={minting}
                    >
                      {minting ? (
                        <div className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Minting...
                        </div>
                      ) : 'Mint NFT'}
                    </button>
                  </div>
                ) : (
                  <div className="aspect-square flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-white/20 rounded-lg bg-white/5">
                    <svg className="w-16 h-16 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-lg opacity-50">Generate an NFT to see preview</p>
                  </div>
                )}
                
                {mintedAddress && (
                  <div className="mt-6 p-4 bg-emerald-500/20 border border-emerald-500/50 rounded-lg text-emerald-200">
                    <h3 className="font-semibold flex items-center">
                      <span className="mr-2">NFT Minted Successfully!</span>
                      <span className="text-2xl">🎉</span>
                    </h3>
                    <p className="text-sm break-all mt-2">
                      <span className="font-medium">Address:</span> {mintedAddress}
                    </p>
                    <a 
                      href={`https://explorer.solana.com/address/${mintedAddress}?cluster=devnet`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-400 hover:text-blue-300 hover:underline mt-2 inline-flex items-center"
                    >
                      View on Solana Explorer
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NFTForm;