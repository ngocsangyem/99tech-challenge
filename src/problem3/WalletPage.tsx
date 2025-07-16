import React, { useMemo } from 'react';

// Proper TypeScript interfaces
type Blockchain = 'Osmosis' | 'Ethereum' | 'Arbitrum' | 'Zilliqa' | 'Neo';

interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: Blockchain; // Added missing blockchain property
}

interface FormattedWalletBalance extends WalletBalance {
  formatted: string;
}

interface BoxProps {
  className?: string;
  children?: React.ReactNode;
}

// Use BoxProps directly instead of empty interface
type WalletPageProps = BoxProps;

// Mock hooks - these would come from actual implementations
const useWalletBalances = (): WalletBalance[] => {
  // Mock implementation with sample data
  return [
    { currency: 'ETH', amount: 1.5, blockchain: 'Ethereum' },
    { currency: 'OSMO', amount: 100, blockchain: 'Osmosis' },
    { currency: 'ARB', amount: 0, blockchain: 'Arbitrum' }, // Zero balance to test filtering
    { currency: 'ZIL', amount: 500, blockchain: 'Zilliqa' },
  ];
};

const usePrices = (): Record<string, number> => {
  // Mock implementation
  return {
    ETH: 2000,
    OSMO: 1.5,
    ARB: 1.2,
    ZIL: 0.02,
  };
};

// Mock component with proper typing
const WalletRow: React.FC<{
  className?: string;
  amount: number;
  usdValue: number;
  formattedAmount: string;
  currency: string;
}> = ({ className, amount, usdValue, formattedAmount, currency }) => (
  <div className={className}>
    <span>{currency}: {formattedAmount}</span>
    <span>USD: ${usdValue.toFixed(2)}</span>
  </div>
);

// Move utility function outside component to prevent recreation
const getPriority = (blockchain: Blockchain): number => {
  switch (blockchain) {
    case 'Osmosis':
      return 100;
    case 'Ethereum':
      return 50;
    case 'Arbitrum':
      return 30;
    case 'Zilliqa':
      return 20;
    case 'Neo':
      return 20;
    default:
      return -99;
  }
};

const WalletPage: React.FC<WalletPageProps> = (props) => {
  const { ...rest } = props; // Removed unused children destructuring
  const balances = useWalletBalances();
  const prices = usePrices();

  // Memoized sorted and filtered balances
  const sortedBalances = useMemo(() => {
    return balances
      .filter((balance: WalletBalance) => {
        const balancePriority = getPriority(balance.blockchain);
        // Fixed logic: show balances with positive amounts and valid priority
        return balancePriority > -99 && balance.amount > 0;
      })
      .sort((lhs: WalletBalance, rhs: WalletBalance) => {
        const leftPriority = getPriority(lhs.blockchain);
        const rightPriority = getPriority(rhs.blockchain);
        
        if (leftPriority > rightPriority) {
          return -1;
        } else if (rightPriority > leftPriority) {
          return 1;
        }
        return 0; // Fixed: return 0 for equal priorities
      });
  }, [balances]); // Removed prices from dependency array as it's not used

  // Memoized formatted balances
  const formattedBalances = useMemo((): FormattedWalletBalance[] => {
    return sortedBalances.map((balance: WalletBalance) => ({
      ...balance,
      formatted: balance.amount.toFixed(6), // More precise formatting
    }));
  }, [sortedBalances]);

  // Memoized rows with proper error handling
  const rows = useMemo(() => {
    return formattedBalances.map((balance: FormattedWalletBalance) => {
      const price = prices[balance.currency];
      const usdValue = price ? price * balance.amount : 0;
      
      return (
        <WalletRow 
          key={`${balance.currency}-${balance.blockchain}`} // Unique key instead of index
          amount={balance.amount}
          usdValue={usdValue}
          formattedAmount={balance.formatted}
          currency={balance.currency}
        />
      );
    });
  }, [formattedBalances, prices]);

  // Error handling for empty states
  if (!balances || balances.length === 0) {
    return (
      <div {...rest}>
        <p>No wallet balances available</p>
      </div>
    );
  }

  if (rows.length === 0) {
    return (
      <div {...rest}>
        <p>No balances to display</p>
      </div>
    );
  }

  return (
    <div {...rest}>
      {rows}
    </div>
  );
};

export default WalletPage;
