// BottomNavBar.jsx
// Usage: import BottomNavBar from './BottomNavBar';
// <BottomNavBar activeTab="Home" onTabChange={(tab) => console.log(tab)} />

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Platform,
} from 'react-native';
import { Svg, Path, Circle, G, Polyline, Line } from 'react-native-svg';

// --- Icons as inline SVG components ---
const ActivityIcon = ({ color, size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Polyline
      points="22 12 18 12 15 21 9 3 6 12 2 12"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const HomeIcon = ({ color, size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M9 22V12H15V22"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const ProfileIcon = ({ color, size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle
      cx="12"
      cy="8"
      r="4"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M4 20C4 16.6863 7.58172 14 12 14C16.4183 14 20 16.6863 20 20"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </Svg>
);

const TABS = [
  { key: 'Activities', label: 'Activities', Icon: ActivityIcon },
  { key: 'Home', label: 'Home', Icon: HomeIcon },
  { key: 'Profile', label: 'Profile', Icon: ProfileIcon },
];

const ACTIVE_COLOR = '#1565C0';
const INACTIVE_COLOR = '#90A4AE';
const BG_COLOR = '#FFFFFF';
const INDICATOR_COLOR = '#1565C0';

export default function BottomNavBar({ activeTab = 'Home', onTabChange }) {
  const [selected, setSelected] = useState(activeTab);

  // Animated scale per tab
  const scales = useRef(TABS.map(() => new Animated.Value(1))).current;
  const indicatorAnim = useRef(
    new Animated.Value(TABS.findIndex((t) => t.key === activeTab))
  ).current;

  const handlePress = (tabKey, index) => {
    // Bounce animation
    Animated.sequence([
      Animated.timing(scales[index], {
        toValue: 0.8,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.spring(scales[index], {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();

    // Slide indicator
    Animated.spring(indicatorAnim, {
      toValue: index,
      friction: 6,
      tension: 80,
      useNativeDriver: false,
    }).start();

    setSelected(tabKey);
    onTabChange && onTabChange(tabKey);
  };

  const tabWidth = 100 / TABS.length;

  return (
    <View style={styles.wrapper}>
      {/* Top border accent */}
      <View style={styles.topBorder} />

      {/* Sliding indicator */}
      <Animated.View
        style={[
          styles.indicator,
          {
            width: `${tabWidth}%`,
            left: indicatorAnim.interpolate({
              inputRange: TABS.map((_, i) => i),
              outputRange: TABS.map((_, i) => `${i * tabWidth}%`),
            }),
          },
        ]}
      />

      <View style={styles.container}>
        {TABS.map(({ key, label, Icon }, index) => {
          const isActive = selected === key;
          return (
            <TouchableOpacity
              key={key}
              style={styles.tab}
              onPress={() => handlePress(key, index)}
              activeOpacity={0.8}
            >
              <Animated.View
                style={[
                  styles.tabInner,
                  { transform: [{ scale: scales[index] }] },
                ]}
              >
                <View style={[styles.iconWrap, isActive && styles.iconWrapActive]}>
                  <Icon
                    color={isActive ? ACTIVE_COLOR : INACTIVE_COLOR}
                    size={22}
                  />
                </View>
                <Text
                  style={[
                    styles.label,
                    { color: isActive ? ACTIVE_COLOR : INACTIVE_COLOR },
                    isActive && styles.labelActive,
                  ]}
                >
                  {label}
                </Text>
              </Animated.View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: BG_COLOR,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  topBorder: {
    height: 1,
    backgroundColor: '#E3EAF2',
  },
  indicator: {
    position: 'absolute',
    top: 0,
    height: 3,
    backgroundColor: INDICATOR_COLOR,
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
  },
  container: {
    flexDirection: 'row',
    paddingBottom: Platform.OS === 'ios' ? 20 : 6,
    paddingTop: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
  },
  tabInner: {
    alignItems: 'center',
    paddingVertical: 4,
  },
  iconWrap: {
    width: 40,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  iconWrapActive: {
    backgroundColor: '#E8F0FE',
  },
  label: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2,
    letterSpacing: 0.2,
  },
  labelActive: {
    fontWeight: '700',
  },
});