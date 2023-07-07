import { CDN_URL } from '@/configs';
import { getURLContent, getImageURLContent } from '@/lib';
import React, { useEffect, useRef, useState } from 'react';
import cs from 'classnames';
import s from './styles.module.scss';
import { IMAGE_TYPE } from './constant';
// import Skeleton from '../Skeleton';
interface IProps {
  className?: string;
  contentClass?: string;
  thumbnail?: string;
  src?: string;
  collectionID?: string;
  tokenID?: string;
  type?: IMAGE_TYPE;
  autoPlay?: boolean;
  loop?: boolean;
  controls?: boolean;
  placeholderImg?: string;
}

const NFTDisplayBox = ({
  className,
  contentClass,
  thumbnail,
  src,
  type,
  collectionID,
  tokenID,
  autoPlay = false,
  loop = false,
  controls = false,
  placeholderImg,
}: IProps) => {
  const [isError, setIsError] = React.useState(false);
  // const [isLoaded, serIsLoaded] = React.useState(false);

  const [isErrorLinkHttp, setIsErrorLinkHttp] = React.useState(false);

  const onError = () => {
    setIsError(true);
    // serIsLoaded(true);
  };

  const onLoaded = () => {
    // serIsLoaded(true);
  };

  const onErrorLinkHttp = () => {
    setIsErrorLinkHttp(true);
    // serIsLoaded(true);
  };

  const [HTMLContentRender, setHTMLContentRender] = useState<React.ReactNode>();
  const imgRef = useRef<HTMLImageElement>(null);

  const defaultImage = placeholderImg || CDN_URL + '/images/default_thumbnail.png';

  const contentClassName = cs(s.wrapper_content, contentClass);

  // const renderLoading = () => <Skeleton className={s.absolute} fill isLoaded={isLoaded} />;

  const renderIframe = (content: string) => {
    return (
      <iframe
        className={contentClassName}
        loading="lazy"
        // sandbox="allow-scripts allow-pointer-lock allow-downloads"
        scrolling="no"
        src={content}
        onError={onError}
        onLoad={onLoaded}
      />
    );
  };

  const renderAudio = (content: string) => {
    return (
      <audio
        autoPlay={autoPlay}
        className={contentClassName}
        controls={controls}
        loop={loop}
        src={content}
        onError={onError}
        onLoad={onLoaded}
      />
    );
  };

  const renderVideo = (content: string) => {
    return (
      <video
        autoPlay={autoPlay}
        className={contentClassName}
        controls={controls}
        loop={loop}
        src={content}
        onError={onError}
        onLoad={onLoaded}
      />
    );
  };

  const handleOnImgLoaded = (evt: React.SyntheticEvent<HTMLImageElement>): void => {
    const img = evt.target as HTMLImageElement;
    const naturalWidth = img.naturalWidth;
    if (naturalWidth < 100 && imgRef.current) {
      imgRef.current.style.imageRendering = 'pixelated';
    }
    // serIsLoaded(true);
  };

  const renderImage = (content: string) => {
    return (
      <img
        ref={imgRef}
        alt={tokenID}
        className={contentClassName}
        loading="lazy"
        src={content}
        style={{ objectFit: 'contain' }}
        onLoad={handleOnImgLoaded}
        onError={onError}
      />
    );
  };

  const renderImageLinkHttp = (content: string) => {
    return (
      <img
        ref={imgRef}
        alt={tokenID}
        className={contentClassName}
        loading="lazy"
        src={content}
        style={{ objectFit: 'contain' }}
        onLoad={handleOnImgLoaded}
        onError={onErrorLinkHttp}
      />
    );
  };

  const renderEmpty = () => <img alt="empty" className={contentClassName} loading={'lazy'} src={defaultImage} />;

  const isImage = (url: string) => {
    return /\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(url);
  };

  useEffect(() => {
    if (isError) {
      setHTMLContentRender(renderEmpty());
      return;
    }
    if (thumbnail) {
      setHTMLContentRender(renderImage(thumbnail));
    } else if (src && src.startsWith('https://') && isImage(src)) {
      setHTMLContentRender(renderImage(src));
    } else if (src && src.startsWith('/dapp') && !type) {
      const content = getImageURLContent(src);
      setHTMLContentRender(renderIframe(content));
    } else if (collectionID) {
      const content = collectionID && tokenID ? getURLContent(collectionID, tokenID) : defaultImage;

      if (isErrorLinkHttp) {
        setHTMLContentRender(renderIframe(content));
        return;
      }

      switch (type) {
        case 'audio/mpeg':
        case 'audio/wav':
          setHTMLContentRender(renderAudio(content));
          return;
        case 'video/mp4':
        case 'video/webm':
          setHTMLContentRender(renderVideo(content));
          return;
        case 'image/apng':
        case 'image/avif':
        case 'image/gif':
        case 'image/jpeg':
        case 'image/png':
        case 'image/svg':
        case 'image/svg+xml':
        case 'image/webp':
          setHTMLContentRender(renderImage(content));
          return;
        case 'link/https':
          setHTMLContentRender(renderImageLinkHttp(content));
          return;
        case 'application/json':
        case 'application/pgp-signature':
        case 'application/yaml':
        case 'audio/flac':
        case 'application/pdf':
        case 'text/plain;charset=utf-8':
          setHTMLContentRender(renderIframe(content));
          return;
        default:
          setHTMLContentRender(renderIframe(content));
          return;
      }
    } else {
      setHTMLContentRender(renderEmpty());
    }
  }, [collectionID, tokenID, src, isErrorLinkHttp, isError]);

  return (
    <div className={cs(s.wrapper, className)}>
      {HTMLContentRender && HTMLContentRender}
      {/* {!isLoaded && !isError && renderLoading()} */}
    </div>
  );
};

export default React.memo(NFTDisplayBox);
