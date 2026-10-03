import { Fragment } from 'react';

const HAN_RUN = /([㐀-鿿豈-﫿]+)/;

// Renders runs of Chinese characters in the calligraphy face (and tagged as
// Cantonese) while Latin text keeps the surrounding font.
export default function MixedText({ text, zhClassName = '' }: { text: string; zhClassName?: string }) {
  return (
    <>
      {text.split(HAN_RUN).map((part, i) =>
        HAN_RUN.test(part) ? (
          <span key={i} lang="zh-HK" className={`font-zh ${zhClassName}`}>
            {part}
          </span>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </>
  );
}
