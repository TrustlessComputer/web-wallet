import NFTCard from '@/components/NFTCard';
import { ICollection } from '@/interfaces/api/collection';
import { IInscription } from '@/interfaces/api/inscription';
import { getCollectionDetail, getCollectionNfts } from '@/services/nft-explorer';
import { shortenAddress } from '@/utils';
import Spinner from 'react-bootstrap/Spinner';
import { debounce } from 'lodash';
import queryString from 'query-string';
import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useNavigate } from 'react-router-dom';
import { Container, Grid } from './Collection.styled';
import CollectionHeader from './CollectionHeader';
import ModalEdit from './ModalEdit';
import { CDN_URL } from '@/configs';

const LIMIT = 32;

const Collection = () => {
  const navigate = useNavigate();

  const { contract, owner } = queryString.parse(location.search) as { contract: string; owner?: string };
  console.log('🚀 ~ Collection ~ owner:', owner);

  const [collection, setCollection] = useState<ICollection | undefined>();

  const [isFetching, setIsFetching] = useState(false);
  const [inscriptions, setInscriptions] = useState<IInscription[]>([]);

  const [showModalEdit, setShowModalEdit] = useState(false);

  useEffect(() => {
    setInscriptions([]);
    fetchCollectionDetail();
    fetchInscriptions();
  }, [contract]);

  const fetchCollectionDetail = async () => {
    try {
      const data = await getCollectionDetail({ contractAddress: contract });
      setCollection(data);
    } catch (error) {
      navigate('/404');
    }
  };

  const fetchInscriptions = async (page = 1, isFetchMore = false) => {
    try {
      setIsFetching(true);
      const data = await getCollectionNfts({ contractAddress: contract, page, limit: LIMIT, owner: owner || '' });
      if (isFetchMore) {
        setInscriptions(prev => [...prev, ...data]);
      } else {
        setInscriptions(data);
      }
    } catch (error) {
      // handle error
    } finally {
      setIsFetching(false);
    }
  };

  const onLoadMoreCollections = () => {
    if (isFetching || inscriptions.length % LIMIT !== 0) return;
    const page = Math.floor(inscriptions.length / LIMIT) + 1;
    fetchInscriptions(page, true);
  };

  const debounceLoadMore = debounce(onLoadMoreCollections, 300);

  return (
    <Container>
      <div className="content">
        <CollectionHeader collection={collection} onClickEdit={() => setShowModalEdit(true)} />
        <div>
          <InfiniteScroll
            className="list"
            dataLength={inscriptions?.length || 0}
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
              {inscriptions &&
                inscriptions.length > 0 &&
                inscriptions.map((item, index) => {
                  return (
                    <NFTCard
                      key={index.toString()}
                      href={`/inscription?contract=${collection?.contract}&id=${item.tokenId}`}
                      image={item?.imageCapture || item?.image}
                      contract={collection?.contract}
                      tokenId={item.tokenId}
                      contentType={item.contentType}
                      title1={
                        item.name || (collection && collection.contract ? shortenAddress(collection.contract, 4) : '')
                      }
                      title2={shortenAddress(item.owner, 4)}
                      owner={item.owner}
                      placeholderImg={`${CDN_URL}/images/nft_placehoder.gif`}
                    />
                  );
                })}
            </Grid>
          </InfiniteScroll>
        </div>
      </div>
      {collection && showModalEdit && (
        <ModalEdit
          collection={collection}
          show={showModalEdit}
          handleClose={() => setShowModalEdit(false)}
          onUpdateSuccess={() => fetchCollectionDetail()}
        />
      )}
    </Container>
  );
};

export default React.memo(Collection);
