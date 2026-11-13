---
title: "Table Block"
order: 6
doc_category: blocks
---

# Table Block

Table of Contents

- [How to create the PublishPress Table block](#articletoc_0)
- [Rows, columns and cells in the Table block](#1-toc-title)
- [How to merge cells](#how-to-merge-cells)
- [How to add borders to the Table block](#border-cells)
- [Settings for the PublishPress Table block](#4-toc-title)[Styles](#5-toc-title)[Table Settings](#6-toc-title)[Cell Settings](#7-toc-title)
- [Default settings for all your Table blocks](#8-toc-title)
- [Horizontal scrollbar support for PublishPress Table](#h-horizontal-scrollbar-support-for-publishpress-table)

The PublishPress Table block is available in the [PublishPress Blocks](https://publishpress.com/links/blocks) plugin. This is based on the defaultTableblock in Gutenberg. This improved version of the block has tons of extra table features including advanced styling such as margin, padding, alignment, colors and more.

## How to create the PublishPress Table block [#](#articletoc_0)

You can create a table by clicking the PublishPress Table button in the [PublishPress Blocks](https://publishpress.com/links/blocks) category.

![](https://docs-media.publishpress.com/publishpress-blocks/screen-shot-2022-10-05-at-164340-ac00a2f950.webp)

After choosing the PublishPress Table block, you can choose the number of columns and rows for your layout:

![Screen Shot 2020 12 10 At 11.42.54](https://docs-media.publishpress.com/publishpress-blocks/screen-shot-2020-12-10-at-114254-1e358e6cdc.webp)

## Rows, columns and cells in the Table block [#](#1-toc-title)

You can edit the table after setting the number of columns and rows. The options include:

- Add Row Before
- Add Row After
- Delete Row
- Add Column Before
- Add Column After
- Delete Column
- Split Merged Cells
- Merge Cells

![](https://docs-media.publishpress.com/publishpress-blocks/advanced-table-e37f9bfe3c.webp)

## How to merge cells [#](#how-to-merge-cells)

In Mac you just need to click one cell (NOT select like you would do with text). Then keep pressed shift key and click on the other cell you want to merge with. As last step click on the table icon options > Merge cells.

![Merge Cells](https://docs-media.publishpress.com/publishpress-blocks/merge-cells-b2a380d6ce.gif)

## How to add borders to the Table block [#](#border-cells)

You can either add border to one cell, or to a group of cells.

In order to add border to all the table, select all the cells (in Mac, press the shift key while selecting cells).

![Ezgif 4 0b5e10233ffb](https://docs-media.publishpress.com/publishpress-blocks/ezgif-4-0b5e10233ffb-d413d08214.gif)

​In Sidebar, go to Cell settings > Border and choose the full border​ icon. Then set the border width.

![](https://docs-media.publishpress.com/publishpress-blocks/screen-shot-2021-10-04-at-102242-dfcede52a8.webp)

In Table settings enable Border collapsed, if desired.

![](https://docs-media.publishpress.com/publishpress-blocks/screen-shot-2021-10-04-at-102058-c0761cc5af.webp)

## Settings for the PublishPress Table block [#](#4-toc-title)

More table settings can be modified in the right sidebar:

#### Styles [#](#5-toc-title)

- Default
- Stripes

![](https://docs-media.publishpress.com/publishpress-blocks/screen-shot-2022-10-05-at-164445-d50895c439.webp)

#### Table Settings [#](#6-toc-title)

- **Max width:**Set this to 0 to make max-width equivalent to 100%
- **Fixed width table cells**: Enabled or disabled.
- **Table header**: Enabled or disabled.
- **Table footer**: Enabled or disabled.
- **Border collapsed**: Enabled or disabled.

![](https://docs-media.publishpress.com/publishpress-blocks/screen-shot-2022-10-05-at-164533-ad48f5ad25.webp)

#### Cell Settings [#](#7-toc-title)

- **Color Settings:**  Background Color Text Color
- **Border:**  Border Style Border Width Border Color
- **Padding:**  Padding Top Padding Right Padding Bottom Padding Left
- **Text Alignment:**  Horizontal Align Vertical Align

![](https://docs-media.publishpress.com/publishpress-blocks/single-cells-settings-b0445ac496.webp)

## Default settings for all your Table blocks [#](#8-toc-title)

You can set default options for every PublishPress Table block added to your site. This is possible with the [PublishPress Blocks default configuration](https://publishpress.com/knowledge-base/default-blocks-config/) feature and it allows you to create a consistent look-and-feel for all your tables.

- Go to **Blocks** in your WordPress admin menu, then **PublishPress Blocks**.

- Click **Table** settings icon.

![](https://docs-media.publishpress.com/publishpress-blocks/screen-shot-2022-10-05-at-164633-e9178e243c.webp)

- Adjust the default settings and save.

![](https://docs-media.publishpress.com/publishpress-blocks/screen-shot-2022-10-05-at-164652-4e48e0ed5f.webp)

## Horizontal scrollbar support for **PublishPress** Table [#](#h-horizontal-scrollbar-support-for-publishpress-table)

This is very useful for large tables in tablets and mobile.

- Select your PublishPress Table block (not just a cell! The block).
- Click on the 3 points to reveal block settings.
- Click “Group”

![](https://docs-media.publishpress.com/publishpress-blocks/screen-shot-2021-01-11-at-194102-9f48c3ce4b.webp)

- Select the Group block that now wraps the table.
- In the sidebar, go to Advanced > Additional CSS class(es)
- Type: wp-block-table

![](https://docs-media.publishpress.com/publishpress-blocks/screen-shot-2021-01-11-at-194412-b9d75dbde4.webp)

If you preview your table in small devices in frontend, you’ll see an horizontal scrollbar when the content can’t fit the screen.
