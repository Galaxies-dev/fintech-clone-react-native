import Dropdown from '@/components/Dropdown';
import RoundBtn from '@/components/RoundBtn';
import WidgetList from '@/components/SortableList/WidgetList';
import Colors from '@/constants/Colors';
import { defaultStyles } from '@/constants/Styles';
import { useBalanceStore } from '@/store/balanceStore';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { ScrollView, Text, StyleSheet, View, TouchableOpacity, Button } from 'react-native';

const Page = () => {
  const { balance, runTransaction, transactions, clearTransactions } = useBalanceStore();

  const onAddMoney = () => {
    const foo = Math.random() > 0.5 ? 1 : -1;
    console.log('foo', foo);

    runTransaction({
      id: Math.random().toString(),
      title: 'Add money',
      amount: Math.floor(Math.random() * 1000) * (Math.random() > 0.5 ? 1 : -1),
      date: new Date(),
    });
  };

  return (
    <ScrollView style={{ backgroundColor: Colors.background }}>
      <View style={styles.account}>
        <View style={styles.row}>
          <Text style={styles.balance}>{balance()}</Text>
          <Text style={styles.currency}>€</Text>
        </View>
        <TouchableOpacity
          style={[
            defaultStyles.pillButtonSmall,
            { backgroundColor: Colors.lightGray, marginVertical: 20 },
          ]}>
          <Text style={[defaultStyles.buttonTextSmall, { color: Colors.dark }]}>Accounts</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.actionRow}>
        <RoundBtn icon={'add'} text={'Add money'} onPress={onAddMoney} />
        <RoundBtn icon={'refresh'} text={'Exchange'} onPress={clearTransactions} />
        <RoundBtn icon={'list'} text={'Details'} />
        <Dropdown />
      </View>

      <Text style={styles.sectionHeader}>Transactions</Text>

      <View style={styles.transactions}>
        {transactions.length === 0 && (
          <Text style={{ padding: 14, color: Colors.gray }}>No transactions yet</Text>
        )}
        {transactions.length > 0 &&
          transactions.map((transaction) => (
            <View
              key={transaction.id}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
              <View style={styles.circle}>
                <Ionicons
                  name={transaction.amount > 0 ? 'add' : 'remove'}
                  size={30}
                  color={Colors.dark}
                />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: '400' }}>{transaction.title}</Text>
                <Text style={{ color: Colors.gray, fontSize: 12 }}>
                  {transaction.date.toLocaleString()}
                </Text>
              </View>
              <Text>{transaction.amount}€</Text>
            </View>
          ))}
      </View>

      <Text style={styles.sectionHeader}>Widgets</Text>
      <WidgetList />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  account: {
    margin: 80,
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    gap: 10,
  },
  balance: {
    fontSize: 40,
    fontWeight: 'bold',
  },
  currency: {
    fontSize: 20,
    fontWeight: '500',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },
  transactions: {
    marginHorizontal: 20,
    padding: 14,
    backgroundColor: '#fff',
    borderRadius: 16,
    gap: 20,
  },
  circle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    margin: 20,
    marginBottom: 10,
  },
});

export default Page;
