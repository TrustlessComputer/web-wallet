import React, { useState } from 'react';
import useAsyncEffect from 'use-async-effect';
import { getFeeRate } from '@/services/bitcoin';
import { FeeRateName, IFeeRate } from '@/interfaces/api/bitcoin';
import { isNumeric } from '@/utils';

const useFeeRate = () => {
  const [selectedRate, setRate] = useState<FeeRateName>(FeeRateName.fastestFee);
  const [customRate, setCustomRate] = useState<string>('');

  const [loading, setLoading] = React.useState(false);
  const [feeRate, setFeeRate] = useState<IFeeRate>({
    fastestFee: 25,
    halfHourFee: 20,
    hourFee: 15,
  });

  const onFetchFee = async () => {
    setLoading(true);
    const rate = await getFeeRate();
    setFeeRate(rate);
    setLoading(false);
  };

  const onChangeFee = (fee: FeeRateName): void => {
    setRate(fee);
    setCustomRate('');
  };

  const onChangeCustomFee = (rate: string): void => {
    setCustomRate(rate);
  };

  useAsyncEffect(onFetchFee, []);

  const currentRate = React.useMemo(() => {
    return customRate && isNumeric(customRate) ? Number(customRate) : feeRate[selectedRate];
  }, [customRate, selectedRate, feeRate]);

  return {
    isLoading: loading,
    feeRate,
    currentRate,
    customRate,
    currentRateType: customRate ? undefined : selectedRate,

    onChangeFee,
    onChangeCustomFee,
  };
};

export default useFeeRate;
