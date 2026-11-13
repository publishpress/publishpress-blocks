---
title: "Query String Control"
order: 49
doc_category: blocks
---

# Query String Control

The “Query String Control” option is part of the [Block Controls](https://publishpress.com/links/block-controls) feature in the [PublishPress Blocks](https://publishpress.com/links/blocks) plugin. This option allows you to show and hide blocks based on based on URL query parameters. This helps you show different blocks to visitors based on the link they clicked to visit your website.

You can enter the query strings into the “Query Parameters” field. These are some examples of URLs with query strings added:

```
https://example.com/?utm_source=google&utm_medium=cpc&utm_campaign=spring_sale&utm_term=red_shoes
https://example.com/?gclid=EAIaIQobChMIq5L...
https://example.com/?fbclid=IwAR1yz...
```

Here are some examples of the strings you can enter into “Query Parameters” field:

- **utm_source** (Google Analytics: traffic source)
- **utm_medium** (Google Analytics: traffic type)
- **gclid** (Google Ads: passes the ad data)
- **fbclid** (Facebook Ads: passes the ad data)
- **msclkid** (Microsoft Ads: passes the ad data)
- **ref** (Often used to pass the traffic source)

Here are the settings for the Query Strin Control feature:

- **Meta Key**: This is name of the query strings to use for this condition. You can enter multiple strings, one per line.
- **Logic**: You can choose either “All parameters must be present” or “Any parameter must be present”.
- **Approach**: You can choose either “Show block when condition matches” or “Hide block when condition matches”.

![Query String Control](https://docs-media.publishpress.com/publishpress-blocks/query-string-control-d4870cf7cc.webp)
