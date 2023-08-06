import { ImageBackground } from 'react-native';
import bgImage from '../assets/images/bgAuth.jpeg';

const BgImage = ({ children }) => {
  return (
    <ImageBackground
      source={bgImage}
      resizeMode="cover"
      style={{
        flex: 1,
        justifyContent: 'flex-end',
      }}
    >
      {children}
    </ImageBackground>
  );
};
export default BgImage;
