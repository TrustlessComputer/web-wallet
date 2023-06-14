import IconSVG from '@/components/IconSVG';
import Text from '@/components/Text';
import { CDN_URL } from '@/configs';
import { DappsTabs } from '@/enums/tabs';
// import useBatchCompleteUninscribedTransaction from '@/hooks/contract-operations/useBatchCompleteUninscribedTransaction';
import useBitcoin from '@/hooks/useBitcoin';
import Transactions from '@/modules/Wallet/TransactionsProfile/Transactions';
import { useCurrentUser } from '@/state/user/hooks';
import queryString from 'query-string';
import { useEffect, useState } from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
// import { toast } from 'react-hot-toast';
import ArtifactsProfile from './ArtifactsProfile';
import NamesProfile from './NamesProfile';
import NftsProfile from './NftsProfile';
import { StyledProfile, TabContainer } from './Profile.styled';
import TokensProfile from './TokensProfile';

const Wallet = () => {
  const { tab } = queryString.parse(location.search) as { tab: string };
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState(tab || DappsTabs.TRANSACTION);
  // const [processing, setProcessing] = useState(false);

  const user = useCurrentUser();
  const { getUnInscribedTransactionDetailByAddress } = useBitcoin();
  // const { run, transactionConfirmed } = useBatchCompleteUninscribedTransaction({});
  // const [transactions, setTransactions] = useState<string[]>([]);

  const fetchTransactions = async () => {
    if (user && user.walletAddress) {
      try {
        const res = await getUnInscribedTransactionDetailByAddress(user.walletAddress);
        if (res && res.length > 0) {
          // setTransactions(res.map(tx => tx.Hash));
          setActiveTab(DappsTabs.TRANSACTION);
        }
      } catch (err: unknown) {
        console.log('Fail to get transactions');
      }
    }
  };

  // const handleResumeTransactions = async () => {
  //   try {
  //     setProcessing(true);
  //     await run();
  //   } catch (err: any) {
  //     toast.error(err.message);
  //   } finally {
  //     setProcessing(false);
  //   }
  // };

  useEffect(() => {
    if (user) fetchTransactions();
  }, [user]);

  useEffect(() => {
    if (tab) {
      setActiveTab(tab);
    }
  }, [tab]);

  const renderTitleTab = (tab: DappsTabs, src: string, text: string) => {
    const isActive = tab === activeTab;
    return (
      <div className="tab-item">
        <IconSVG
          maxWidth="20"
          maxHeight="20"
          src={src}
          color={isActive ? 'text-tab-item' : 'text-primary'}
          type="stroke"
        />
        <Text className="tab-text" color={isActive ? 'text-tab-item' : 'text-primary'}>
          {text}
        </Text>
      </div>
    );
  };

  return (
    <StyledProfile className="row">
      {/* <UserInfo className="col-xl-2" /> */}
      <TabContainer className="wrapper col-xl-12">
        <Tabs
          defaultActiveKey={activeTab}
          id="uncontrolled-tab"
          onSelect={key => {
            setActiveTab(key || DappsTabs.NFT);
            navigate(`/?tab=${key || DappsTabs.NFT}`);
          }}
          activeKey={activeTab}
        >
          <Tab
            mountOnEnter
            eventKey={DappsTabs.NFT}
            title={renderTitleTab(DappsTabs.NFT, `${CDN_URL}/icons/ic-hexagon.svg`, 'NFTs')}
          >
            {/* <CollectionProfile /> */}
            <NftsProfile />
          </Tab>
          <Tab
            mountOnEnter
            eventKey={DappsTabs.TOKEN}
            title={renderTitleTab(DappsTabs.TOKEN, `${CDN_URL}/icons/ic-coin-unbroken.svg`, 'Tokens')}
          >
            <TokensProfile />
          </Tab>
          <Tab
            mountOnEnter
            eventKey={DappsTabs.ARTIFACT}
            title={renderTitleTab(DappsTabs.ARTIFACT, `${CDN_URL}/icons/ic-folder-open.svg`, 'Smart Inscriptions')}
          >
            <ArtifactsProfile />
          </Tab>
          <Tab
            mountOnEnter
            eventKey={DappsTabs.NAMES}
            title={renderTitleTab(DappsTabs.NAMES, `${CDN_URL}/icons/ic-names.svg`, 'Names')}
          >
            <NamesProfile />
          </Tab>
          <Tab
            mountOnEnter
            eventKey={DappsTabs.TRANSACTION}
            title={renderTitleTab(DappsTabs.TRANSACTION, `${CDN_URL}/icons/ic-arrow-switch.svg`, 'Transactions')}
          >
            <Transactions />
          </Tab>
        </Tabs>
      </TabContainer>
    </StyledProfile>
  );
};

export default Wallet;
