import React, { useRef, useState } from 'react';
import {
  View, Text, StyleSheet, Dimensions, FlatList,
  TouchableOpacity, ViewToken,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import Svg, { Circle, Ellipse, Path, G, Rect, Line } from 'react-native-svg';
import Logo from '@/components/shared/Logo';
import { useAuth } from '@/context/AuthContext';
import { Colors } from '@/constants/Colors';
import { BorderRadius, FontSize, FontWeight, Spacing } from '@/constants/AppTheme';

const { width, height } = Dimensions.get('window');

// ── Illustrations ────────────────────────────────────────────────────────────

function Illustration1() {
  return (
    <Svg width={260} height={260} viewBox="0 0 260 260">
      {/* Globe */}
      <Circle cx="130" cy="130" r="90" fill="#EBF4FF" />
      <Circle cx="130" cy="130" r="75" fill="white" />
      {/* Phone */}
      <Rect x="100" y="90" width="60" height="100" rx="10" fill="#1D7FE8" />
      <Rect x="104" y="96" width="52" height="88" rx="6" fill="white" />
      {/* Connection dots */}
      <Circle cx="60" cy="90" r="18" fill="#EBF4FF" />
      <Circle cx="60" cy="90" r="12" fill="#1D7FE8" />
      <Circle cx="200" cy="100" r="18" fill="#EBF4FF" />
      <Circle cx="200" cy="100" r="12" fill="#7B2FFF" />
      <Circle cx="80" cy="180" r="15" fill="#EBF4FF" />
      <Circle cx="80" cy="180" r="10" fill="#22C55E" />
      <Circle cx="185" cy="175" r="15" fill="#EBF4FF" />
      <Circle cx="185" cy="175" r="10" fill="#F59E0B" />
      {/* Lines */}
      <Line x1="100" y1="130" x2="72" y2="90" stroke="#1D7FE8" strokeWidth="1.5" strokeDasharray="4 3" />
      <Line x1="160" y1="130" x2="188" y2="100" stroke="#7B2FFF" strokeWidth="1.5" strokeDasharray="4 3" />
      <Line x1="115" y1="190" x2="90" y2="180" stroke="#22C55E" strokeWidth="1.5" strokeDasharray="4 3" />
      <Line x1="145" y1="190" x2="175" y2="175" stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="4 3" />
      {/* Chat bubbles */}
      <Rect x="50" y="60" width="36" height="20" rx="10" fill="#1D7FE8" />
      <Circle cx="58" cy="70" r="3" fill="white" />
      <Circle cx="68" cy="70" r="3" fill="white" />
      <Circle cx="78" cy="70" r="3" fill="white" />
      <Rect x="174" y="65" width="36" height="20" rx="10" fill="#7B2FFF" />
      <Circle cx="182" cy="75" r="3" fill="white" />
      <Circle cx="192" cy="75" r="3" fill="white" />
      <Circle cx="202" cy="75" r="3" fill="white" />
    </Svg>
  );
}

function Illustration2() {
  return (
    <Svg width={260} height={260} viewBox="0 0 260 260">
      <Circle cx="130" cy="130" r="100" fill="#EBF4FF" />
      <Circle cx="130" cy="130" r="72" fill="#1D7FE8" opacity="0.12" />
      <Circle cx="130" cy="130" r="44" fill="#1D7FE8" opacity="0.18" />
      {/* People in circle */}
      {[0, 60, 120, 180, 240, 300].map((deg, i) => {
        const rad = (deg * Math.PI) / 180;
        const cx = 130 + 85 * Math.cos(rad);
        const cy = 130 + 85 * Math.sin(rad);
        const colors = ['#1D7FE8','#7B2FFF','#F43F5E','#22C55E','#F59E0B','#EC4899'];
        return (
          <G key={i}>
            <Circle cx={cx} cy={cy} r={22} fill="white" />
            <Circle cx={cx} cy={cy - 6} r={9} fill={colors[i]} opacity={0.9} />
            <Ellipse cx={cx} cy={cy + 14} rx={11} ry={7} fill={colors[i]} opacity={0.6} />
          </G>
        );
      })}
      <Circle cx="130" cy="130" r="28" fill="#1D7FE8" />
      <Circle cx="130" cy="122" r="11" fill="white" />
      <Ellipse cx="130" cy="142" rx="14" ry="9" fill="white" opacity="0.9" />
    </Svg>
  );
}

function Illustration3() {
  return (
    <Svg width={260} height={260} viewBox="0 0 260 260">
      <Circle cx="130" cy="130" r="100" fill="#EBF4FF" />
      {/* Person relaxing */}
      <Ellipse cx="110" cy="190" rx="50" ry="28" fill="#7B2FFF" opacity="0.3" />
      <Circle cx="120" cy="150" r="22" fill="#F59E0B" opacity="0.9" />
      <Rect x="85" y="168" width="70" height="45" rx="15" fill="#1D7FE8" />
      {/* Screens around */}
      <Rect x="155" y="90" width="70" height="50" rx="8" fill="white" />
      <Rect x="158" y="93" width="64" height="40" rx="5" fill="#EBF4FF" />
      <Rect x="162" y="97" width="30" height="8" rx="3" fill="#1D7FE8" />
      <Rect x="162" y="109" width="50" height="5" rx="2" fill="#E5E7EB" />
      <Rect x="162" y="117" width="40" height="5" rx="2" fill="#E5E7EB" />
      {/* Chat bubbles */}
      <Rect x="40" y="100" width="60" height="36" rx="10" fill="white" />
      <Rect x="44" y="104" width="52" height="5" rx="2" fill="#E5E7EB" />
      <Rect x="44" y="113" width="38" height="5" rx="2" fill="#E5E7EB" />
      <Rect x="44" y="122" width="44" height="5" rx="2" fill="#E5E7EB" />
      {/* Chat dots */}
      <Rect x="155" y="160" width="80" height="40" rx="10" fill="white" />
      <Circle cx="175" cy="180" r="5" fill="#1D7FE8" />
      <Circle cx="195" cy="180" r="5" fill="#7B2FFF" />
      <Circle cx="215" cy="180" r="5" fill="#22C55E" />
    </Svg>
  );
}

function Illustration4() {
  return (
    <Svg width={260} height={260} viewBox="0 0 260 260">
      <Circle cx="130" cy="130" r="100" fill="#EBF4FF" />
      {/* Two people with phones */}
      {/* Person 1 */}
      <Circle cx="85" cy="100" r="24" fill="#F59E0B" opacity="0.85" />
      <Rect x="60" y="122" width="50" height="60" rx="14" fill="#1D7FE8" />
      <Rect x="78" y="148" width="28" height="44" rx="6" fill="#EBF4FF" />
      <Rect x="80" y="152" width="24" height="36" rx="4" fill="white" />
      {/* Person 2 */}
      <Circle cx="175" cy="105" r="24" fill="#EC4899" opacity="0.85" />
      <Rect x="150" y="127" width="50" height="60" rx="14" fill="#7B2FFF" />
      <Rect x="148" y="148" width="28" height="44" rx="6" fill="#EBF4FF" />
      <Rect x="150" y="152" width="24" height="36" rx="4" fill="white" />
      {/* Connection */}
      <Path d="M115 130 Q130 115 145 130" stroke="#1D7FE8" strokeWidth="2.5" fill="none" strokeDasharray="5 4" />
      {/* Hearts */}
      <Circle cx="130" cy="100" r="16" fill="white" />
      <Path d="M130 110 L122 102 A6 6 0 0 1 130 94 A6 6 0 0 1 138 102 Z" fill="#F43F5E" />
    </Svg>
  );
}

// ── Slide Data ───────────────────────────────────────────────────────────────

const slides = [
  { id: '0', title: '', subtitle: '', isFirst: true },
  { id: '1', title: 'Find Friends & Get Inspiration', subtitle: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Erat vitae quis quam augue quam a.', isFirst: false },
  { id: '2', title: 'Meet Awesome People & Enjoy yourself', subtitle: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Erat vitae quis quam augue quam a.', isFirst: false },
  { id: '3', title: 'Hangout with Friends', subtitle: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Erat vitae quis quam augue quam a.', isFirst: false },
];

const illustrations = [Illustration1, Illustration2, Illustration3, Illustration4];

export default function OnboardingScreen() {
  const router = useRouter();
  const { completeOnboarding } = useAuth();
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index ?? 0);
    }
  }).current;

  async function handleJoinNow() {
    await completeOnboarding();
    router.replace('/(auth)');
  }

  function handleSignIn() {
    completeOnboarding().then(() => router.replace('/(auth)'));
  }

  function handleNext() {
    if (activeIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: activeIndex + 1, animated: true });
    } else {
      handleJoinNow();
    }
  }

  const isFirst = activeIndex === 0;

  return (
    <LinearGradient colors={[Colors.gradientStart, Colors.gradientEnd]} style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={slides}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        renderItem={({ item, index }) => {
          const Illust = illustrations[index];
          return (
            <View style={styles.slide}>
              <View style={styles.illustrationWrapper}>
                <Illust />
              </View>
              {item.isFirst && (
                <View style={styles.logoCenter}>
                  <Logo size="lg" />
                </View>
              )}
              {!item.isFirst && (
                <View style={styles.textBlock}>
                  <Text style={styles.title}>{item.title}</Text>
                  <Text style={styles.subtitle}>{item.subtitle}</Text>
                </View>
              )}
            </View>
          );
        }}
      />

      {/* Dots */}
      <View style={styles.dotsRow}>
        {slides.map((_, i) => (
          <View key={i} style={[styles.dot, i === activeIndex && styles.dotActive]} />
        ))}
      </View>

      {/* Buttons - hidden on first slide */}
      {!isFirst && (
        <View style={styles.buttons}>
          <TouchableOpacity style={styles.joinBtn} onPress={handleNext} activeOpacity={0.88}>
            <Text style={styles.joinBtnText}>
              {activeIndex === slides.length - 1 ? 'Join Now' : 'Join Now'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSignIn} style={styles.signInBtn}>
            <Text style={styles.signInText}>Sign in</Text>
          </TouchableOpacity>
        </View>
      )}

      {isFirst && <View style={{ height: 120 }} />}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  slide: {
    width,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xxl,
  },
  illustrationWrapper: {
    marginTop: height * 0.08,
    marginBottom: Spacing.xl,
    alignItems: 'center',
  },
  logoCenter: {
    marginTop: Spacing.base,
    alignItems: 'center',
  },
  textBlock: {
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
  },
  title: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: FontSize.base,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.xs + 2,
    marginBottom: Spacing.xl,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.border,
  },
  dotActive: {
    width: 24,
    backgroundColor: Colors.primary,
  },
  buttons: {
    paddingHorizontal: Spacing.xxl,
    paddingBottom: Spacing.xxxl,
    gap: Spacing.md,
  },
  joinBtn: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.full,
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  joinBtnText: {
    color: Colors.text.white,
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
  },
  signInBtn: { alignItems: 'center', paddingVertical: Spacing.sm },
  signInText: { color: Colors.primary, fontSize: FontSize.base, fontWeight: FontWeight.medium },
});
