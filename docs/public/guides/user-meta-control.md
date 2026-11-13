---
title: "User Meta Control"
order: 59
doc_category: blocks
---

# User Meta Control

The “User Meta Control” option is part of the [Block Controls](https://publishpress.com/links/block-controls) feature in the [PublishPress Blocks](https://publishpress.com/links/blocks) plugin. This option allows you to show and hide blocks based on meta data stored for individual users. This option will only work with users logged in to your website.

The data used for this setting is stored in the _usermeta field in the database. you can see several example of rows in the _usermeta table.

![User meta database](https://docs-media.publishpress.com/publishpress-blocks/user-meta-4cf187d980.webp)

Here are the settings for the User Meta Control feature:

- **Meta Key**: This is name of the meta_key field to use for this condition.
- **Condition**: This is based on the “Value” field. For example, if you choose = then the value of the data in the user’s meta_value field must exactly match the content of the “Value” field.
- **Value**: This is the value of the data in the meta_value field for this user.
- **Approach**: You can choose either “Show block when condition matches” or “Hide block when condition matches”.

In the screenshot below, this block will only show if the first_name field for the user has a meta_value of “Steve”.

![User Meta control](https://docs-media.publishpress.com/publishpress-blocks/user-meta-example-00dd830677.webp)
