import React from 'react';
import { Image, View, StyleSheet } from 'react-native';

interface AvatarImageProps {
  avatarUrl: string | null;
  size: number;
  round?: boolean;
}

const AvatarImage: React.FC<AvatarImageProps> = ({ avatarUrl, size, round = false }) => {
  const avatarSize = { width: size, height: size};

  const borderStyle = round ? { borderRadius: 100 } : {};
  return (
    <View>
      {avatarUrl ? (
        <Image
          source={{ uri: avatarUrl }}
          accessibilityLabel="Avatar"
          style={[avatarSize, styles.avatar, styles.image, borderStyle]}
        />
      ) : (
        <View style={[avatarSize, styles.avatar, styles.noImage, borderStyle]} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e1e1e1',
  },
  image: {
    resizeMode: 'cover',
  },
  noImage: {
    backgroundColor: '#ccc',
  },
});

export default AvatarImage;