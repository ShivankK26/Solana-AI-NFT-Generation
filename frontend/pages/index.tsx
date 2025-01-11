import type { NextPage } from 'next';
import NFTForm from '../components/NFTForm';

const Home: NextPage = () => {
  return (
    <div className="container mx-auto px-4">
      <h1 className="text-4xl font-bold text-center my-8">AI NFT Generator</h1>
      <NFTForm />
    </div>
  );
};

export default Home;