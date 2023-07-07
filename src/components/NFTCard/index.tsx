import NFTDisplayBox from '../NFTDisplayBox';
import { IMAGE_TYPE } from '../NFTDisplayBox/constant';
import { Styled } from './NFTCard.styled';
import React, { useMemo, useState } from 'react';
import TransferModal from './TransferModal';
import { useCurrentUser } from '@/state/user/hooks';
import Button2 from '../Button2';
import { SOULS_CONTRACT } from '@/configs';

export interface INFTCard {
  href: string;
  image?: string;
  thumbnail?: string;
  contract?: string;
  tokenId?: string;
  contentType?: IMAGE_TYPE;
  title1?: string;
  title2?: string;
  title3?: string;
  owner?: string;
  placeholderImg?: string;
}

const NFTCard = ({
  href,
  image,
  thumbnail,
  contract,
  tokenId,
  contentType,
  title1,
  title2,
  title3,
  owner,
  placeholderImg,
}: INFTCard) => {
  const user = useCurrentUser();
  const [showTransferModal, setShowTransferModal] = useState(false);

  const handleOpenTransferModal = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();

    setShowTransferModal(true);
  };

  const handleCloseTransferModal = () => {
    setShowTransferModal(false);
  };

  const isOwner = useMemo(() => {
    if (contract && contract.toLowerCase() === SOULS_CONTRACT.toLowerCase()) {
      return false;
    }
    return user?.walletAddress && user?.walletAddress?.toLowerCase() === owner?.toLowerCase();
  }, [owner, user, contract]);

  return (
    <>
      <Styled to={href}>
        <div className="card-content">
          <div className="card-image">
            <NFTDisplayBox
              collectionID={contract}
              contentClass="image"
              thumbnail={thumbnail || image}
              src={image}
              tokenID={tokenId}
              type={contentType}
              placeholderImg={placeholderImg}
            />
            <a className="overlay" href={href} />
          </div>
          <div className="card-info">
            {title1 && <p className="card-title1">{title1}</p>}
            {title2 && <p className="card-title2">{title2}</p>}
            {title3 && <p className="card-title3">{title3}</p>}
          </div>
          {isOwner && (
            <div className="owner-actions">
              <Button2 onClick={handleOpenTransferModal} className="transfer-button">
                Transfer
              </Button2>
            </div>
          )}
        </div>
      </Styled>
      <TransferModal
        show={showTransferModal}
        handleClose={handleCloseTransferModal}
        contractAddress={contract}
        tokenId={tokenId}
      />
    </>
  );
};

export default NFTCard;
