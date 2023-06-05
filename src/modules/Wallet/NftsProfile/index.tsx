import Empty from '@/components/Empty';
import { ICollection } from '@/interfaces/api/collection';
import { getCollectionsByItemsOwned } from '@/services/profile';
import { shortenAddress } from '@/utils';
import { useWeb3React } from '@web3-react/core';
import { debounce } from 'lodash';
import { useEffect, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import InfiniteScroll from 'react-infinite-scroll-component';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import { Container } from './NftsProfile.styled';
import NFTCard from '@/components/NFTCard';

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
      const data: Array<any> = (
        await getCollectionsByItemsOwned({
          walletAddress: '0x68507e15edeE79646E331E67e3d65BF6edA46Be6',
          limit: pageSize,
          page: page,
        })
      ).filter(
        (item: any) =>
          !['0x8b46f89bba2b1c1f9ee196f43939476e79579798', '0x16efdc6d3f977e39dac0eb0e123feffed4320bc0'].includes(
            item.contract.toLowerCase(),
          ),
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
        <Empty />
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
        <ResponsiveMasonry
          columnsCountBreakPoints={{
            350: 1,
            750: 2,
            900: 3,
            1240: 4,
            2500: 5,
            3000: 5,
          }}
        >
          <Masonry gutter="24px">
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
          </Masonry>
        </ResponsiveMasonry>
      </InfiniteScroll>
    </Container>
  );
};

export default NftsProfile;
