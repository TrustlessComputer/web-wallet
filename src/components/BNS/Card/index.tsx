import { CDN_URL } from '@/configs';
import { useCurrentUser } from '@/state/user/hooks';
import { shortenAddress } from '@/utils';
import { useMemo, useState } from 'react';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';
import BNSTransferModal from '../TransferModal';
import { StyledBNSCard } from './BNSCard.styled';

type Props = {
  item: {
    name: string;
    owner: string;
    id: number;
  };
};

const BNSCard = ({ item }: Props) => {
  const user = useCurrentUser();
  const [showModal, setShowModal] = useState(false);

  const isAllowTransfer = useMemo(() => item.owner === user?.walletAddress, [item.owner, user?.walletAddress]);

  return (
    <>
      <StyledBNSCard className="card">
        <div className="card-content">
          <div className="card-info">
            <div className="title-container">
              <p className="card-title">{item.name}</p>
              {isAllowTransfer && (
                <div className="card-transfer-btn" onClick={() => setShowModal(true)}>
                  <img src={`${CDN_URL}/icons/ic-exchange-horizontal.svg`} />
                  <p>Transfer</p>
                </div>
              )}
            </div>
            <div className="sub-container">
              <div className="sub-owner">
                <Jazzicon diameter={28} seed={jsNumberForAddress(item.owner)} />
                <p className="sub-address">{shortenAddress(item.owner, 4)}</p>
              </div>
              <p className="card-name">Name #{item.id}</p>
            </div>
          </div>
        </div>
      </StyledBNSCard>
      <BNSTransferModal name={item.name} show={showModal} handleClose={() => setShowModal(false)} />
    </>
  );
};

export default BNSCard;
