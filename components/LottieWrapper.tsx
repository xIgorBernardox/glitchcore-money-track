import LottieView from 'lottie-react-native';

type Props = {
  source: any;
  loop?: boolean;
  autoPlay?: boolean;
  style?: any;
  onAnimationFinish?: () => void;
};

const LottieWrapper = ({
  source,
  loop = false,
  autoPlay = true,
  style,
  onAnimationFinish,
}: Props) => {
  return (
    <LottieView
      source={source}
      loop={loop}
      autoPlay={autoPlay}
      style={style}
      onAnimationFinish={onAnimationFinish}
    />
  );
};

export default LottieWrapper;
