import Colors from '@/constants/Colors';
import { useQuery } from '@tanstack/react-query';
import { Stack, useLocalSearchParams } from 'expo-router';
import {
  View,
  Image,
  Text,
  ScrollView,
  SectionList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';
import { useHeaderHeight } from '@react-navigation/elements';
import { defaultStyles } from '@/constants/Styles';
import { useEffect, useRef, useState } from 'react';
import { CartesianChart, Line, useChartPressState } from 'victory-native';
import Animated, { SharedValue, useAnimatedProps } from 'react-native-reanimated';
import { Circle, useFont } from '@shopify/react-native-skia';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
const categories = ['Overview', 'News', 'Orders', 'Transactions'];
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);
Animated.addWhitelistedNativeProps({ text: true });

function ToolTip({ x, y }: { x: SharedValue<number>; y: SharedValue<number> }) {
  return <Circle cx={x} cy={y} r={8} color={Colors.primary} />;
}

const Page = () => {
  // Use the ID to retrieve detailed information in a real scenario!
  const { id } = useLocalSearchParams();
  const headerHeight = useHeaderHeight();
  const itemsRef = useRef<Array<TouchableOpacity | null>>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const { state, isActive } = useChartPressState({ x: 0, y: { price: 0 } });
  const font = useFont(require('@/assets/fonts/SpaceMono-Regular.ttf'), 12);

  const { data: tickers } = useQuery({
    queryKey: ['tickers'],
    queryFn: async (): Promise<any[]> => {
      return await fetch(`/api/tickers`).then((res) => res.json());
    },
  });

  const { data: logo } = useQuery({
    queryKey: ['info', id],
    queryFn: async () => {
      const info = await fetch(`/api/info`).then((res) => res.json());
      const logo = info[+id].logo;
      return logo;
    },
  });

  useEffect(() => {
    if (isActive) Haptics.selectionAsync().catch(() => null);
  }, [isActive]);

  const animatedText = useAnimatedProps(() => {
    return {
      text: `${state.y.price.value.value.toFixed(2)} €`,
      defaultValue: '',
    };
  });

  const animatedDateText = useAnimatedProps(() => {
    const date = new Date(state.x.value.value);

    return {
      text: `${date.toLocaleDateString()}`,
      defaultValue: '',
    };
  });

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Bitcoin',
        }}
      />

      <SectionList
        contentInsetAdjustmentBehavior="automatic"
        style={{ marginTop: headerHeight }}
        scrollEnabled={true}
        stickySectionHeadersEnabled={true}
        keyExtractor={(i) => i.title}
        ListHeaderComponent={() => (
          <>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginHorizontal: 16,
              }}>
              <Text style={styles.subtitle}>BTC</Text>
              <Image source={{ uri: logo }} style={{ width: 60, height: 60 }} />
            </View>

            <View style={{ flexDirection: 'row', gap: 10, margin: 12 }}>
              <TouchableOpacity
                style={[
                  defaultStyles.pillButtonSmall,
                  { backgroundColor: Colors.primary, flexDirection: 'row', gap: 16 },
                ]}>
                <Ionicons name="add" size={24} color={'#fff'} />
                <Text style={[defaultStyles.buttonText, { color: '#fff' }]}>Buy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  defaultStyles.pillButtonSmall,
                  { backgroundColor: Colors.primaryMuted, flexDirection: 'row', gap: 16 },
                ]}>
                <Ionicons name="arrow-back" size={24} color={Colors.primary} />
                <Text style={[defaultStyles.buttonText, { color: Colors.primary }]}>Receive</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
        renderItem={({ item }) => (
          <>
            <View style={[defaultStyles.block, { height: 500 }]}>
              {tickers && (
                <>
                  {!isActive && (
                    <View>
                      <Text style={{ fontSize: 30, fontWeight: 'bold', color: Colors.dark }}>
                        {tickers[tickers.length - 1].price.toFixed(2)} €
                      </Text>
                      <Text style={{ fontSize: 18, color: Colors.gray }}>Today</Text>
                    </View>
                  )}
                  {isActive && (
                    <View>
                      <AnimatedTextInput
                        underlineColorAndroid="transparent"
                        editable={false}
                        style={{ fontSize: 30, fontWeight: 'bold', color: Colors.dark }}
                        animatedProps={animatedText}
                      />
                      <AnimatedTextInput
                        underlineColorAndroid="transparent"
                        editable={false}
                        style={{ fontSize: 18, color: Colors.gray }}
                        animatedProps={animatedDateText}
                      />
                    </View>
                  )}

                  <CartesianChart
                    data={tickers}
                    xKey="timestamp"
                    yKeys={['price']}
                    chartPressState={state}
                    axisOptions={{
                      font,
                      tickCount: 5,
                      labelOffset: { x: -2, y: 0 },
                      formatXLabel: (ms) => format(new Date(ms), 'MM/yy'),
                      formatYLabel: (v) => `${v} €`,
                      labelColor: Colors.gray,
                    }}>
                    {({ points }) => (
                      <>
                        <Line points={points.price} color="green" strokeWidth={3} />
                        {isActive && <ToolTip x={state.x.position} y={state.y.price.position} />}
                      </>
                    )}
                  </CartesianChart>
                </>
              )}
            </View>
            <View style={[defaultStyles.block, { marginTop: 20 }]}>
              <Text style={styles.subtitle}>Overview</Text>
              <Text style={{ color: Colors.gray }}>
                Bitcoin is a decentralized digital currency, without a central bank or single
                administrator, that can be sent from user to user on the peer-to-peer bitcoin
                network without the need for intermediaries. Transactions are verified by network
                nodes through cryptography and recorded in a public distributed ledger called a
                blockchain.
              </Text>
            </View>
          </>
        )}
        renderSectionHeader={() => (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              alignItems: 'center',
              width: '100%',
              justifyContent: 'space-between',
              paddingHorizontal: 12,
              paddingBottom: 8,
              backgroundColor: Colors.background,
              borderBottomColor: Colors.lightGray,
              borderBottomWidth: StyleSheet.hairlineWidth,
            }}>
            {categories.map((item, index) => (
              <TouchableOpacity
                ref={(el) => (itemsRef.current[index] = el)}
                key={index}
                style={activeIndex === index ? styles.categoriesBtnActive : styles.categoriesBtn}
                onPress={() => setActiveIndex(index)}>
                <Text
                  style={activeIndex === index ? styles.categoryTextActive : styles.categoryText}>
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
        sections={[{ data: [{ title: 'Chart' }] }]}
      />
    </>
  );
};

const styles = StyleSheet.create({
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: Colors.gray,
  },
  categoryText: {
    fontSize: 14,
    color: Colors.gray,
  },
  categoryTextActive: {
    fontSize: 14,
    color: '#000',
  },
  categoriesBtn: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  categoriesBtnActive: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
  },
});
export default Page;
