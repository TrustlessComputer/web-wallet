import { getCollectionsBns } from '@/services/bns-explorer';
import { shortenAddress } from '@/utils';
import { debounce } from 'lodash';
import { useEffect, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import InfiniteScroll from 'react-infinite-scroll-component';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import { Container } from './NamesList.styled';

const LIMIT_PAGE = 12;

const NameList = () => {
  const pageSize = LIMIT_PAGE;
  const [isFetching, setIsFetching] = useState(false);
  const [collections, setCollections] = useState<any>();

  const fetchNames = async (page = 1, isFetchMore = false) => {
    try {
      setIsFetching(true);
      const data = await getCollectionsBns({ limit: pageSize, page: page });
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
  };

  const onLoadMoreNames = () => {
    if (isFetching || collections?.length % LIMIT_PAGE !== 0) return;
    const page = Math.floor(collections.length / LIMIT_PAGE) + 1;
    fetchNames(page, true);
  };
  const debounceLoadMore = debounce(onLoadMoreNames, 300);

  useEffect(() => {
    fetchNames();
  }, []);

  return (
    <Container>
      <div className="content">
        <InfiniteScroll
          className="list"
          dataLength={collections?.length || 500}
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
                collections.map((item: any, index: number) => {
                  return (
                    <div key={index.toString()} className="card">
                      <div className="card-content">
                        <div className="card-info">
                          <p className="card-title">{item.name}</p>
                          <p className="card-subTitle">{shortenAddress(item.owner, 4)}</p>
                          <p className="card-subTitle">Name #{item.id}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </Masonry>
          </ResponsiveMasonry>
        </InfiniteScroll>
      </div>
    </Container>
  );
};

export default NameList;
