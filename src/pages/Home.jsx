import Crop from '../components/Crop';
import Weather from '../components/Weather';

const Home = () => {
  return (
    <div className="container mx-auto p-4">
      <Weather />
      <Crop/>
    </div>
    
  );
};

export default Home;