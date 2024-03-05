import Colors from '@/constants/Colors';
import { useQuery } from '@tanstack/react-query';
import { Stack, useLocalSearchParams } from 'expo-router';
import { View, Text, ScrollView, SectionList, TouchableOpacity, StyleSheet } from 'react-native';
import { useHeaderHeight } from '@react-navigation/elements';
import { defaultStyles } from '@/constants/Styles';
import { useRef, useState } from 'react';

const categories = ['Overview', 'News', 'Orders', 'Transactions'];

const Page = () => {
  const { id } = useLocalSearchParams();
  const headerHeight = useHeaderHeight();
  const itemsRef = useRef<Array<TouchableOpacity | null>>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const tickers = useQuery({
    queryKey: ['tickers'],
    queryFn: async () => {
      return await fetch(`/api/tickers`).then((res) => res.json());
    },
  });

  const selectCategory = (index: number) => {
    const selected = itemsRef.current[index];
    setActiveIndex(index);
    // selected?.measure((x) => {
    //   scrollRef.current?.scrollTo({ x: x - 16, y: 0, animated: true });
    // });
    // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // onCategoryChanged(categories[index].name);
  };

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
        renderItem={({ item }) => (
          <View style={defaultStyles.block}>
            <Text>CHART</Text>
          </View>
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
                onPress={() => selectCategory(index)}>
                <Text
                  style={activeIndex === index ? styles.categoryTextActive : styles.categoryText}>
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
        sections={[{ data: [{ title: 'aaa' }] }]}
      />
      {/* </ScrollView> */}
    </>
  );
};

const styles = StyleSheet.create({
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
