import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";


const { width, height } = Dimensions.get('window');

// Responsive dimensions
const wp = (percentage: number) => {
  return (width * percentage) / 100;
};

const hp = (percentage: number) => {
  return (height * percentage) / 100;
};

interface OfferCardProps {
  icon: string;
  title: string;
  category: string;
  amount: string;
  description: string;
  iconBgColor: string;
}

const OfferCard: React.FC<OfferCardProps> = ({
  icon,
  title,
  category,
  amount,
  description,
  iconBgColor,
}) => (
  <View style={styles.offerCard}>
    <View style={styles.offerContent}>
      <View style={[styles.offerIcon, { backgroundColor: iconBgColor }]}>
        <Text style={styles.offerEmoji}>{icon}</Text>
      </View>
      
      <View style={styles.offerInfo}>
        <Text style={styles.offerTitle}>{title}</Text>
        <Text style={styles.offerCategory}>{category}</Text>
        <Text style={styles.offerDescription}>{description}</Text>
      </View>
      
      <View style={styles.offerRight}>
        <Text style={styles.offerAmount}>{amount}</Text>
        <TouchableOpacity style={styles.redeemButton}>
          <Text style={styles.redeemButtonText}>Redeem Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
);

const Offer = () => {
  const offers = [
    {
      icon: '📺',
      title: 'Subscription of OTTs',
      category: 'Entertainment',
      amount: '£30.00',
      description: 'Purchase one time subscriptions of all OTTs instead of buying every OTTs subscription and save More.',
      iconBgColor: '#EDE9FE',
    },
    {
      icon: '☕',
      title: 'Starbuck Coffee',
      category: 'Food & Drink',
      amount: '£25.00',
      description: 'Purchase one time subscriptions of all OTTs instead of buying every OTTs subscription and save More.',
      iconBgColor: '#DCFCE7',
    },
    {
      icon: '🎵',
      title: 'Music Subscription',
      category: 'Entertainment',
      amount: '£10.00',
      description: 'Purchase one time subscriptions of all OTTs instead of buying every OTTs subscription and save More.',
      iconBgColor: '#FEF3C7',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Offers</Text>
      </View>

      {/* Section Header */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Offers for you</Text>
        <TouchableOpacity style={styles.viewAllButton}>
          <Text style={styles.viewAllText}>View All</Text>
        </TouchableOpacity>
      </View>

      {/* Offers List */}
      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {offers.map((offer, index) => (
          <OfferCard
            key={index}
            icon={offer.icon}
            title={offer.title}
            category={offer.category}
            amount={offer.amount}
            description={offer.description}
            iconBgColor={offer.iconBgColor}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,

  },
  header: {
    paddingHorizontal: wp(4),
    paddingVertical: hp(2),
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: wp(6),
    fontWeight: 'bold',
    color: '#1F2937',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: wp(4),
    paddingVertical: hp(1),
    backgroundColor: '#F9FAFB',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  sectionTitle: {
    fontSize: wp(4),
    fontWeight: '600',
    color: '#1F2937',
  },
  viewAllButton: {
    backgroundColor: '#00A0EE',
    borderRadius: wp(6),
    height:30,
    alignItems:"center",
    justifyContent: "center",
    width:60,
  },
  viewAllText: {
    color: '#FFFFFF',
    fontSize: wp(3),
    fontWeight: '500',
  },
  content: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollContent: {
    paddingTop: hp(2),
  },
  offerCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: wp(4),
    marginBottom: hp(2),
    borderRadius: wp(3),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  offerContent: {
    flexDirection: 'row',
    padding: wp(4),
    alignItems: 'flex-start',
  },
  offerIcon: {
    width: wp(12),
    height: wp(12),
    borderRadius: wp(6),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp(3),
  },
  offerEmoji: {
    fontSize: wp(6),
  },
  offerInfo: {
    flex: 1,
    marginRight: wp(3),
  },
  offerTitle: {
    fontSize: wp(4),
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: hp(0.3),
  },
  offerCategory: {
    fontSize: wp(3),
    color: '#6B7280',
    marginBottom: hp(1),
  },
  offerDescription: {
    fontSize: wp(3),
    color: '#6B7280',
    lineHeight: wp(4.5),
  },
  offerRight: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    minHeight: hp(8),
  },
  offerAmount: {
    fontSize: wp(5),
    fontWeight: 'bold',
    color: '#059669',
    marginBottom: hp(1),
  },
  redeemButton: {
    backgroundColor: '#FB923C',
    paddingHorizontal: wp(4),
    paddingVertical: hp(1),
    borderRadius: wp(1.5),
  },
  redeemButtonText: {
    color: '#FFFFFF',
    fontSize: wp(3),
    fontWeight: '600',
  },
});

export default Offer;