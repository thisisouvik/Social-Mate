import React, { useState, useEffect } from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';

interface AvatarProps {
  uri?: string;
  name?: string;
  size?: number;
  showOnline?: boolean;
  style?: object;
}

export default function Avatar({ uri, name, size = 40, showOnline = false, style }: AvatarProps) {
  const [imgError, setImgError] = useState(false);

  // Reset error state whenever the URI changes (e.g. after a new photo is uploaded)
  useEffect(() => {
    setImgError(false);
  }, [uri]);

  const initials = name ? name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() : '?';
  const radius = size / 2;

  // Show image only if URI exists AND hasn't errored out
  const showImage = !!uri && !imgError;

  return (
    <View style={[{ width: size, height: size }, style]}>
      {showImage ? (
        <Image
          source={{ uri, cache: 'reload' }}
          style={{ width: size, height: size, borderRadius: radius }}
          onError={() => setImgError(true)}
        />
      ) : (
        <View style={[styles.placeholder, { width: size, height: size, borderRadius: radius }]}>
          <Text style={[styles.initials, { fontSize: size * 0.35 }]}>{initials}</Text>
        </View>
      )}
      {showOnline && (
        <View style={[styles.onlineDot, { width: size * 0.28, height: size * 0.28, borderRadius: size * 0.14, bottom: 0, right: 0 }]} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  placeholder: {
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    color: Colors.primary,
    fontWeight: '700',
  },
  onlineDot: {
    position: 'absolute',
    backgroundColor: Colors.online,
    borderWidth: 2,
    borderColor: Colors.background,
  },
});

