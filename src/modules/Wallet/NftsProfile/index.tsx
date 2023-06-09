import Empty from '@/components/Empty';
import NFTCard from '@/components/NFTCard';
import { ARTIFACT_CONTRACT, BNS_CONTRACT } from '@/configs';
import { ICollection } from '@/interfaces/api/collection';
import { getCollectionsByItemsOwned } from '@/services/profile';
import { shortenAddress } from '@/utils';
import { useWeb3React } from '@web3-react/core';
import { debounce } from 'lodash';
import { useEffect, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import InfiniteScroll from 'react-infinite-scroll-component';
import { EMPTY_LINK } from '../constant';
import { Container, Grid } from './NftsProfile.styled';

const LIMIT_PAGE = 32;

const NftsProfile = () => {
  const { account } = useWeb3React();

  const profileWallet = account || '';
  const pageSize = LIMIT_PAGE;

  const [isFetching, setIsFetching] = useState(false);
  const [collections, setCollections] = useState<ICollection[]>([]);

  const fetchCollections = async (page = 1, isFetchMore = false) => {
    try {
      setIsFetching(true);
      const data: Array<ICollection> = (
        await getCollectionsByItemsOwned({
          walletAddress: profileWallet,
          limit: pageSize,
          page: page,
        })
      ).filter(
        (item: any) =>
          ![BNS_CONTRACT.toLowerCase(), ARTIFACT_CONTRACT.toLowerCase()].includes(item.contract.toLowerCase()),
      );
      if (isFetchMore) {
        setCollections(prev => [...prev, ...data]);
      } else {
        setCollections(data);
      }
    } catch (error) {
      // handle error
    } finally {
      setIsFetching(false);
    }
  };

  const onLoadMoreCollections = () => {
    if (isFetching || collections.length % LIMIT_PAGE !== 0) return;
    const page = Math.floor(collections.length / LIMIT_PAGE) + 1;
    fetchCollections(page, true);
  };

  const debounceLoadMore = debounce(onLoadMoreCollections, 300);

  useEffect(() => {
    if (profileWallet) fetchCollections();
  }, [profileWallet]);

  if (!collections || collections.length === 0)
    return (
      <Container>
        <Empty infoText={EMPTY_LINK.NFT.label} link={EMPTY_LINK.NFT.link} />
      </Container>
    );

  return (
    <Container>
      <InfiniteScroll
        className="list"
        dataLength={collections.length}
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
        <Grid>
          {collections.length > 0 &&
            collections.map((item: any, index: number) => {
              return (
                <NFTCard
                  key={index.toString()}
                  href={`/collection?contract=${item.contract}&owner=${profileWallet}`}
                  image={item.thumbnail}
                  title1={item.name || shortenAddress(item.contract, 6)}
                  title2={shortenAddress(item.creator, 4)}
                  title3={`Collection #${item.index}`}
                />
              );
            })}
        </Grid>
      </InfiniteScroll>
    </Container>
  );
};

export default NftsProfile;
