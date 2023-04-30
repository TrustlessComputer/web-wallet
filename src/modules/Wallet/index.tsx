import IcSwitch from '@/assets/icons/ic-arrow-switch.svg';
import IcCoinTokens from '@/assets/icons/ic-coin-unbroken.svg';
import IcFolderOpen from '@/assets/icons/ic-folder-open.svg';
import IcHexagon from '@/assets/icons/ic-hexagon.svg';
import IcNames from '@/assets/icons/ic-names.svg';
import IconSVG from '@/components/IconSVG';

import Text from '@/components/Text';
import { DappsTabs } from '@/enums/tabs';
import { useEffect, useState } from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import useBatchCompleteUninscribedTransaction from '@/hooks/contract-operations/useBatchCompleteUninscribedTransaction';
import useBitcoin from '@/hooks/useBitcoin';
import queryString from 'query-string';
import { toast } from 'react-hot-toast';
import ArtifactsProfile from './ArtifactsProfile';
import NamesProfile from './NamesProfile';
import NftsProfile from './NftsProfile';
import { StyledProfile, TabContainer } from './Profile.styled';
import TokensProfile from './TokensProfile';
import UserInfo from './UserInfo';
import { useCurrentUser } from '@/state/user/hooks';
import Button from '@/components/Button';
import Transactions from '@/modules/Wallet/TransactionsProfile/Transactions';

const Wallet = () => {
  const { tab } = queryString.parse(location.search) as { tab: string };

  const [activeTab, setActiveTab] = useState(tab || DappsTabs.NFT);
  const [processing, setProcessing] = useState(false);

  const user = useCurrentUser();
  const { getUnInscribedTransactionDetailByAddress } = useBitcoin();
  const { run, transactionConfirmed } = useBatchCompleteUninscribedTransaction({});

  const [transactions, setTransactions] = useState<string[]>([]);

  const fetchTransactions = async () => {
    if (user && user.walletAddress) {
      try {
        const res = await getUnInscribedTransactionDetailByAddress(user.walletAddress);
        if (res && res.length > 0) {
          setTransactions(res.map(tx => tx.Hash));
        }
      } catch (err: unknown) {
        console.log('Fail to get transactions');
      }
    }
  };

  const navigateToDapps = () => {
    window.open('https://trustless.computer/', '_blank');
    // navigate(`${ROUTE_PATH.DAPPS}?tab=${activeTab}`);
  };

  const handleResumeTransactions = async () => {
    try {
      setProcessing(true);
      await run();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setProcessing(false);
    }
  };

  useEffect(() => {
    if (user) fetchTransactions();
  }, [user]);

  useEffect(() => {
    if (tab) {
      setActiveTab(tab);
    }
  }, [tab]);

  return (
    <StyledProfile className="row">
      <UserInfo className="col-xl-2" />
      <TabContainer className="wrapper col-xl-9 offset-xl-1">
        <Tabs defaultActiveKey={activeTab} id="uncontrolled-tab" onSelect={key => setActiveTab(key || DappsTabs.NFT)}>
          <Tab
            mountOnEnter
            eventKey={DappsTabs.NFT}
            title={
              <div className="tab-item">
                <IconSVG maxWidth="28" maxHeight="28" src={IcHexagon} color="white" type="stroke" />
                <Text className="tab-text" size="regular">
                  NFTs
                </Text>
              </div>
            }
          >
            {/* <CollectionProfile /> */}
            <NftsProfile />
          </Tab>
          <Tab
            mountOnEnter
            eventKey={DappsTabs.TOKEN}
            title={
              <div className="tab-item">
                <IconSVG maxWidth="28" maxHeight="28" src={IcCoinTokens} color="white" type="stroke" />
                <Text className="tab-text" size="regular">
                  Tokens
                </Text>
              </div>
            }
          >
            <TokensProfile />
          </Tab>
          <Tab
            mountOnEnter
            eventKey={DappsTabs.ARTIFACT}
            title={
              <div className="tab-item">
                <IconSVG maxWidth="28" maxHeight="28" src={IcFolderOpen} color="white" type="stroke" />
                <Text className="tab-text" size="regular">
                  Artifacts
                </Text>
              </div>
            }
          >
            <ArtifactsProfile />
          </Tab>
          <Tab
            mountOnEnter
            eventKey={DappsTabs.NAMES}
            title={
              <div className="tab-item">
                <IconSVG maxWidth="28" maxHeight="28" src={IcNames} color="white" type="stroke" />
                <Text className="tab-text" size="regular">
                  Names
                </Text>
              </div>
            }
          >
            <NamesProfile />
          </Tab>
          <Tab
            mountOnEnter
            eventKey={DappsTabs.TRANSACTION}
            title={
              <div className="tab-item">
                <IconSVG maxWidth="28" maxHeight="28" src={IcSwitch} color="white" type="stroke" />
                <Text className="tab-text" size="regular">
                  Transactions
                </Text>
              </div>
            }
          >
            <Transactions />
            {/*<TransactionsProfile pendingList={transactions} />*/}
          </Tab>

          <Tab
            mountOnEnter
            title={
              activeTab === DappsTabs.TRANSACTION ? (
                <Button
                  className={`explore-btn resume-btn ${
                    transactions.length === 0 || transactionConfirmed ? 'disable' : ''
                  }`}
                  onClick={handleResumeTransactions}
                >
                  <Text size="regular" color="text8">
                    {processing ? 'Processing...' : `Need to resume`}
                  </Text>
                </Button>
              ) : (
                <Button className="explore-btn" onClick={navigateToDapps}>
                  <Text size="regular" color="text8">
                    Explore Dapp Store
                  </Text>
                </Button>
              )
            }
          >
            <NamesProfile />
          </Tab>
        </Tabs>
      </TabContainer>
    </StyledProfile>
  );
};

export default Wallet;
