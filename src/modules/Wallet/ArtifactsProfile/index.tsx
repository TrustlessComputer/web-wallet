import { getCollectionNfts } from '@/services/nft-explorer';
import { shortenAddress } from '@/utils';
import { useWeb3React } from '@web3-react/core';
import { debounce } from 'lodash';
import { useEffect, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Container, Grid } from './ArtifactsProfile.styled';
import { ARTIFACT_CONTRACT } from '@/configs';
import Empty from '@/components/Empty';
import { IInscription } from '@/interfaces/api/inscription';
import NFTCard from '@/components/NFTCard';
import { EMPTY_LINK } from '../constant';

const LIMIT_PAGE = 32;

const ArtifactsProfile = () => {
  const { account } = useWeb3React();

  const profileWallet = account;
  const [pageSize] = useState(LIMIT_PAGE);
  const [isFetching, setIsFetching] = useState(false);
  const [inscriptions, setInscriptions] = useState<IInscription[]>([]);

  const fetchInscriptions = async (page = 1, isFetchMore = false) => {
    try {
      setIsFetching(true);
      const data = await getCollectionNfts({
        contractAddress: ARTIFACT_CONTRACT,
        limit: pageSize,
        page: page,
        owner: profileWallet,
      });
      if (isFetchMore) {
        setInscriptions(prev => [...prev, ...data]);
      } else {
        setInscriptions(data);
      }
    } catch (error) {
    } finally {
      setIsFetching(false);
    }
  };

  const onLoadMoreNfts = () => {
    if (isFetching || inscriptions.length % LIMIT_PAGE !== 0) return;
    const page = Math.floor(inscriptions.length / LIMIT_PAGE) + 1;
    fetchInscriptions(page, true);
  };

  const debounceLoadMore = debounce(onLoadMoreNfts, 300);

  // const formatItemName = (name: string, type: string) => {
  //   const fileTypeList = type.split('/');
  //   const fileType = fileTypeList[fileTypeList.length - 1];
  //   return name ? `${name}.${fileType}` : type;
  // };

  useEffect(() => {
    if (profileWallet) fetchInscriptions();
  }, [profileWallet]);

  if (!inscriptions || inscriptions.length === 0)
    return <Empty infoText={EMPTY_LINK.ARTIFACTS.label} link={EMPTY_LINK.ARTIFACTS.link} />;

  return (
    <Container>
      <div className="content">
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
                    href={`/inscription?contract=${ARTIFACT_CONTRACT}&id=${item.tokenId}`}
                    image={item.image}
                    contract={ARTIFACT_CONTRACT}
                    tokenId={item.tokenId}
                    contentType={item.contentType}
                    title1={`Inscription #${item.tokenId}`}
                    title2={shortenAddress(item.owner, 4)}
                    title3={item.contentType}
                    owner={item.owner}
                  />
                );
              })}
          </Grid>
        </InfiniteScroll>
      </div>
    </Container>
  );
};

export default ArtifactsProfile;
