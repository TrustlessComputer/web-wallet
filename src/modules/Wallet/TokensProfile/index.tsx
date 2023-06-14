import Empty from '@/components/Empty';
import Table from '@/components/Table';
import { TRUSTLESS_COMPUTER_CHAIN_INFO } from '@/constants/chains';
import { getTokensWallet } from '@/services/profile';
import { decimalToExponential } from '@/utils/format';
import { debounce } from 'lodash';
import { useEffect, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import InfiniteScroll from 'react-infinite-scroll-component';
import { StyledTokenProfile } from './TokenProfile.styled';
import TransferModal from './TransferModal';
import useContractOperation from '@/hooks/contract-operations/useContractOperation';
import useGetTokenBalance, { IGetTokenBalance } from '@/hooks/contract-operations/token/useGetTokenBalance';
import { IToken } from '@/interfaces/token';
import { useCurrentUser } from '@/state/user/hooks';
import format from '@/utils/amount';
import convert from '@/utils/convert';
import BigNumber from 'bignumber.js';
import { EMPTY_LINK } from '../constant';
import Button2 from '@/components/Button2';

const EXPLORER_URL = TRUSTLESS_COMPUTER_CHAIN_INFO.explorers[0].url;

const LIMIT_PAGE = 50;

const TABLE_HEADINGS = ['Token Number', 'Name', 'Symbol', 'Balance', 'Max Supply', ''];

const TokensProfile = () => {
  const user = useCurrentUser();

  const { run: getTokenBalance } = useContractOperation<IGetTokenBalance, string>({
    operation: useGetTokenBalance,
    inscribeable: false,
  });

  const profileWallet = user?.walletAddress || '';
  const [isFetching, setIsFetching] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [selectedToken, setSelectedToken] = useState<IToken | null>(null);
  const [tokensList, setTokensList] = useState<IToken[]>([]);

  const fetchTokenBalances = async (tokenAddrs: string[]) => {
    try {
      setIsFetching(true);
      const balances = await Promise.all(tokenAddrs.map(addr => getTokenBalance({ erc20TokenAddress: addr })));
      const newTokenList = tokensList.map((token, index: number) => {
        return {
          ...token,
          balance: (parseInt(balances[index]) / decimalToExponential(token.decimal)).toLocaleString(),
        };
      });
      setTokensList(newTokenList);
    } catch (err: unknown) {
      console.log('Failed to fetch token balances: ', err);
    } finally {
      setIsFetching(false);
    }
  };

  const hanldeOpenTransferModal = (selectedToken: any) => {
    setShowTransferModal(true);
    setSelectedToken(selectedToken);
  };

  const hanldeCloseTransferModal = () => {
    setShowTransferModal(false);
    setSelectedToken(null);
  };

  const fetchTokensOwned = async (page = 1, isFetchMore = false) => {
    try {
      setIsFetching(true);
      const res = await getTokensWallet({ walletAddress: profileWallet, limit: 12, page: page });
      if (isFetchMore) {
        setTokensList((prev: any) => [...prev, ...res]);
      } else {
        setTokensList(res);
      }
    } catch (err: unknown) {
      console.log('Failed to fetch tokens owned');
    } finally {
      setIsFetching(false);
    }
  };

  const tokenDatas = tokensList.map(token => {
    const balance = format.formatAmount({
      originalAmount: new BigNumber(token.balance || 0).toNumber(),
      decimals: token.decimal,
      clipAmount: false,
      maxDigits: 9,
    });

    const totalSupply = format.formatAmount({
      originalAmount: new BigNumber(token.totalSupply || 0).toNumber(),
      decimals: token.decimal,
      clipAmount: false,
      maxDigits: 9,
    });

    const linkTokenExplorer = `${EXPLORER_URL}/token/${token?.address}`;

    const balanceNumb = convert.toNumber({ text: balance || '0', autoCorrect: true });

    return {
      id: `token-${token?.address}}`,
      render: {
        number: token?.index,
        name: (
          <a href={linkTokenExplorer} rel="rel=”noopener noreferrer”" target="_blank">
            {token?.name || '-'}
          </a>
        ),

        symbol: token?.symbol || '-',
        balance: balance,
        supply: Number(totalSupply) > 0 ? totalSupply : '-',
        action: (
          <>
            {balanceNumb > 0 && (
              <div className="owner-actions">
                <Button2
                  className="transfer-button"
                  onClick={() => hanldeOpenTransferModal(token)}
                  sizes="small"
                  variants="outline"
                >
                  Transfer
                </Button2>
              </div>
            )}
          </>
        ),
      },
    };
  });

  const onLoadMoreTokens = () => {
    if (isFetching || tokensList.length % LIMIT_PAGE !== 0) return;
    const page = Math.floor(tokensList.length / LIMIT_PAGE) + 1;
    fetchTokensOwned(page, true);
  };

  const debounceLoadMore = debounce(onLoadMoreTokens, 300);

  useEffect(() => {
    if (user && user.walletAddress) fetchTokensOwned();
  }, [user]);

  useEffect(() => {
    setTimeout(() => {
      if (tokensList && tokensList.length > 0) fetchTokenBalances(tokensList.map((token: any) => token.address));
    }, 2000);
  }, []);

  if (!tokensList || tokensList.length === 0 || !profileWallet) {
    return <Empty infoText={EMPTY_LINK.TOKENS.label} link={EMPTY_LINK.TOKENS.link} />;
  }

  return (
    <StyledTokenProfile>
      {isFetching ? (
        <div className="loading">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <InfiniteScroll
          className="transactions"
          dataLength={tokensList?.length || 0}
          hasMore={true}
          loader={
            isFetching && (
              <div className="loading">
                <Spinner animation="border" variant="primary" />
              </div>
            )
          }
          next={debounceLoadMore}
        >
          <Table
            tableHead={TABLE_HEADINGS}
            data={tokenDatas}
            className={'token-table'}
            emptyLabel={EMPTY_LINK.TOKENS.label}
            emptyLink={EMPTY_LINK.TOKENS.link}
          />
        </InfiniteScroll>
      )}
      <TransferModal
        show={showTransferModal}
        handleClose={hanldeCloseTransferModal}
        erc20TokenAddress={selectedToken?.address}
      />
    </StyledTokenProfile>
  );
};

export default TokensProfile;
