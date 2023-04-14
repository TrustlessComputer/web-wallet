import { getBnsByWallet } from '@/services/bns-explorer';
import { useWeb3React } from '@web3-react/core';
import { debounce } from 'lodash';
import { useEffect, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import InfiniteScroll from 'react-infinite-scroll-component';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';

import { Container } from './NameProfile.styled';
import Empty from '@/components/Empty';
import { IBNS } from '@/interfaces/bns';
import BNSCard from '@/components/BNS/Card';

const LIMIT_PAGE = 12;

const NamesProfile = () => {
  const { account } = useWeb3React();

  const profileWallet = account;
  const pageSize = LIMIT_PAGE;
  const [isFetching, setIsFetching] = useState(false);
  const [collections, setCollections] = useState<IBNS[]>([]);

  const fetchNames = async (page = 1, isFetchMore = false) => {
    if (account && profileWallet) {
      try {
        setIsFetching(true);
        const data = await getBnsByWallet({ limit: pageSize, page: page, walletAddress: profileWallet });
        if (isFetchMore) {
          setCollections((prev: any) => [...prev, ...data]);
        } else {
          setCollections(data);
        }
      } catch (error) {
        // handle error
      } finally {
        setIsFetching(false);
      }
    }
  };

  const onLoadMoreNames = () => {
    if (isFetching || collections?.length % LIMIT_PAGE !== 0) return;
    const page = Math.floor(collections?.length / LIMIT_PAGE) + 1;
    fetchNames(page, true);
  };
  const debounceLoadMore = debounce(onLoadMoreNames, 300);

  useEffect(() => {
    if (account) {
      fetchNames();
    }
  }, [account]);

  if (!collections || collections.length === 0) return <Empty />;

  return (
    <Container>
      <div className="content">
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
            <Masonry gutter="16px">
              {collections &&
                collections.length > 0 &&
                collections.map((item: any) => {
                  return <BNSCard key={`name-${item.id}`} item={item} />;
                })}
            </Masonry>
          </ResponsiveMasonry>
        </InfiniteScroll>
      </div>
    </Container>
  );
};

export default NamesProfile;
