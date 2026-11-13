---
title: "Map Block"
order: 42
doc_category: blocks
---

# Map Block

Table of Contents

- [Configure Google API Key](#h-configure-google-api-key)
- [How to add a PublishPress Map block](#1-toc-title)
- [Settings for the PublishPress Map block](#h-settings-for-the-publishpress-map-block)
- [Default settings for all your PublishPress Map blocks](#h-default-settings-for-all-your-publishpress-map-blocks)

The PublishPress Map blockis available in the [PublishPress Blocks](https://publishpress.com/links/blocks) plugin. This allows you to display a Google Map in the Gutenberg editor. You can create maps with custom icons, tooltips, description, zoom levels and much more.

![](https://docs-media.publishpress.com/publishpress-blocks/map-block-1-c16694bd22.webp)

## Configure Google API Key [#](#h-configure-google-api-key)

To use the PublishPress Map block, you need to add a Google API key in the [PublishPress Blocks](https://publishpress.com/links/blocks) [Settings](https://publishpress.com/knowledge-base/configuration/#h-maps) screen.

![](https://docs-media.publishpress.com/publishpress-blocks/screen-shot-2022-10-05-at-173959-bc2c9fe9a2.webp)

[Click here for Google’s official guide to getting an API key](https://developers.google.com/maps/documentation/javascript/get-api-key). They ask you to do the following:

1. Go to the [Google Cloud Platform Console](https://cloud.google.com/console/google/maps-apis/overview).
2. Click the project drop-down and select or create the project for which you want to add an API key.
3. Click the menu button and select **APIs & Services > Credentials**.
4. On the **Credentials** page, click **Create credentials > API key**. The **API key created** dialog displays your newly created API key. Click **Close.**
5. The new API key is listed on the **Credentials** page under **API keys**.

Once you have added your API key, you can create the map by clicking on the **Map** button in the PublishPress Blocks category:

Important: in the [API Library](https://console.developers.google.com/apis/library) you need to enable 2: Maps JavaScript API and Geocoding API. You can do this adjustment after creating the API key.

## How to add a PublishPress Map block [#](#1-toc-title)

To create a PublishPress**Map** block, click the “Map – PublishPress” button in the PublishPress Blocks category.

![](https://docs-media.publishpress.com/publishpress-blocks/screen-shot-2022-10-05-at-174113-a9148ade07.webp)

## Settings for the PublishPress Map block [#](#h-settings-for-the-publishpress-map-block)

From the right panel, you can add a location in two ways:

1. Input the Latitude and Longitude, or
2. Enter an Address and then press the “Fetch Location” button.

Some additional options for the map are available:

- **Zoom level**
- **Height**
- **Marker Icon**
- **Marker Title**
- **Marker description**
- **Open marker tooltip**
- **Map styles:**silver, retro, night, … and you can add your custom style also.

![](https://docs-media.publishpress.com/publishpress-blocks/screen-shot-2022-10-05-at-174234-bd6b624976.webp)

## Default settings for all your PublishPress Map blocks [#](#h-default-settings-for-all-your-publishpress-map-blocks)

You can set default options for every PublishPress Map block added to your site. This is possible with the [PublishPress Blocks default configuration](https://publishpress.com/knowledge-base/default-blocks-config/) feature and it allows you to create a consistent look-and-feel for all your maps.

- Go to **Blocks** in your WordPress admin menu, then **PublishPress Blocks**.

- Click ****Map**** settings icon.

![](https://docs-media.publishpress.com/publishpress-blocks/screen-shot-2022-10-05-at-174337-98fd63e52e.webp)

- Adjust the default settings and save.

![](https://docs-media.publishpress.com/publishpress-blocks/screen-shot-2022-10-05-at-174353-1b79c9255e.webp)
