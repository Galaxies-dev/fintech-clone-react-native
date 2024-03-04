import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MARGIN } from './Config';
import Tile from './Tile';
import SortableList from './SortableList';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { View } from 'react-native';

const tiles = [
  {
    id: 'spent',
  },
  {
    id: 'cashback',
  },
  {
    id: 'recent',
  },
  {
    id: 'cards',
  },
];

const WidgetList = () => {
  return (
    <GestureHandlerRootView
      style={{
        paddingHorizontal: MARGIN,
      }}>
      <SortableList
        editing={true}
        onDragEnd={(positions) => console.log(JSON.stringify(positions, null, 2))}>
        {[...tiles].map((tile, index) => (
          <Tile onLongPress={() => true} key={tile.id + '-' + index} id={tile.id} />
        ))}
      </SortableList>
    </GestureHandlerRootView>
  );
};

export default WidgetList;
