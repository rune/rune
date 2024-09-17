import React from 'react';
import {useBaseUrlUtils} from '@docusaurus/useBaseUrl';
import {useDoc} from '@docusaurus/theme-common/internal';
import Head from '@docusaurus/Head';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

/**
 * Helper component to manipulate page metadata and override site defaults.
 * Works in the same way as Helmet.
 */
export function CustomPageMetadata({
  title,
  description,
  keywords,
  image,
  children,
}) {
  // get the original formatted title 
  const {siteConfig} = useDocusaurusContext();
  const {title: siteTitle, titleDelimiter} = siteConfig;
  const formattedTitle = title?.trim().length
    ? `${title.trim()} ${titleDelimiter} ${siteTitle}`
    : siteTitle;

  const {withBaseUrl} = useBaseUrlUtils();
  const pageImage = image ? withBaseUrl(image, {absolute: true}) : undefined;

  return (
    <Head>
      {title && <title>{formattedTitle}</title>}
      {title && <meta property="og:title" content={title.split("|")[0] + " | Rune"} />}

      {description && <meta name="description" content={description} />}
      {description && <meta property="og:description" content={description} />}

      {keywords && (
        <meta
          name="keywords"
          content={
            // https://github.com/microsoft/TypeScript/issues/17002
            (Array.isArray(keywords) ? keywords.join(',') : keywords)
          }
        />
      )}

      {pageImage && <meta property="og:image" content={pageImage} />}
      {pageImage && <meta name="twitter:image" content={pageImage} />}

      {children}
    </Head>
  );
}

export default function DocItemMetadata() {
  const {metadata, frontMatter, assets} = useDoc();
  return (
    <CustomPageMetadata
      title={metadata.title}
      description={metadata.description}
      keywords={frontMatter.keywords}
      image={assets.image ?? frontMatter.image}
    />
  );
}
