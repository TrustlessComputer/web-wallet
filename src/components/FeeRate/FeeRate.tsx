import { Container, Content, ItemWrapper } from '@/components/FeeRate/styled';
import React, { useRef } from 'react';
import Text from '@/components/Text';
import { FeeRateName, IFeeRate } from '@/interfaces/api/bitcoin';
import * as TC_SDK from 'trustless-computer-sdk';
import BigNumber from 'bignumber.js';
import { formatBTCPrice } from '@/utils/format';

interface IProps {
  isLoading: boolean;
  isCustom: boolean;
  allRate: IFeeRate;
  currentRate: number;
  currentRateType: FeeRateName | undefined;
  customRate: string;

  onChangeFee: (rate: FeeRateName) => void;
  onChangeCustomFee?: (rate: string) => void;

  options?: {
    type: 'inscribe';
    sizeByte: number | undefined;
  };
}

const FeeRate = React.memo((props: IProps) => {
  const customRef = useRef<HTMLInputElement>(null);

  const onChangeFee = (rate: FeeRateName) => {
    props.onChangeFee(rate);
  };

  const onEditCustomFee = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (typeof props.onChangeCustomFee === 'function') {
      props.onChangeCustomFee(event.target.value);
    }
  };

  const calcAmount = (feeRatePerByte: number | string) => {
    const options = props.options;
    if (options && options.type === 'inscribe' && options.sizeByte) {
      const estimatedFee = TC_SDK.estimateInscribeFee({
        feeRatePerByte: Number(feeRatePerByte),
        tcTxSizeByte: options.sizeByte,
      });
      return {
        amount: formatBTCPrice(estimatedFee.totalFee.integerValue(BigNumber.ROUND_CEIL).toNumber()),
        symbol: 'BTC',
      };
    }
    return {
      amount: undefined,
      symbol: 'BTC',
    };
  };

  const renderItem = (rateName: FeeRateName) => {
    let title = 'Economy';
    switch (rateName) {
      case FeeRateName.hourFee:
        title = 'Economy';
        break;
      case FeeRateName.halfHourFee:
        title = 'Faster';
        break;
      case FeeRateName.fastestFee:
        title = 'Fastest';
        break;
    }
    const isActive = rateName === props.currentRateType && props.currentRateType !== undefined;
    const { amount, symbol } = calcAmount(props.allRate[rateName]);
    return (
      <ItemWrapper onClick={() => onChangeFee(rateName)} isActive={isActive}>
        <Text size="large" align="center">
          {title}
        </Text>
        <Text size="regular" className="vbyte">{`${props.allRate[rateName]} sats/vByte`}</Text>
        {!!amount && <Text size="large" className="price">{`~${amount} ${symbol}`}</Text>}
      </ItemWrapper>
    );
  };

  const renderCustomRate = () => {
    const { amount, symbol } = calcAmount(props.customRate);
    return (
      <ItemWrapper
        lg="3"
        md="12"
        onClick={() => {
          if (props.onChangeCustomFee && !!customRef && !!customRef.current) {
            props.onChangeCustomFee(`${Number(props.allRate[FeeRateName.fastestFee] + 5)}`);
            customRef.current.focus();
          }
        }}
        isActive={props.isCustom && props.currentRateType === undefined}
      >
        <Text size="large" align="center">
          Customize Sats
        </Text>
        {!!amount && amount !== '-' && <Text size="regular" className="vbyte">{`~${amount} ${symbol}`}</Text>}
        {/*{!!amount && <Text size="regular" className="vbyte">{`${props.customRate} sats/vByte`}</Text>}*/}
        <input
          ref={customRef}
          id="feeRate"
          type="number"
          name="feeRate"
          placeholder="0"
          value={props.customRate.toString()}
          onChange={onEditCustomFee}
          className="custom-input"
        />
      </ItemWrapper>
    );
  };

  if (props.isLoading) {
    return <></>;
  }

  return (
    <Container>
      <Text size="h5">Select the network fee you want to pay</Text>
      <Content>
        {renderItem(FeeRateName.hourFee)}
        {renderItem(FeeRateName.halfHourFee)}
        {renderItem(FeeRateName.fastestFee)}
        {renderCustomRate()}
      </Content>
    </Container>
  );
});

export default FeeRate;
