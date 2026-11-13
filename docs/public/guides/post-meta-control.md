---
title: "Post Meta Control"
order: 46
doc_category: blocks
---

# Post Meta Control

The “Post Meta Control” option is part of the [Block Controls](https://publishpress.com/links/block-controls) feature in the [PublishPress Blocks](https://publishpress.com/links/blocks) plugin. This option allows you to show and hide blocks based on postmeta data stored for individual posts. This option works best for blocks that may show across multiple posts such as [Reusable Blocks](https://publishpress.com/knowledge-base/reusable-blocks/) or blocks inside the Full-Site Editor.

The data used for this setting is stored in the _postmeta field in the database. you can see several example of rows in the _postmeta table.

![Post Meta database table](https://docs-media.publishpress.com/publishpress-blocks/post-meta-table-f10b32dc41.webp)

Here are the settings for the Post Meta Control feature:

- **Meta Key**: This is name of the meta_key field to use for this condition.
- **Condition**: This is based on the “Value” field. For example, if you choose = then the value of the data in the post’s meta_value field must exactly match the content of the “Value” field.
- **Value**: This is the value of the data in the meta_value field for this post.
- **Approach**: You can choose either “Show block when condition matches” or “Hide block when condition matches”.

In the screenshot below, this block will only show if the _wp_page_template field for the post has a meta_value of “default”.

![Post Meta values](https://docs-media.publishpress.com/publishpress-blocks/post-meta-control-e32091403e.webp)
