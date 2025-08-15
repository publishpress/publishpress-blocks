import AdvQueryControls from './query-controls.jsx';
import { AuthorSelect } from './query-controls.jsx';
import { AdvColorControl } from "../0-adv-components/components.jsx";

(function (wpI18n, wpBlocks, wpElement, wpBlockEditor, wpComponents, wpData, lodash, wpHtmlEntities, wpDate) {
    wpBlockEditor = wp.blockEditor || wp.editor;
    const { __ } = wpI18n;
    const { Component, Fragment, RawHTML } = wpElement;
    const { registerBlockType } = wpBlocks;
    const { InspectorControls, BlockControls } = wpBlockEditor;
    const { PanelBody, RangeControl, ToggleControl, TextControl, TextareaControl, FormTokenField, Spinner, ToolbarGroup, ToolbarButton, Placeholder, Tooltip, SelectControl } = wpComponents;
    const { withSelect } = wpData;
    const { pickBy, isUndefined, isArray, isNull, uniqWith, isEqual, omit, union, sortBy, unset, set, find } = lodash;
    const { decodeEntities } = wpHtmlEntities;
    const { dateI18n } = wpDate;

    const advRecentPostsBlockIcon = (
        <svg width="20" height="20" viewBox="2 2 22 22">
            <path fill="none" d="M0,0h24v24H0V0z" />
            <rect x="13" y="7.5" width="5" height="2" />
            <rect x="13" y="14.5" width="5" height="2" />
            <path d="M19,3H5C3.9,3,3,3.9,3,5v14c0,1.1,0.9,2,2,2h14c1.1,0,2-0.9,2-2V5C21,3.9,20.1,3,19,3z M19,19H5V5h14V19z" />
            <path d="M11,6H6v5h5V6z M10,10H7V7h3V10z" />
            <path d="M11,13H6v5h5V13z M10,17H7v-3h3V17z" />
        </svg>
    );

    const INBUILT_POST_TYPES = ['page', 'post'];
    const PP_SERIES_POST_TYPES = typeof advgbBlocks.pp_series_post_types !== 'undefined' ? advgbBlocks.pp_series_post_types : ['post'];

    const MAX_CATEGORIES_SUGGESTIONS = 20;

    const previewImageData = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPoAAAD+CAYAAAATfRgrAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAD7dJREFUeNrsnc1rHOcdx3dG77FsCRf5EOQSmksb+VAT09YnU2iTS0IPITnkHCilhxBcAjn1D+ghlN58qQ82hZj2VPriQ0tCMaSXglMKMcGIKpdKvUiy1rK1u9P9Kjvuo0fzPjuzO898PjDsWi+71rPzeX6/573TAQAAAAAAAAAAAAAAAAAAAAAAAAAAaBRelS8+OzvrUcQAuQh6vd50iT4UOevrIDxAiuBZvl+0EvBKCO6lvBZyA4xH+qCs9F5Jwb2UR6QHKCd33GOuNN/LIXmc4HHPERygnPCBJXjU80zCz+Zsi8fJbV/IDjAeycOvDUYuBRE/76W18b0MknsRkpuXH/FvRAcoLrr5OLCkH0RUAmGbPSgkutUmj5Jbj/6HH364+sYbb1xbXV39wfB3XjRlD4KAjw8gSzva8zqDweDR4eHh/YcPH/757bff/scXX3zRswQfWM9PpPNxKXya6HEp+kwo+r179751+fLlXw5/9srw3/N8XABjCO1B8Gh/f//XN2/e/NX169d3DMHt61R0j5J9JkM0tyP5zOhx9sGDB9/f2Nj4i+/7X096LQDIHd3nFxYWvvvyyy+/ev78+T/cvXu3awXd2F8dZgXZRR/Ka0dz37gk+asvvPDCzeF/aJGPBaAahh5+7cqVKz/a3Nz8zf3794+ytPGjRPeKRvNut/vHubm5q3wUANXz+eef/+TSpUu/Gz7tD6/e6LEfl8bb6bufJYuwI/qNGzeeH0r+PYofoB6G2fOP33zzzZVRsJ0xgq4Xkc6fCuB+gtz247OOuFdeeeWHHYbNAGpjGFhffOutt160JPcjZI/00k+J5J2I9N1bWFh4nqIHqLWtvjzkXILgUc3vzKl75ASZIAjoYQeoF/Wm25E8UzTP2kbv2G30oeik7QA10+/3vQTBE2eiZo3oJ/7NbDeA+hlG9Li1JanrS7K00U+l8ER0gPoZeefnieSxokds/+RFvCGlDlC/6FGBN0ugztVG9zK+AQBUF9G9hOZ17uE1lpgCTC+5A65f5F1I3QGahU8RADQumuf5OqIDENEBANEBANEBANEBANEBANEBANEBANEBEB0AEB0AEB0AEB0AJsOsy3/ckydPIo+naQpzc3Ontu0FQHSLp0+fdo6Ojpr9ASE6kLoDAKIDAKIDIDoAIDoANAenu3Tn5+cb3Wut4TUARE9hYWGBTxiA1B0A0QEA0QEA0QEA0QEA0QEA0QEgD86Oo2sdepPXomeqpX3/+Bon/X7f+WOxZ2ZmOp7nIboLaNOJx48fO/3hLS0tHV/jpNvtNn4Nfxrnzp1r3Tp/UncARAcARAcARAcARAeAmmCL0QmgdeYa4tFQVq/Xc344axxoOEzlpuFEjQqo7ADRpxLJvby8fPwYIsk1pKXhQIhG+wo899xzJ8a+Jfre3h6VJKn79HH27NkTkoeR6syZM6e+Dv/PflQ+9gQXlZfGwwHRpy4qJc1iW1xcpJBiyi0pQ9J2YYDo01PQKVNViegxbcuUGWyUG6KDA6S1wWmjI3ql6WTeSKJz4Mp83wXUoZYXyg3RJ5aC64ZVx1qeFVDqJT48PIz9nuu97uqD0KWOtTyozOKG0rRoyfUViog+ITQ8JsElvGTPg4bRDg4Ont24ukl1s7o+TKSyClfZKRvKsw23ykXlo4owLCOV36NHj5xfnThOGEfPGZXMziE91w2c54bTDdu2MfOwcjRTeE0UyjrpRYKrgtQFRPTaopKJvsYQT/bKUUj6vE0fQPSJRCUTJrzkqxzD7+Vt+gCi1x6V7AiVVBGYNzeVY+dE0ydLTzyRH9EnGpVMFNGTepR1s66srLTmPLi0ytH8uaQy0fdWV1dbV0ki+pRFJRO11aMqBf2+5mXrURHM9TQ/a+UYElcm5jx3fQ6A6BONSiZ251woeXgjZ03z21I5hmVid86FK/3MNH/cG2EiOuSOSiZm51xUtNK/i8wSc7VyDMs77JwLV6bZlYU+D86MR/SJRiU7Qun3JXxc+1Nfd21YrkzlGEZtlVlS2bueDSF6A6KSHbXTOt50U7vUyTQOCdPWEYRpPiD6RKNS3sjvyk2rMqvrUAS9D+v3EX3iUSlv5G96e11/Q90dZW0YvUD0KU7Zi75vk9vrkxr6Yhotok91yh7XXm/iTasym1Rk1WeWd9kropOyT1S0JrbXJ5Gy2ygTor2O6Jmj0jScrtm0SSHTMlttklkFohOVCt+0TZgUMk1ytWG2Yekg0vYC0KYG+/v7U/V/asL2SNqrTZtHAKI3AknFvmP50e4wHItE6g4AiA4AiA4AtNEz1WC+7/ySxioWxLRhmKqNvfPOip53/3D4ClfXyZO6AwARvanodA9dVaJdUFw7o3tnZ6fyAybW19cxD9HHJ/rW1lal73Hx4kXnRN/e3q68gkR0UncAQHQAIHW32s9Krat+D9e4cOHC8UETgOiNEd1FEatmbW2NQiB1BwBEBwBEBwBEBwBEB4CiONvrrmmc2u6ozRTZVbbb7bZ65xhXD8B0VnRtD3V0dERVnhNJTrkR0ZvTJmnBevSqIhp/P6I3BtajF4P16I4GPooAgNS9sWjP8Ta2NdVcKXPqjDox27j9tbI/l86qb43okvzx48ftrL1LiK6RirZWkIjexDZJSzvjyt6sbe2Mc33DSDrj4AR0xjkaACgCAEQHAEQHAEQHAEQHgHpwevVamYMI1PtcZjy6qRwcHJRavcY+fYheKzpxpMwBDhsbG628aTc3N0sd4HD16lWsQvT60Bh6GVHbOnHkzJkzWIHozUGSl5kw09bJNtru+fz585iB6M2J6MyMI6LDV9DrDoDoAIDoAIDoAIDoAIDoADAunN7X3fW9z7SbzLi3P9L01yAInC43TYZyfUeZ1oiuee6u7xm3tLR0fI0TndTi+p5xmkzVtnUMpO4AiA4AiA4AiA4AiA4ANTFLEdSLhnXm5+ePh8U0jKWTUdp4BFLuiDQsL5Wbyk/lVWb3IESHStH4rYZ2zDFcbVml7Zu4ceNZXFw8dbCEhhX39/dLbXtF6g6VRHJb8hCtAecs92gUxaNOj1GEP3v2LAWE6NN3wybNxmKTjPhyS0vnAdGnqo1Z5vttJS3TaevefogOTpHWBqcjE9ErQ51DedvUaZ1tbeiMU19E3sUkafPu23iWO6LXgFJFdQ4tLy/numkVedS7Hhe1XBddveTqh8h7LPPh4WFsVFd5EtGzwfBaTiS4CHvRd3d3c0V13Zi64cM2ucbRdTO7XjmGq+z0t0vcrH+z5hroQAkziwrH0YnmiF5ZVDI7f/Rc6WhcpI5LNdt2g4aVY4iiumTPWg6SXUuOXV92TOo+ZVHJhP3j81WOpvyMNCD61EclE0V1hnmyV45h00cTXtq20wuiNzAqmcTNejtR2C2LYEmVY1gRZOmcoxJF9IlGJTtCJR3qqNdZWVkZ+9ZPTa4cw6aPOtqSvq9yRXZEn2hUsmWOOrvMnOcuAVyf1561cgxRVI8qE0kejr3nHc4ERB97VLJvTrNzLmoxS5GJI65WjubvmE0biW9WmlnTfED0SqOSSdg5F0puVxa6oV09tbRI5RhWiOFqNP1+VGWhCpRFLMVgHH2MUclEgmsyTNxNrxtWbVOXJsuUqRxNwRXN4zIeVZC9Xo8ZcUT0yUUlO0Klja8rFXWpk6ls5RhWgEnNGjPyA6JPLCoVkcOF9vo4Ksc8nxHtdUSfeFRq201bd+Uo1OyhvY7oUx+VTJo8jXaSqbTroxeI7khUcqG9rjKb1Iw/2uuIPvUpe9RNO+n/Q17UO540q60OdFhiW2YbInpDU/Ymt9dVMU3LXIA2zDZE9Ian7DZN6WSaZMpOe71A5tP2AtCmBjoIYJpowmQQdnhB9EYhqZhllR/tEMMpKaTuAIDoAIDoAEAbPQttGG6p4m9Uj7/Gpp2Obi3clNLZT1Q3q+s3bBWwoy2pOwAQ0acLne6hq0q0uUTShpBNZGdnp/LjodbX1zEP0ccn+tbWVqXvcfHiRedE397erryCRHRSdwBAdAAgdbfaz0qtq34P17hw4cLxQROA6I0R3UURq2ZtbY1CIHUHAEQHAEQHAEQHAEQHgKI42+uuaZw6+6zNFNkKudvttnrnGFdPgXFWdG0PxZ5m+ZHklBsRvTGw/W8x2rAePbEt6+haddajwwlYj+5oBUYRAJC6N5a2dsYp9S4TldvaGefaWfWtEb2tnXFlmytt7YzTQR5E9Ca2SXy/lR1yZTuTXI5qSbh+nJOzojf5zPFJp7DgYACgCAAQHQAQHQAQHQAQHQDqgQMcYtDeaW3stS97gAN7tiN67aKXOcBBG0u2UfSyBzggOqk7ABDRx4siC9ElPxsbGxQCER0AEB0AEB0AEB0AEB0AEB0AEB0A0QEA0QEA0QEA0QEA0QEA0QEA0QEA0QGcI8j59UTR086n6VPeAPUKPhgMCp8blRbRg6h/7+7ufkm5A9RHv9/f297e3jM8DGL8DMqk7uYLBB999NHfMkR9ABgTT548+fedO3e28shtEnmy3OzsrDf63syoMtDjrHHN7+3t/XZpaek7fAQA1XPv3r3r165d+/3wqY667Y0ew+fhNRhdEn/Q6/UKR/Rn1yeffPKL4Qv9h48AoFq63e4/33///b9GeZg1ovsZBe9Yj8Frr732948//vhnpPAA1XF4ePjw3Xff/emnn37aNaJ1nOS2q8+IPAzb9/0wdY+6/NHl3bp168u1tbU/vfTSS9+cm5tb8zxvho8GoDyDweBgc3Pz9nvvvffz27dv74wk74+unvF8YKXsgfEamdvopthhO12Pc2ab/fXXX1995513vr2+vv6NYbt9VT8fBEHiewDAafr9/tPd3d3/fvbZZw8++OCDfw2f9yy5e0Yb3RS+b0d8s42eJHqY2nuG6DOW6Kb8M2a0t5oFyA6Qjpl6h9L2jWhudrz1R7Kb3zclP5G+zya8oRfxxmGU7xvyesbPzBi/O0BwgEKyB4ZzAytqR4pt/e7p4F3wzfuWxKbkvtWmJ6ID5IvmHavtHSf7oJPcKZcsunL7YfreifjlgSFuP6Ii8BEdoLTodkQfxEhuyv7sNcy2eZaIHlhpuS26LfgA0QHGLrqZRQ8Sonns0Fqi6FZU96yUwv4P+TGSIzpAcdHtTjnzMSl1P0WqgEYPfNR4utc53dOO5ADVRPWoxxPRPCptT0vd7RTerjEGxtcHRvpuC47oAOOL7HEz42IlzyzhKIWPEjjuinpthAdIljtN9qivh03tcql7Btmj5EdugPLSR42Pn3pMiuSFRLRk7ySk6MgOMN7IHlkRZJG8sIQxwpOuA4xf9tgKIKvkYxPR6Jmv/L0AWiL3qZ/JI3at8o0iPwDkoIzQAAAAAAAAAAAAAABQNf8TYAABwfBjL/dDRAAAAABJRU5ErkJggg==';

    const FRONTPAGE_LAYOUTS = [
        { layout: '1-2', icon: '1-2', title: __('The leading post on top, the rest in 2 columns below', 'advanced-gutenberg') },
        { layout: '1-3', icon: '1-3', title: __('The leading post on top, the rest in 3 columns below', 'advanced-gutenberg') },
        { layout: '1-4', icon: '1-4', title: __('The leading post on top, the rest in 4 columns below', 'advanced-gutenberg') },
        { layout: '1-5', icon: '1-5', title: __('The leading post on top, the rest in 5 columns below', 'advanced-gutenberg') },
        { layout: 'stacked', icon: 'stacked', title: __('Stacked', 'advanced-gutenberg') },
        { layout: '2-2', icon: '2-2', title: __('All posts in 2 columns grid', 'advanced-gutenberg') },
        { layout: '3-3', icon: '3-3', title: __('All posts in 3 columns grid', 'advanced-gutenberg') },
        { layout: '4-4', icon: '4-4', title: __('All posts in 4 columns grid', 'advanced-gutenberg') },
        { layout: '5-5', icon: '5-5', title: __('All posts in 5 columns grid', 'advanced-gutenberg') },
    ];

    // @TODO fix duplicated code from FRONTPAGE_LAYOUTS
    const FRONTPAGE_LAYOUTS_TABLET = [
        { layout: '1-2', icon: '1-2', title: __('The leading post on top, the rest in 2 columns below', 'advanced-gutenberg') },
        { layout: '1-3', icon: '1-3', title: __('The leading post on top, the rest in 3 columns below', 'advanced-gutenberg') },
        { layout: '1-4', icon: '1-4', title: __('The leading post on top, the rest in 4 columns below', 'advanced-gutenberg') },
        { layout: '1-5', icon: '1-5', title: __('The leading post on top, the rest in 5 columns below', 'advanced-gutenberg') },
        { layout: 'stacked', icon: 'stacked', title: __('Stacked', 'advanced-gutenberg') },
        { layout: '2-2', icon: '2-2', title: __('All posts in 2 columns grid', 'advanced-gutenberg') },
        { layout: '3-3', icon: '3-3', title: __('All posts in 3 columns grid', 'advanced-gutenberg') },
        { layout: '4-4', icon: '4-4', title: __('All posts in 4 columns grid', 'advanced-gutenberg') },
        { layout: '5-5', icon: '5-5', title: __('All posts in 5 columns grid', 'advanced-gutenberg') },
    ];

    const FRONTPAGE_LAYOUTS_MOBILE = [
        { layout: '1-2', icon: '1-2', title: __('The leading post on top, the rest in 2 columns below', 'advanced-gutenberg') },
        { layout: 'stacked', icon: 'stacked', title: __('Stacked', 'advanced-gutenberg') },
        { layout: '2-2', icon: '2-2', title: __('All posts in 2 columns grid', 'advanced-gutenberg') },
    ];

    const GAP_OPTIONS = [
        { label: __('None', 'advanced-gutenberg'), value: 0 },
        { label: '5px', value: 5 },
        { label: '10px', value: 10 },
        { label: '20px', value: 20 },
        { label: '30px', value: 30 },
        { label: '40px', value: 40 },
        { label: '50px', value: 50 },
    ];

    const NEWSPAPER_LAYOUTS = [
        { layout: 'np-1-1', icon: 'np-1-1', items: 2, title: __('The leading post in the left, 1 post in the right', 'advanced-gutenberg') },
        { layout: 'np-1-2', icon: 'np-1-2', items: 3, title: __('The leading post in the left, 2 posts in the right', 'advanced-gutenberg') },
        { layout: 'np-1-3', icon: 'np-1-3', items: 4, title: __('The leading post in the left, 3 posts in the right', 'advanced-gutenberg') },
        { layout: 'np-1-4', icon: 'np-1-4', items: 5, title: __('The leading post in the left, 4 posts in the right', 'advanced-gutenberg') },
        { layout: 'np-1-5', icon: 'np-1-5', items: 6, title: __('The leading post in the left, 5 posts in the right', 'advanced-gutenberg') },
        { layout: 'np-1-1-r', icon: 'np-1-1-r', items: 2, title: __('The leading post in the right, 1 post in the left', 'advanced-gutenberg') },
        { layout: 'np-1-2-r', icon: 'np-1-2-r', items: 3, title: __('The leading post in the right, 2 posts in the left', 'advanced-gutenberg') },
        { layout: 'np-1-3-r', icon: 'np-1-3-r', items: 4, title: __('The leading post in the right, 3 posts in the left', 'advanced-gutenberg') },
        { layout: 'np-1-4-r', icon: 'np-1-4-r', items: 5, title: __('The leading post in the right, 4 posts in the left', 'advanced-gutenberg') },
        { layout: 'np-1-5-r', icon: 'np-1-5-r', items: 6, title: __('The leading post in the right, 5 posts in the left', 'advanced-gutenberg') },
        { layout: 'np-2', icon: 'np-2', items: 3, title: __('The leading post on top, the rest of posts below', 'advanced-gutenberg') },
        { layout: 'np-3-1', icon: 'np-3-1', items: 3, title: __('The leading post on top, below 2 columns with 1 post in the left and 1 post in the right', 'advanced-gutenberg') },
        { layout: 'np-3-2', icon: 'np-3-2', items: 4, title: __('The leading post on top, below 2 columns with 1 post in the left and 2 posts in the right', 'advanced-gutenberg') },
        { layout: 'np-3-3', icon: 'np-3-3', items: 5, title: __('The leading post on top, below 2 columns with 1 post in the left and 3 posts in the right', 'advanced-gutenberg') },
    ];

    const ORDER_SECTIONS = [
        { label: 'Default', value: 'default' },
        { label: 'Title, Image, Info, Text', value: 'title-image-info-text' },
        { label: 'Image, Title, Text, Info', value: 'image-title-text-info' },
        { label: 'Title, Image, Text, Info', value: 'title-image-text-info' },
        { label: 'Title, Info, Text, Image', value: 'title-info-text-image' },
        { label: 'Title, Text, Info, Image', value: 'title-text-info-image' },
        { label: 'Title, Text, Image, Info', value: 'title-text-image-info' },
    ];

    const DISPLAY_FOR = [
        { label: __('For all posts', 'advanced-gutenberg'), value: 'all' },
        { label: __('For the first post', 'advanced-gutenberg'), value: 1 },
        { label: __('For the first 2 posts', 'advanced-gutenberg'), value: 2 },
        { label: __('For the first 3 posts', 'advanced-gutenberg'), value: 3 },
        { label: __('For the first 4 posts', 'advanced-gutenberg'), value: 4 },
        { label: __('For the first 5 posts', 'advanced-gutenberg'), value: 5 },
    ];

    const CUSTOM_TAX_PREFIX = 'custom-tax-';

    let initSlider = null;
    let initMasonry = null;

    class RecentPostsEdit extends Component {
        constructor() {
            super(...arguments);

            this.state = {
                categoriesList: [],
                tagsList: [],
                catIdVsName: [],
                tagNameVsId: [],
                postTypeList: [],
                updating: false,
                tabSelected: 'desktop',
                updatePostSuggestions: true, // Backward compatibility 2.13.2 and lower
                authorList: [],
                isBlockIdSet: false, // @since 3.2.3
                //@since 3.3.2
                includePostsMethod: 'search', // 'search' or 'ids'
                postIdsInputValue: ''
            }

            this.selectCategories = this.selectCategories.bind(this);
            this.selectTags = this.selectTags.bind(this);
            this.getTagIdsForTags = this.getTagIdsForTags.bind(this);
            this.getCategoryForBkwrdCompat = this.getCategoryForBkwrdCompat.bind(this);
            this.selectPostByTitle = this.selectPostByTitle.bind(this); // Backward compatibility 2.13.1 and lower
            this.updatePostType = this.updatePostType.bind(this);
            this.getPostIds = this.getPostIds.bind(this);
            this.getPostTitles = this.getPostTitles.bind(this);
        }

        componentWillMount() {
            const { attributes, setAttributes } = this.props;
            const currentBlockConfig = advgbDefaultConfig['advgb-recent-posts'];

            const tagsAndcategoriesListQuery = {
                per_page: -1,
                hide_empty: true,
            };

            // No override attributes of blocks inserted before
            if (attributes.changed !== true) {
                if (typeof currentBlockConfig === 'object' && currentBlockConfig !== null) {
                    Object.keys(currentBlockConfig).map((attribute) => {
                        if (typeof attributes[attribute] === 'boolean') {
                            attributes[attribute] = !!currentBlockConfig[attribute];
                        } else {
                            attributes[attribute] = currentBlockConfig[attribute];
                        }
                    });
                }

                // Finally set changed attribute to true, so we don't modify anything again
                setAttributes({ changed: true });
            }

            // Do we need this?
            if (!!attributes.searchString) {
                setAttributes({ searchString: '' });
            }

            wp.apiFetch({
                path: wp.url.addQueryArgs('advgb/v1/exclude_post_types'),
            }).then((excludePostTypes) => {
                wp.apiFetch({
                    path: wp.url.addQueryArgs('wp/v2/types', { context: 'edit' }),
                }).then((list) => {
                    let types = [];
                    Object.keys(list).forEach(type => {
                        if (list[type].viewable && !excludePostTypes.includes(type)) {
                            types.push({ label: list[type].name, value: list[type].slug });
                        }
                    });
                    this.setState({ postTypeList: types });
                });
            });

            wp.apiFetch({
                path: wp.url.addQueryArgs('wp/v2/categories', tagsAndcategoriesListQuery),
            }).then((list) => {
                let suggestions = [];
                let catIdVsName = [];
                list.forEach(cat => {
                    suggestions[cat.name] = cat;
                    catIdVsName[cat.id] = cat.name;
                });
                this.setState({ categoriesList: suggestions, catIdVsName: catIdVsName });

                // for backward compatibility, extract the (single select) category and set it as the (mutli select) categories
                // and make the (single select) category empty
                const categories = attributes.category && attributes.category !== undefined && attributes.category.length > 0 ? [this.getCategoryForBkwrdCompat(attributes.category)] : attributes.categories;
                setAttributes({
                    categories: categories,
                    category: ''
                });
            });

            wp.apiFetch({
                path: wp.url.addQueryArgs('wp/v2/tags', tagsAndcategoriesListQuery),
            }).then((list) => {
                let suggestions = [];
                let tagNameVsId = [];
                list.forEach(tag => {
                    suggestions.push(tag.name);
                    tagNameVsId[tag.name] = tag.id;
                });

                this.setState({ tagsList: suggestions, tagNameVsId: tagNameVsId });

                const tagIds = attributes.tags && attributes.tags.length > 0 ? this.getTagIdsForTags(attributes.tags) : [];
                setAttributes({
                    tagIds: tagIds,
                });

            });

            wp.apiFetch({
                path: wp.url.addQueryArgs('advgb/v1/authors'),
            }).then((list) => {
                this.setState({ authorList: list });
            });

            // migrate from displayDate to postDate
            let postDateDisplay = attributes.displayDate ? 'created' : attributes.postDate;
            setAttributes({
                postDate: postDateDisplay,
                displayDate: false,
            });

            const postType = attributes.postType === undefined ? 'post' : attributes.postType;
            this.generateTaxFilters(postType);
        }

        componentWillUpdate(nextProps) {
            const { recentPosts: nextPosts } = nextProps;
            const { postView: nextView } = nextProps.attributes;
            const { attributes, clientId, recentPosts } = this.props;
            const $ = jQuery;

            if (nextView !== 'slider' || (nextPosts && recentPosts && nextPosts.length !== recentPosts.length)) {
                $(`#block-${clientId} .advgb-recent-posts.slick-initialized`).slick('unslick');
                $(`#block-${clientId} .advgb-recent-post`)
                    .removeAttr('tabindex')
                    .removeAttr('role')
                    .removeAttr('aria-describedby');

                if (nextView === 'slider' && (nextPosts && recentPosts && nextPosts.length !== recentPosts.length)) {
                    if (!this.state.updating) {
                        this.setState({ updating: true });
                    }
                }

                if (initSlider) {
                    clearTimeout(initSlider);
                }
            }

            if (nextView !== 'masonry' || (nextPosts && recentPosts && nextPosts.length !== recentPosts.length)) {
                $(`#block-${clientId} .masonry-view .advgb-recent-posts`).isotope('destroy');

                if (nextView === 'masonry' && (nextPosts && recentPosts && nextPosts.length !== recentPosts.length)) {
                    if (!this.state.updating) {
                        this.setState({ updating: true });
                    }
                }

                if (initMasonry) {
                    clearTimeout(initMasonry);
                }
            }

        }

        componentDidMount() {
            const { setAttributes } = this.props;

            // Reset attributes when Pro is not available
            if (!this.isPro() && this.checkIncludeEnabled()) {
                setAttributes({ includePosts: [] });
            }
        }

        componentDidUpdate(prevProps) {
            const that = this;
            const { attributes, clientId, setAttributes, postList } = this.props;
            const { postView, sliderAutoplay, sliderAutoplaySpeed } = attributes;
            const $ = jQuery;

            // @since 3.2.3 - https://github.com/publishpress/PublishPress-Blocks/issues/1389
            if (!this.state.isBlockIdSet) {
                setAttributes({ id: 'recent-posts-' + clientId });
                this.setState({ isBlockIdSet: true });
            }

            if (postView === 'slider') {

                // Autoplay
                initSlider = setTimeout(function () {
                    $(`#block-${clientId} .advgb-recent-posts-block.slider-view .advgb-recent-posts:not(.slick-initialized)`).slick({
                        dots: true,
                        adaptiveHeight: true,
                        autoplay: sliderAutoplay,
                    });

                    $(`#block-${clientId} .advgb-recent-posts-block.slider-view .advgb-recent-posts.slick-initialized`).slick('slickSetOption', 'autoplay', sliderAutoplay, true);

                    if (that.state.updating) {
                        that.setState({ updating: false });
                    }
                }, 100);

                // Autoplay speed
                if (sliderAutoplay && sliderAutoplaySpeed && advgbBlocks.advgb_pro !== 'undefined' && advgbBlocks.advgb_pro === '1') {
                    $(`#block-${clientId} .advgb-recent-posts-block.slider-view .advgb-recent-posts.slick-initialized`).slick('slickSetOption', 'autoplaySpeed', sliderAutoplaySpeed, true);
                } else {
                    $(`#block-${clientId} .advgb-recent-posts-block.slider-view .advgb-recent-posts.slick-initialized`).slick('slickSetOption', 'autoplaySpeed', 3000, true);
                }

            } else {
                $(`#block-${clientId} .advgb-recent-posts.slick-initialized`).slick('unslick');
            }

            if (postView === 'masonry') {

                initMasonry = setTimeout(function () {
                    var $masonry = $(`#block-${clientId} .masonry-view .advgb-recent-posts`);
                    $masonry.isotope({
                        itemSelector: '.advgb-recent-post',
                        percentPosition: true
                    });
                    $(window).resize(function () {
                        $masonry.isotope();
                    });

                    if (that.state.updating) {
                        that.setState({ updating: false });
                    }
                }, 100);

            } else {
                $(`#block-${clientId} .masonry-view .advgb-recent-posts`).isotope('destroy');
            }

            // Backward compatibility 2.13.1 and lower
            if (this.state.updatePostSuggestions && attributes.exclude && attributes.exclude.length > 0 && postList) {
                let postSuggestions = [];
                let postTitleVsIdMap = [];
                postList.forEach(post => {
                    postSuggestions.push(post.title.raw);
                    postTitleVsIdMap[post.title.raw] = post.id;
                });
                this.setState({ postTitleVsIdMap: postTitleVsIdMap, updatePostSuggestions: false }, function () {
                    if (!attributes.excludeIds) {
                        this.selectPostByTitle(attributes.exclude, 'exclude');
                    }
                });
            }
        }

        translatableText(text) {
            switch (text) {
                case 'desktop':
                    return __('desktop', 'advanced-gutenberg');
                    break;
                case 'tablet':
                    return __('tablet', 'advanced-gutenberg');
                    break;
                case 'mobile':
                    return __('mobile', 'advanced-gutenberg');
                    break;
            }
        }

        isPro() {
            return advgbBlocks.advgb_pro !== 'undefined' && advgbBlocks.advgb_pro === '1';
        }

        checkIncludeEnabled() {
            return typeof this.props.attributes.includePosts !== 'undefined' && this.props.attributes.includePosts.length > 0;
        }

        renderInfoSections(post, index) {
            const { attributes } = this.props;
            const { infoSectionOrder, infoSectionSeparator, hideInfoSeparators, postType } = attributes;
            const order = infoSectionOrder || ['author', 'date', 'comments'];
            const separator = hideInfoSeparators ? '' : (infoSectionSeparator || ' ');

            const sections = [];

            order.forEach((item, itemIndex) => {
                let sectionContent = null;

                switch (item) {
                    case 'author':
                        if (this.checkElementDisplay('author', index)) {
                            if (post.coauthors && post.coauthors.length > 0) {
                                sectionContent = post.coauthors.map((coauthor, coauthor_indx) => (
                                    <Fragment key={coauthor_indx}>
                                        <a href={coauthor.link} target="_blank" className="advgb-post-author">
                                            {coauthor.display_name}
                                        </a>
                                        {coauthor_indx < post.coauthors.length - 1 && <span>, </span>}
                                    </Fragment>
                                ));
                            } else {
                                sectionContent = (
                                    <a href={post.author_meta.author_link} target="_blank" className="advgb-post-author">
                                        {post.author_meta.display_name}
                                    </a>
                                );
                            }
                        }
                        break;

                    case 'date':
                        if (this.checkElementDisplay('date', index)) {
                            sectionContent = (
                                <span className="advgb-post-datetime">
                                    {this.getDateTime(post)}
                                </span>
                            );
                        }
                        break;

                    case 'comments':
                        if (postType === 'post' && this.checkElementDisplay('comments', index)) {
                            sectionContent = (
                                <span className="advgb-post-comments">
                                    <span className="dashicons dashicons-admin-comments"></span>
                                    ({post.comment_count})
                                </span>
                            );
                        }
                        break;
                }

                if (sectionContent) {
                    if (sections.length > 0 && !hideInfoSeparators) {
                        sections.push(<span key={`sep-${itemIndex}`}>{separator}</span>);
                    }
                    sections.push(<Fragment key={item}>{sectionContent}</Fragment>);
                }
            });

            return sections;
        }

        render() {
            const { categoriesList, tagsList, postTypeList, tabSelected, authorList, postSuggestions, taxonomyList } = this.state;
            const { attributes, setAttributes, recentPosts: recentPostsList, postsToSearch, postsToSearchResolved, postsToInclude, postsToIncludeResolved, postsToExclude, postsToExcludeResolved, postList } = this.props;
            const {
                id,
                postView,
                order,
                orderBy,
                numberOfPosts,
                columns,
                columnsT,
                columnsM,
                displayFeaturedImage,
                displayFeaturedImageFor,
                displayFeaturedImageCaption,
                enablePlaceholderImage,
                imageOpacity,
                imageOverlayColor,
                displayAuthor,
                displayAuthorFor,
                authorLinkNewTab,
                displayDate,
                postDate,
                postDateFor,
                postDateFormat,
                displayTime,
                displayExcerpt,
                displayExcerptFor,
                postTextAsExcerpt,
                postTextExcerptLength,
                displayReadMore,
                displayReadMoreFor,
                readMoreLbl,
                isPreview,
                categories,
                tags,
                frontpageLayout, frontpageLayoutT, frontpageLayoutM,
                gap,
                frontpageStyle,
                sliderStyle,
                newspaperLayout,
                excludeCurrentPost,
                showCategories,
                showCategoriesFor,
                showTags,
                showTagsFor,
                displayCommentCount,
                displayCommentCountFor,
                textAfterTitle,
                textBeforeReadmore,
                includePosts,
                excludePosts,
                offset,
                author: selectedAuthorId,
                sliderAutoplay,
                linkCustomTax,
                showCustomTaxList,
                showCustomTaxListFor,
                imagePosition,
                onlyFromCurrentUser,
                orderSections,
                customDateFormat,
                infoSectionOrder,
                infoSectionSeparator,
                hideInfoSeparators,
                removeDateTimeSeparator,
                absoluteDateCreatedPrefix,
                absoluteDateUpdatedPrefix,
                relativeDateCreatedPrefix,
                relativeDateUpdatedPrefix,
                showDatePrefix
            } = attributes;

            let recentPosts = this.props.recentPosts;
            let mergedPosts = this.getMergedPosts();
            let postSuggestionsExclude = this.getPostSuggestions(postList, 'exclude');
            let postSuggestionsInclude = this.getPostSuggestions(mergedPosts, 'include');

            // We need to check if we're in post edit or widgets screen
            const isInPost = wp.data.select('core/editor') && wp.data.select('core/editor').getCurrentPostType() === 'post';

            let postType = attributes.postType;
            if (postType === undefined) {
                postType = 'post';
            }

            let deviceLetter = '';
            if (tabSelected === 'tablet') deviceLetter = 'T';
            if (tabSelected === 'mobile') deviceLetter = 'M';

            const inspectorControls = (
                <InspectorControls>
                    {postView === 'slider' &&
                        <PanelBody title={__('Slider View Settings', 'advanced-gutenberg')}>
                            <SelectControl
                                label={__('Style', 'advanced-gutenberg')}
                                value={sliderStyle}
                                options={[
                                    { label: __('Default', 'advanced-gutenberg'), value: 'default' },
                                    { label: __('Headline', 'advanced-gutenberg'), value: 'headline' },
                                ]}
                                onChange={(value) => setAttributes({ sliderStyle: value })}
                            />
                            <ToggleControl
                                label={__('Autoplay', 'advanced-gutenberg')}
                                checked={sliderAutoplay}
                                onChange={() => setAttributes({ sliderAutoplay: !sliderAutoplay })}
                            />
                        </PanelBody>
                    }
                    {postView === 'frontpage' &&
                        <PanelBody title={__('Frontpage View Settings', 'advanced-gutenberg')}>
                            <div className="advgb-recent-posts-responsive-items">
                                {['desktop', 'tablet', 'mobile'].map((device, index) => {
                                    const itemClasses = [
                                        "advgb-recent-posts-responsive-item",
                                        tabSelected === device && 'is-selected',
                                    ].filter(Boolean).join(' ');

                                    return (
                                        <div className={itemClasses}
                                            key={index}
                                            onClick={() => this.setState({ tabSelected: device })}
                                        >
                                            {this.translatableText(device)}
                                        </div>
                                    )
                                })}
                            </div>
                            <div className="advgb-recent-posts-select-layout on-inspector">
                                {tabSelected === 'desktop' && FRONTPAGE_LAYOUTS.map((layout, index) => {
                                    const layoutClasses = [
                                        'advgb-recent-posts-layout',
                                        tabSelected === 'desktop' && layout.layout === frontpageLayout && 'is-selected',
                                    ].filter(Boolean).join(' ');

                                    return (
                                        <Tooltip text={layout.title} key={index}>
                                            <div
                                                className={layoutClasses}
                                                onClick={() => {
                                                    setAttributes({
                                                        ['frontpageLayout' + deviceLetter]: layout.layout
                                                    });
                                                    this.setState({ random: Math.random() });
                                                }}
                                            >
                                                <img src={advgbBlocks.pluginUrl + '/assets/blocks/recent-posts/icons/' + layout.icon + '.png'}
                                                    alt={layout.layout}
                                                />
                                            </div>
                                        </Tooltip>
                                    )
                                })}
                                {tabSelected === 'tablet' && FRONTPAGE_LAYOUTS_TABLET.map((layout, index) => {
                                    const layoutClasses = [
                                        'advgb-recent-posts-layout',
                                        tabSelected === 'tablet' && layout.layout === frontpageLayoutT && 'is-selected',
                                    ].filter(Boolean).join(' ');

                                    return (
                                        <Tooltip text={layout.title} key={index}>
                                            <div className={layoutClasses}
                                                onClick={() => {
                                                    setAttributes({
                                                        ['frontpageLayout' + deviceLetter]: layout.layout
                                                    });
                                                    this.setState({ random: Math.random() });
                                                }}
                                            >
                                                <img src={advgbBlocks.pluginUrl + '/assets/blocks/recent-posts/icons/' + layout.icon + '.png'}
                                                    alt={layout.layout}
                                                />
                                            </div>
                                        </Tooltip>
                                    )
                                })}
                                {tabSelected === 'mobile' && FRONTPAGE_LAYOUTS_MOBILE.map((layout, index) => {
                                    const layoutClasses = [
                                        'advgb-recent-posts-layout',
                                        tabSelected === 'mobile' && layout.layout === frontpageLayoutM && 'is-selected',
                                    ].filter(Boolean).join(' ');

                                    return (
                                        <Tooltip text={layout.title} key={index}>
                                            <div className={layoutClasses}
                                                onClick={() => {
                                                    setAttributes({
                                                        ['frontpageLayout' + deviceLetter]: layout.layout
                                                    });
                                                    this.setState({ random: Math.random() });
                                                }}
                                            >
                                                <img src={advgbBlocks.pluginUrl + '/assets/blocks/recent-posts/icons/' + layout.icon + '.png'}
                                                    alt={layout.layout}
                                                />
                                            </div>
                                        </Tooltip>
                                    )
                                })}
                            </div>
                            <SelectControl
                                label={__('Style', 'advanced-gutenberg')}
                                value={frontpageStyle}
                                options={[
                                    { label: __('Default', 'advanced-gutenberg'), value: 'default' },
                                    { label: __('Headline', 'advanced-gutenberg'), value: 'headline' },
                                    { label: __('Boxed', 'advanced-gutenberg'), value: 'boxed' },
                                ]}
                                onChange={(value) => setAttributes({ frontpageStyle: value })}
                            />
                            <SelectControl
                                label={__('Space between columns and rows', 'advanced-gutenberg')}
                                value={gap}
                                options={GAP_OPTIONS}
                                onChange={(value) => setAttributes({ gap: parseInt(value) })}
                            />
                        </PanelBody>
                    }

                    {postView === 'newspaper' &&
                        <PanelBody title={__('Newspaper View Settings', 'advanced-gutenberg')}>
                            <div className="advgb-recent-posts-select-layout on-inspector">
                                {NEWSPAPER_LAYOUTS.map((layout, index) => {
                                    const layoutClasses = [
                                        'advgb-recent-posts-layout',
                                        layout.layout === newspaperLayout && 'is-selected',
                                    ].filter(Boolean).join(' ');

                                    return (
                                        <Tooltip text={layout.title} key={index}>
                                            <div
                                                className={layoutClasses}
                                                onClick={() => {
                                                    setAttributes({
                                                        newspaperLayout: layout.layout
                                                    });
                                                    this.setState({ random: Math.random() });
                                                    this.newspaperOnChangeLayout(layout.layout);
                                                }}
                                            >
                                                <img src={advgbBlocks.pluginUrl + '/assets/blocks/recent-posts/icons/' + layout.icon + '.png'}
                                                    alt={layout.layout}
                                                />
                                            </div>
                                        </Tooltip>
                                    )
                                })}
                            </div>
                        </PanelBody>
                    }

                    {postView === 'masonry' &&
                        <PanelBody title={__('Masonry View Settings', 'advanced-gutenberg')}>
                            <SelectControl
                                label={__('Space between columns and rows', 'advanced-gutenberg')}
                                value={gap}
                                options={GAP_OPTIONS}
                                onChange={(value) => setAttributes({ gap: parseInt(value) })}
                            />
                        </PanelBody>
                    }
                    <PanelBody title={__('Post Settings', 'advanced-gutenberg')}>
                        <SelectControl
                            label={__('Post Type', 'advanced-gutenberg')}
                            value={postType}
                            options={postTypeList}
                            onChange={(value) => this.updatePostType(value)}
                        />
                        <AdvQueryControls
                            {...{ order, orderBy, postType }}
                            numberOfItems={numberOfPosts}
                            onOrderChange={(value) => setAttributes({ order: value })}
                            onOrderByChange={(value) => setAttributes({ orderBy: value })}
                            onNumberOfItemsChange={(value) => this.refreshOnChangeItems(value)}
                        />
                    </PanelBody>
                    <PanelBody title={__('Filters', 'advanced-gutenberg')}>
                        {this.isPro() && this.checkIncludeEnabled() &&
                            <div className="advgb-wrapper-disabled-msg notice notice-info">
                                <p>
                                    {__('To enable filters, clear Advanced Filters > Display these posts only', 'advanced-gutenberg')}
                                </p>
                            </div>
                        }
                        <Fragment>
                            <div className={this.isPro() && this.checkIncludeEnabled() ? 'advgb-wrapper-disabled' : ''}>
                                {this.isPro() && this.checkIncludeEnabled() &&
                                    <div className="advgb-wrapper-disabled-overlay"></div>
                                }
                                {postType === 'post' &&
                                    <Fragment>
                                        <FormTokenField
                                            key="query-controls-categories-select"
                                            label={__('Show content with these Categories', 'advanced-gutenberg')}
                                            value={
                                                categories &&
                                                categories.map((item) => ({
                                                    id: item.id,
                                                    value: item.name || item.value,
                                                }))
                                            }
                                            suggestions={Object.keys(categoriesList)}
                                            onChange={(value) => { this.selectCategories(value); }}
                                            maxSuggestions={MAX_CATEGORIES_SUGGESTIONS}
                                        />
                                        <FormTokenField
                                            multiple
                                            suggestions={tagsList}
                                            value={tags}
                                            label={__('Show content with these Tags', 'advanced-gutenberg')}
                                            placeholder={__('Type a tag', 'advanced-gutenberg')}
                                            onChange={(value) => {
                                                this.selectTags(value);
                                            }
                                            }
                                        />
                                    </Fragment>
                                }
                                {taxonomyList && taxonomyList.length > 0 &&
                                    taxonomyList.map((tax) =>
                                    (
                                        <FormTokenField
                                            multiple
                                            suggestions={tax.suggestions}
                                            value={this.populateTaxTerms(tax)}
                                            onChange={(value) => this.selectTaxTerms(tax, value)}
                                            key="query-controls-`${tax.slug}`-select"
                                            label={__('Show content with these ', 'advanced-gutenberg') + decodeEntities(`${tax.name}`)}
                                        />
                                    )
                                    )
                                }
                                {!onlyFromCurrentUser &&
                                    <AuthorSelect
                                        key="query-controls-author-select"
                                        authorList={authorList}
                                        label={__('Author', 'advanced-gutenberg')}
                                        noOptionLabel={__('All', 'advanced-gutenberg')}
                                        selectedAuthorId={selectedAuthorId}
                                        onChange={(value) => setAttributes({ author: value })}
                                    />
                                }
                                <ToggleControl
                                    label={__('Only shows posts written by the user viewing the block', 'advanced-gutenberg')}
                                    checked={onlyFromCurrentUser}
                                    onChange={() => setAttributes({ onlyFromCurrentUser: !onlyFromCurrentUser })}
                                />
                                {isInPost && postType === 'post' &&
                                    <ToggleControl
                                        label={__('Exclude current post', 'advanced-gutenberg')}
                                        help={__('If this post is listed in the block, you can exclude it.', 'advanced-gutenberg')}
                                        checked={excludeCurrentPost}
                                        onChange={() => setAttributes({ excludeCurrentPost: !excludeCurrentPost })}
                                    />
                                }
                                <FormTokenField
                                    multiple
                                    suggestions={postSuggestionsExclude}
                                    value={this.getPostTitles(excludePosts, postList)}
                                    label={__('Exclude these posts', 'advanced-gutenberg')}
                                    placeholder={__('Search by title', 'advanced-gutenberg')}
                                    onChange={(excludePosts) => this.getPostIds(excludePosts, postList, 'exclude')}
                                />
                                <RangeControl
                                    label={__('Offset the first posts', 'advanced-gutenberg')}
                                    value={offset}
                                    min={0}
                                    max={10}
                                    onChange={(value) => setAttributes({ offset: value })}
                                />
                            </div>
                        </Fragment>
                    </PanelBody>
                    {this.isPro() ? (
                        <Fragment>
                            <PanelBody title={__('Advanced Filters', 'advanced-gutenberg')} className="advgb-pro-icon">
                                <label className="components-base-control__label">
                                    {__('Display these posts only', 'advanced-gutenberg')}
                                </label>

                                <div className="advgb-include-posts-tabs">
                                    <div className="advgb-tab-buttons">
                                        <button
                                            className={`advgb-tab-button ${this.state.includePostsMethod === 'search' ? 'active' : ''}`}
                                            onClick={() => this.setState({ includePostsMethod: 'search' })}
                                        >
                                            {__('Search Posts', 'advanced-gutenberg')}
                                        </button>
                                        <button
                                            className={`advgb-tab-button ${this.state.includePostsMethod === 'ids' ? 'active' : ''}`}
                                            onClick={() => this.setState({ includePostsMethod: 'ids' })}
                                        >
                                            {__('Enter Post IDs', 'advanced-gutenberg')}
                                        </button>
                                    </div>

                                    <div className="advgb-tab-content">
                                        {this.state.includePostsMethod === 'search' ? (
                                            <FormTokenField
                                                multiple
                                                suggestions={postSuggestionsInclude}
                                                onInputChange={(value) => {
                                                    setAttributes({ searchString: value })
                                                }}
                                                maxSuggestions={10}
                                                value={this.getPostTitles(includePosts, mergedPosts)}
                                                placeholder={__('Search by title', 'advanced-gutenberg')}
                                                onChange={(includePosts) => this.getPostIds(includePosts, mergedPosts, 'include')}
                                            />
                                        ) : (
                                            <TextareaControl
                                                help={__('Enter post IDs separated by commas (e.g., 123, 456, 789)', 'advanced-gutenberg')}
                                                value={this.state.postIdsInputValue || (includePosts ? includePosts.join(', ') : '')}
                                                onChange={(value) => this.handlePostIdsInput(value)}
                                                placeholder={__('123, 456, 789', 'advanced-gutenberg')}
                                            />
                                        )}
                                    </div>
                                </div>
                            </PanelBody>
                            <></>
                        </Fragment>
                    ) : (
                        <Fragment>
                            <PanelBody title={__('Advanced Filters', 'advanced-gutenberg')} className="advgb-pro-icon">
                                <div className="advgb-promo-overlay-area">
                                    <div className="advgb-blur">
                                        <label className="components-base-control__label">
                                            {__('Display these posts only', 'advanced-gutenberg')}
                                        </label>

                                        <div className="advgb-include-posts-tabs">
                                            <div className="advgb-tab-buttons">
                                                <button
                                                    className={`advgb-tab-button active`}
                                                >
                                                    {__('Search Posts', 'advanced-gutenberg')}
                                                </button>
                                                <button
                                                    className={`advgb-tab-button`}
                                                >
                                                    {__('Enter Post IDs', 'advanced-gutenberg')}
                                                </button>
                                            </div>

                                            <div className="advgb-tab-content">
                                                <FormTokenField
                                                    multiple
                                                    maxSuggestions={10}
                                                    placeholder={__('Search by title', 'advanced-gutenberg')}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="advgb-pro-overlay-wrap">
                                        <div className="advgb-pro-overlay-text advgb-tooltips ppb-tooltips-library click" data-toggle="ppbtooltip" data-placement="top">
                                            <span className="advgb-promo-text">
                                                {__('Pro', 'advanced-gutenberg')}
                                            </span>
                                            <span className="tooltip-text">
                                                <p>
                                                    {__('PublishPress Blocks Pro supports filters for content.', 'advanced-gutenberg')}
                                                </p>
                                                <p>
                                                    <a className="clickable" href="https://publishpress.com/links/blocks-menu" target="_blank">
                                                        {__('Upgrade to Pro', 'advanced-gutenberg')}
                                                    </a>
                                                </p>
                                                <i></i>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </PanelBody>
                            <></>
                        </Fragment>
                    )}
                    <PanelBody title={__('Display Settings', 'advanced-gutenberg')}>
                        {((postView === 'grid') || (postView === 'masonry')) &&
                            <RangeControl
                                label={__('Columns', 'advanced-gutenberg')}
                                value={columns}
                                min={1}
                                max={4}
                                onChange={(value) => setAttributes({ columns: value })}
                            />
                        }
                        {postView === 'masonry' &&
                            <Fragment>
                                <RangeControl
                                    label={__('Columns (Tablet)', 'advanced-gutenberg')}
                                    value={columnsT}
                                    min={1}
                                    max={4}
                                    onChange={(value) => setAttributes({ columnsT: value })}
                                />
                                <RangeControl
                                    label={__('Columns (Mobile)', 'advanced-gutenberg')}
                                    value={columnsM}
                                    min={1}
                                    max={4}
                                    onChange={(value) => setAttributes({ columnsM: value })}
                                />
                            </Fragment>
                        }
                        <ToggleControl
                            label={__('Display Featured Image', 'advanced-gutenberg')}
                            checked={displayFeaturedImage}
                            onChange={() => setAttributes({ displayFeaturedImage: !displayFeaturedImage })}
                        />
                        {displayFeaturedImage &&
                            <Fragment>
                                <SelectControl
                                    value={displayFeaturedImageFor}
                                    options={DISPLAY_FOR}
                                    onChange={(value) => { setAttributes({ displayFeaturedImageFor: value }) }}
                                    className="advgb-child-select"
                                />
                                <ToggleControl
                                    label={__('Enable Placeholder Image', 'advanced-gutenberg')}
                                    checked={enablePlaceholderImage}
                                    onChange={() => setAttributes({ enablePlaceholderImage: !enablePlaceholderImage })}
                                    className="advgb-child-toggle"
                                    help={__('If a post doesn\'t have a featured image, the placeholder image will be displayed instead', 'advanced-gutenberg')}
                                />
                                {postView === 'list' &&
                                    <SelectControl
                                        label={__('Position', 'advanced-gutenberg')}
                                        value={imagePosition}
                                        options={[
                                            { label: __('Left', 'advanced-gutenberg'), value: 'left' },
                                            { label: __('Right', 'advanced-gutenberg'), value: 'right' },
                                        ]}
                                        onChange={(value) => setAttributes({ imagePosition: value })}
                                        className="advgb-child-select"
                                    />
                                }
                                {((postView === 'frontpage' && frontpageStyle === 'headline')
                                    || (postView === 'slider' && sliderStyle === 'headline')) &&
                                    <Fragment>
                                        <RangeControl
                                            label={__('Image opacity', 'advanced-gutenberg')}
                                            value={imageOpacity}
                                            min={0}
                                            max={1}
                                            step={0.1}
                                            onChange={(value) => setAttributes({ imageOpacity: value })}
                                            className="advgb-child-range"
                                        />
                                        <div className="advgb-child-advcolor">
                                            <AdvColorControl
                                                label={__('Overlay Color', 'advanced-gutenberg')}
                                                value={imageOverlayColor}
                                                onChange={(value) => setAttributes({ imageOverlayColor: value })}
                                            />
                                        </div>
                                    </Fragment>
                                }
                                <ToggleControl
                                    label={__('Display Caption', 'advanced-gutenberg')}
                                    checked={displayFeaturedImageCaption}
                                    onChange={() => setAttributes({ displayFeaturedImageCaption: !displayFeaturedImageCaption })}
                                    className="advgb-child-toggle"
                                />
                            </Fragment>
                        }
                        <ToggleControl
                            label={__('Display Post Author', 'advanced-gutenberg')}
                            checked={displayAuthor}
                            onChange={() => setAttributes({ displayAuthor: !displayAuthor })}
                        />
                        {displayAuthor &&
                            <Fragment>
                                <SelectControl
                                    value={displayAuthorFor}
                                    options={DISPLAY_FOR}
                                    onChange={(value) => { setAttributes({ displayAuthorFor: value }) }}
                                    className="advgb-child-select"
                                />
                                <ToggleControl
                                    label={__('Open link in new tab', 'advanced-gutenberg')}
                                    checked={!!authorLinkNewTab}
                                    onChange={() => setAttributes({ authorLinkNewTab: !authorLinkNewTab })}
                                    className="advgb-child-toggle"
                                />
                            </Fragment>
                        }
                        <SelectControl
                            label={__('Display Post Date', 'advanced-gutenberg')}
                            value={postDate}
                            options={[
                                { label: __('Hide', 'advanced-gutenberg'), value: 'hide' },
                                { label: __('Created Date', 'advanced-gutenberg'), value: 'created' },
                                { label: __('Updated Date', 'advanced-gutenberg'), value: 'updated' },
                            ]}
                            onChange={(value) => { setAttributes({ postDate: value }) }}
                        />
                        {postDate !== 'hide' &&
                            <Fragment>
                                <SelectControl
                                    value={postDateFor}
                                    options={DISPLAY_FOR}
                                    onChange={(value) => { setAttributes({ postDateFor: value }) }}
                                    className="advgb-child-select"
                                />
                                <SelectControl
                                    label={__('Post Date Format', 'advanced-gutenberg')}
                                    value={postDateFormat}
                                    options={[
                                        { label: __('Absolute', 'advanced-gutenberg'), value: 'absolute' },
                                        { label: __('Relative', 'advanced-gutenberg'), value: 'relative' },
                                    ]}
                                    onChange={(value) => { setAttributes({ postDateFormat: value }) }}
                                    className="advgb-child-select"
                                />
                                {postDateFormat === 'absolute' &&
                                    <ToggleControl
                                        label={__('Display Post Time', 'advanced-gutenberg')}
                                        checked={displayTime}
                                        onChange={() => setAttributes({ displayTime: !displayTime })}
                                        className="advgb-child-toggle"
                                    />
                                }

                                {this.isPro() ? (
                                    <>
                                        {postDate !== 'hide' && postDateFormat === 'absolute' &&
                                            <TextControl
                                                label={__('Custom Date Format', 'advanced-gutenberg')}
                                                value={customDateFormat}
                                                placeholder={__('e.g., j F (for "9 July")', 'advanced-gutenberg')}
                                                onChange={(value) => setAttributes({ customDateFormat: value })}
                                                help={__('Use PHP date format. Leave empty for default.', 'advanced-gutenberg')}
                                                className="advgb-child-text"
                                            />
                                        }
                                        {postDate !== 'hide' &&
                                            <Fragment>
                                                <ToggleControl
                                                    label={__('Show Date Prefix', 'advanced-gutenberg')}
                                                    checked={showDatePrefix}
                                                    onChange={() => setAttributes({ showDatePrefix: !showDatePrefix })}
                                                    className="advgb-child-toggle"
                                                />
                                                {showDatePrefix &&
                                                    <Fragment>
                                                        {postDateFormat === 'absolute' &&
                                                            <Fragment>
                                                                <TextControl
                                                                    label={__('Absolute Created Date Prefix', 'advanced-gutenberg')}
                                                                    value={absoluteDateCreatedPrefix}
                                                                    onChange={(value) => setAttributes({ absoluteDateCreatedPrefix: value })}
                                                                    placeholder={__('Posted on', 'advanced-gutenberg')}
                                                                    className="advgb-child-text"
                                                                    help={__('For absolute dates (e.g., "Posted on 9 July")', 'advanced-gutenberg')}
                                                                />
                                                                <TextControl
                                                                    label={__('Absolute Updated Date Prefix', 'advanced-gutenberg')}
                                                                    value={absoluteDateUpdatedPrefix}
                                                                    onChange={(value) => setAttributes({ absoluteDateUpdatedPrefix: value })}
                                                                    placeholder={__('Updated on', 'advanced-gutenberg')}
                                                                    className="advgb-child-text"
                                                                    help={__('For absolute dates (e.g., "Updated on 9 July")', 'advanced-gutenberg')}
                                                                />
                                                            </Fragment>
                                                        }
                                                        {postDateFormat === 'relative' &&
                                                            <Fragment>
                                                                <TextControl
                                                                    label={__('Relative Created Date Prefix', 'advanced-gutenberg')}
                                                                    value={relativeDateCreatedPrefix}
                                                                    onChange={(value) => setAttributes({ relativeDateCreatedPrefix: value })}
                                                                    placeholder={__('Posted', 'advanced-gutenberg')}
                                                                    className="advgb-child-text"
                                                                    help={__('For relative dates (e.g., "Posted 2 hours ago")', 'advanced-gutenberg')}
                                                                />
                                                                <TextControl
                                                                    label={__('Relative Updated Date Prefix', 'advanced-gutenberg')}
                                                                    value={relativeDateUpdatedPrefix}
                                                                    onChange={(value) => setAttributes({ relativeDateUpdatedPrefix: value })}
                                                                    placeholder={__('Updated', 'advanced-gutenberg')}
                                                                    className="advgb-child-text"
                                                                    help={__('For relative dates (e.g., "Updated 2 hours ago")', 'advanced-gutenberg')}
                                                                />
                                                            </Fragment>
                                                        }
                                                    </Fragment>
                                                }
                                            </Fragment>
                                        }
                                    </>
                                ) : (
                                    <>
                                        <div className="advgb-promo-overlay-area">
                                            <div className="advgb-blur">
                                                {postDate !== 'hide' && postDateFormat === 'absolute' &&
                                                    <TextControl
                                                        label={__('Custom Date Format', 'advanced-gutenberg')}
                                                        value={customDateFormat}
                                                        placeholder={__('e.g., j F (for "9 July")', 'advanced-gutenberg')}
                                                        help={__('Use PHP date format. Leave empty for default.', 'advanced-gutenberg')}
                                                        className="advgb-child-text"
                                                    />
                                                }
                                                {postDate !== 'hide' &&
                                                    <Fragment>
                                                        <ToggleControl
                                                            label={__('Show Date Prefix', 'advanced-gutenberg')}
                                                            checked={showDatePrefix}
                                                            className="advgb-child-toggle"
                                                        />
                                                        {showDatePrefix &&
                                                            <Fragment>
                                                                {postDateFormat === 'absolute' &&
                                                                    <Fragment>
                                                                        <TextControl
                                                                            label={__('Absolute Created Date Prefix', 'advanced-gutenberg')}
                                                                            value={absoluteDateCreatedPrefix}
                                                                            placeholder={__('Posted on', 'advanced-gutenberg')}
                                                                            className="advgb-child-text"
                                                                            help={__('For absolute dates (e.g., "Posted on 9 July")', 'advanced-gutenberg')}
                                                                        />
                                                                        <TextControl
                                                                            label={__('Absolute Updated Date Prefix', 'advanced-gutenberg')}
                                                                            value={absoluteDateUpdatedPrefix}
                                                                            placeholder={__('Updated on', 'advanced-gutenberg')}
                                                                            className="advgb-child-text"
                                                                            help={__('For absolute dates (e.g., "Updated on 9 July")', 'advanced-gutenberg')}
                                                                        />
                                                                    </Fragment>
                                                                }
                                                                {postDateFormat === 'relative' &&
                                                                    <Fragment>
                                                                        <TextControl
                                                                            label={__('Relative Created Date Prefix', 'advanced-gutenberg')}
                                                                            value={relativeDateCreatedPrefix}
                                                                            placeholder={__('Posted', 'advanced-gutenberg')}
                                                                            className="advgb-child-text"
                                                                            help={__('For relative dates (e.g., "Posted 2 hours ago")', 'advanced-gutenberg')}
                                                                        />
                                                                        <TextControl
                                                                            label={__('Relative Updated Date Prefix', 'advanced-gutenberg')}
                                                                            value={relativeDateUpdatedPrefix}
                                                                            placeholder={__('Updated', 'advanced-gutenberg')}
                                                                            className="advgb-child-text"
                                                                            help={__('For relative dates (e.g., "Updated 2 hours ago")', 'advanced-gutenberg')}
                                                                        />
                                                                    </Fragment>
                                                                }
                                                            </Fragment>
                                                        }
                                                    </Fragment>
                                                }
                                            </div>
                                            <div className="advgb-pro-overlay-wrap">
                                                <div className="advgb-pro-overlay-text advgb-tooltips ppb-tooltips-library click" data-toggle="ppbtooltip" data-placement="top">
                                                    <span className="advgb-promo-text">
                                                        {__('Pro', 'advanced-gutenberg')}
                                                    </span>
                                                    <span className="tooltip-text">
                                                        <p>
                                                            {__('PublishPress Blocks Pro supports changing date prefix, and setting Custom Date Format.', 'advanced-gutenberg')}
                                                        </p>
                                                        <p>
                                                            <a className="clickable" href="https://publishpress.com/links/blocks-menu" target="_blank">
                                                                {__('Upgrade to Pro', 'advanced-gutenberg')}
                                                            </a>
                                                        </p>
                                                        <i></i>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </Fragment>
                        }
                        {postType === 'post' &&
                            <Fragment>
                                <ToggleControl
                                    label={__('Display Comment Counts', 'advanced-gutenberg')}
                                    checked={displayCommentCount}
                                    onChange={() => setAttributes({ displayCommentCount: !displayCommentCount })}
                                />
                                {displayCommentCount &&
                                    <SelectControl
                                        value={displayCommentCountFor}
                                        options={DISPLAY_FOR}
                                        onChange={(value) => { setAttributes({ displayCommentCountFor: value }) }}
                                        className="advgb-child-select"
                                    />
                                }
                            </Fragment>
                        }
                        {postType === 'post' &&
                            <Fragment>
                                <SelectControl
                                    label={__('Display Category', 'advanced-gutenberg')}
                                    value={showCategories}
                                    options={[
                                        { label: __('Hide', 'advanced-gutenberg'), value: 'hide' },
                                        { label: __('Show', 'advanced-gutenberg'), value: 'show' },
                                        { label: __('Show & Link', 'advanced-gutenberg'), value: 'link' },
                                    ]}
                                    onChange={(value) => { setAttributes({ showCategories: value }) }}
                                />
                                {showCategories !== 'hide' &&
                                    <SelectControl
                                        value={showCategoriesFor}
                                        options={DISPLAY_FOR}
                                        onChange={(value) => { setAttributes({ showCategoriesFor: value }) }}
                                        className="advgb-child-select"
                                    />
                                }
                                <SelectControl
                                    label={__('Display Tags', 'advanced-gutenberg')}
                                    value={showTags}
                                    options={[
                                        { label: __('Hide', 'advanced-gutenberg'), value: 'hide' },
                                        { label: __('Show', 'advanced-gutenberg'), value: 'show' },
                                        { label: __('Show & Link', 'advanced-gutenberg'), value: 'link' },
                                    ]}
                                    onChange={(value) => { setAttributes({ showTags: value }) }}
                                />
                                {showTags !== 'hide' &&
                                    <SelectControl
                                        value={showTagsFor}
                                        options={DISPLAY_FOR}
                                        onChange={(value) => { setAttributes({ showTagsFor: value }) }}
                                        className="advgb-child-select"
                                    />
                                }
                            </Fragment>
                        }
                        {!INBUILT_POST_TYPES.includes(postType) && taxonomyList && taxonomyList.length > 0 &&
                            <Fragment>
                                <FormTokenField
                                    multiple
                                    suggestions={taxonomyList && taxonomyList.length > 0 && taxonomyList.map((tax) => decodeEntities(tax.name))}
                                    value={showCustomTaxList}
                                    label={__('Display these taxonomies', 'advanced-gutenberg')}
                                    onChange={(value) => { this.selectTaxonomies(value); }}
                                />
                                {showCustomTaxList.length > 0 &&
                                    <Fragment>
                                        <SelectControl
                                            value={showCustomTaxListFor}
                                            options={DISPLAY_FOR}
                                            onChange={(value) => { setAttributes({ showCustomTaxListFor: value }) }}
                                            className="advgb-child-select"
                                        />
                                        <ToggleControl
                                            label={__('Link above taxonomies', 'advanced-gutenberg')}
                                            checked={linkCustomTax}
                                            onChange={() => setAttributes({ linkCustomTax: !linkCustomTax })}
                                            className="advgb-child-toggle"
                                        />
                                    </Fragment>
                                }
                            </Fragment>

                        }
                        <ToggleControl
                            label={__('Display Read More Link', 'advanced-gutenberg')}
                            checked={displayReadMore}
                            onChange={() => setAttributes({ displayReadMore: !displayReadMore })}
                        />
                        {displayReadMore &&
                            <Fragment>
                                <SelectControl
                                    value={displayReadMoreFor}
                                    options={DISPLAY_FOR}
                                    onChange={(value) => { setAttributes({ displayReadMoreFor: value }) }}
                                    className="advgb-child-select"
                                />
                                <TextControl
                                    label={__('Read more text', 'advanced-gutenberg')}
                                    value={readMoreLbl}
                                    onChange={(value) => setAttributes({ readMoreLbl: value })}
                                    className="advgb-child-select"
                                />
                            </Fragment>
                        }
                        <ToggleControl
                            label={__('Display Post Excerpt', 'advanced-gutenberg')}
                            checked={displayExcerpt}
                            onChange={() => setAttributes({ displayExcerpt: !displayExcerpt })}
                        />
                        {displayExcerpt &&
                            <Fragment>
                                <SelectControl
                                    value={displayExcerptFor}
                                    options={DISPLAY_FOR}
                                    onChange={(value) => { setAttributes({ displayExcerptFor: value }) }}
                                    className="advgb-child-select"
                                />
                                <ToggleControl
                                    label={__('First Post text as Excerpt', 'advanced-gutenberg')}
                                    help={__('Display some part of first text found in post as excerpt.', 'advanced-gutenberg')}
                                    checked={postTextAsExcerpt}
                                    onChange={() => setAttributes({ postTextAsExcerpt: !postTextAsExcerpt })}
                                    className="advgb-child-toggle"
                                />
                                {postTextAsExcerpt &&
                                    <RangeControl
                                        label={__('Post Text Excerpt length', 'advanced-gutenberg')}
                                        min={50}
                                        max={300}
                                        value={postTextExcerptLength}
                                        onChange={(value) => setAttributes({ postTextExcerptLength: value })}
                                        className="advgb-child-range"
                                    />
                                }
                            </Fragment>
                        }
                        <TextareaControl
                            label={__('Text after title', 'advanced-gutenberg')}
                            help={__('Include text/HTML after title', 'advanced-gutenberg')}
                            value={textAfterTitle}
                            onChange={(value) => setAttributes({ textAfterTitle: value })}
                        />
                        <TextareaControl
                            label={__('Text before read more', 'advanced-gutenberg')}
                            help={__('Include text/HTML before read more', 'advanced-gutenberg')}
                            value={textBeforeReadmore}
                            onChange={(value) => setAttributes({ textBeforeReadmore: value })}
                        />
                    </PanelBody>


                    <Fragment>
                        <>
                            <PanelBody title={__('Info Section Layout', 'advanced-gutenberg')} className="advgb-pro-icon" initialOpen={false}>
                                <>
                                    {this.isPro() ? (
                                        <>
                                            <SelectControl
                                                label={__('Info Section Order', 'advanced-gutenberg')}
                                                value={infoSectionOrder.join(',')}
                                                options={[
                                                    { label: __('Author, Date, Comments', 'advanced-gutenberg'), value: 'author,date,comments' },
                                                    { label: __('Date, Author, Comments', 'advanced-gutenberg'), value: 'date,author,comments' },
                                                    { label: __('Author, Comments, Date', 'advanced-gutenberg'), value: 'author,comments,date' },
                                                    { label: __('Date, Comments, Author', 'advanced-gutenberg'), value: 'date,comments,author' },
                                                    { label: __('Comments, Author, Date', 'advanced-gutenberg'), value: 'comments,author,date' },
                                                    { label: __('Comments, Date, Author', 'advanced-gutenberg'), value: 'comments,date,author' },
                                                ]}
                                                onChange={(value) => setAttributes({ infoSectionOrder: value.split(',') })}
                                            />
                                            <TextControl
                                                label={__('Info Separator', 'advanced-gutenberg')}
                                                value={infoSectionSeparator}
                                                onChange={(value) => setAttributes({ infoSectionSeparator: value })}
                                                placeholder={__('Space', 'advanced-gutenberg')}
                                                help={__('Character(s) to separate info items', 'advanced-gutenberg')}
                                            />
                                            <ToggleControl
                                                label={__('Hide Separators', 'advanced-gutenberg')}
                                                checked={hideInfoSeparators}
                                                onChange={() => setAttributes({ hideInfoSeparators: !hideInfoSeparators })}
                                            />
                                            <ToggleControl
                                                label={__('Remove Date Separator', 'advanced-gutenberg')}
                                                checked={removeDateTimeSeparator}
                                                onChange={() => setAttributes({ removeDateTimeSeparator: !removeDateTimeSeparator })}
                                                help={__('Removes the automatic dash before date when not first element', 'advanced-gutenberg')}
                                            />
                                        </>
                                    ) : (
                                        <div className="advgb-promo-overlay-area">
                                            <div className="advgb-blur">
                                                <SelectControl
                                                    label={__('Info Section Order', 'advanced-gutenberg')}
                                                    value={infoSectionOrder.join(',')}
                                                    options={[
                                                        { label: __('Author, Date, Comments', 'advanced-gutenberg'), value: 'author,date,comments' },
                                                        { label: __('Date, Author, Comments', 'advanced-gutenberg'), value: 'date,author,comments' },
                                                        { label: __('Author, Comments, Date', 'advanced-gutenberg'), value: 'author,comments,date' },
                                                        { label: __('Date, Comments, Author', 'advanced-gutenberg'), value: 'date,comments,author' },
                                                        { label: __('Comments, Author, Date', 'advanced-gutenberg'), value: 'comments,author,date' },
                                                        { label: __('Comments, Date, Author', 'advanced-gutenberg'), value: 'comments,date,author' },
                                                    ]}
                                                />
                                                <TextControl
                                                    label={__('Info Separator', 'advanced-gutenberg')}
                                                    value={infoSectionSeparator}
                                                    placeholder={__('Space', 'advanced-gutenberg')}
                                                    help={__('Character(s) to separate info items', 'advanced-gutenberg')}
                                                />
                                                <ToggleControl
                                                    label={__('Hide Separators', 'advanced-gutenberg')}
                                                    checked={hideInfoSeparators}
                                                />
                                                <ToggleControl
                                                    label={__('Remove Date Separator', 'advanced-gutenberg')}
                                                    checked={removeDateTimeSeparator}
                                                    help={__('Removes the automatic dash before date when not first element', 'advanced-gutenberg')}
                                                />
                                            </div>
                                            <div className="advgb-pro-overlay-wrap">
                                                <div className="advgb-pro-overlay-text advgb-tooltips ppb-tooltips-library click" data-toggle="ppbtooltip" data-placement="top">
                                                    <span className="advgb-promo-text">
                                                        {__('Pro', 'advanced-gutenberg')}
                                                    </span>
                                                    <span className="tooltip-text">
                                                        <p>
                                                            {__('PublishPress Blocks Pro supports reorder of Author, Date, Comments, changing or hidding their separators.', 'advanced-gutenberg')}
                                                        </p>
                                                        <p>
                                                            <a className="clickable" href="https://publishpress.com/links/blocks-menu" target="_blank">
                                                                {__('Upgrade to Pro', 'advanced-gutenberg')}
                                                            </a>
                                                        </p>
                                                        <i></i>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </>
                            </PanelBody>
                        </>
                    </Fragment>
                    {this.isPro() ? (
                        <Fragment>
                            <PanelBody title={__('Reorder Sections', 'advanced-gutenberg')} initialOpen={false} className="advgb-pro-icon">
                                <SelectControl
                                    label={__('Sections order', 'advanced-gutenberg')}
                                    help={__('When the image in desktop floats next to the content, or is displayed as background, the image order is ignored. Also the image order in mobile can be ignored for some views.', 'advanced-gutenberg')}
                                    value={orderSections}
                                    options={ORDER_SECTIONS}
                                    onChange={(value) => setAttributes({ orderSections: value })}
                                />
                            </PanelBody>
                            <></>
                        </Fragment>
                    ) : (
                        <Fragment>
                            <PanelBody title={__('Reorder Sections', 'advanced-gutenberg')} initialOpen={false} className="advgb-pro-icon">
                                <div className="advgb-promo-overlay-area">
                                    <div className="advgb-blur">
                                        <SelectControl
                                            label={__('Sections order', 'advanced-gutenberg')}
                                            help={__('When the image in desktop floats next to the content, or is displayed as background, the image order is ignored. Also the image order in mobile can be ignored for some views.', 'advanced-gutenberg')}
                                            value=""
                                            options={ORDER_SECTIONS}
                                        />
                                    </div>
                                    <div className="advgb-pro-overlay-wrap">
                                        <div className="advgb-pro-overlay-text advgb-tooltips ppb-tooltips-library click" data-toggle="ppbtooltip" data-placement="top">
                                            <span className="advgb-promo-text">
                                                {__('Pro', 'advanced-gutenberg')}
                                            </span>
                                            <span className="tooltip-text">
                                                <p>
                                                    {__('PublishPress Blocks Pro supports reordering the items in the display.', 'advanced-gutenberg')}
                                                </p>
                                                <p>
                                                    <a className="clickable" href="https://publishpress.com/links/blocks-menu" target="_blank">
                                                        {__('Upgrade to Pro', 'advanced-gutenberg')}
                                                    </a>
                                                </p>
                                                <i></i>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </PanelBody>
                            <></>
                        </Fragment>
                    )}
                </InspectorControls>
            );

            const hasPosts = Array.isArray(recentPosts) && recentPosts.length;

            // If no posts found we show this notice
            if (!hasPosts) {
                return (
                    isPreview ?
                        <img alt={__('Content Display', 'advanced-gutenberg')} width='100%' src={previewImageData} />
                        :
                        <Fragment>
                            {inspectorControls}
                            <Placeholder
                                icon={advRecentPostsBlockIcon}
                                label={__('Content Display Block', 'advanced-gutenberg')}
                            >
                                {!Array.isArray(recentPosts) ?
                                    <Spinner /> :
                                    __('No posts found! Try to change filters or publish posts.', 'advanced-gutenberg')
                                }
                            </Placeholder>
                        </Fragment>
                )
            }

            const postViewControls = [
                {
                    icon: 'grid-view',
                    title: __('Grid View', 'advanced-gutenberg'),
                    onClick: () => setAttributes({ postView: 'grid' }),
                    isActive: postView === 'grid',
                },
                {
                    icon: 'list-view',
                    title: __('List View', 'advanced-gutenberg'),
                    onClick: () => setAttributes({ postView: 'list' }),
                    isActive: postView === 'list',
                },
                {
                    icon: 'slides',
                    title: __('Slider View', 'advanced-gutenberg'),
                    onClick: () => setAttributes({ postView: 'slider' }),
                    isActive: postView === 'slider',
                },
                {
                    icon: 'table-row-before',
                    title: __('Frontpage View', 'advanced-gutenberg'),
                    onClick: () => setAttributes({ postView: 'frontpage' }),
                    isActive: postView === 'frontpage',
                },
                {
                    icon: 'admin-site-alt3',
                    title: __('Newspaper View', 'advanced-gutenberg'),
                    onClick: () => {
                        setAttributes({ postView: 'newspaper' });
                        this.newspaperOnChangeLayout(newspaperLayout);
                    },
                    isActive: postView === 'newspaper',
                },
                {
                    icon: 'tagcloud',
                    title: __('Masonry View', 'advanced-gutenberg'),
                    onClick: () => setAttributes({ postView: 'masonry' }),
                    isActive: postView === 'masonry',
                },
            ];

            const blockClassName = [
                id,
                'advgb-recent-posts-block',
                this.state.updating && 'loading',
                postView && postView + '-view',
                postView === 'list' && imagePosition !== 'left' && 'image-' + imagePosition,
                ((postView === 'grid') || (postView === 'masonry')) && 'columns-' + columns,
                postView === 'masonry' && 'tbl-columns-' + columnsT + ' ' + 'mbl-columns-' + columnsM,
                postView === 'slider' && sliderStyle && 'style-' + sliderStyle,
                postView === 'frontpage' && frontpageLayout && 'layout-' + frontpageLayout,
                postView === 'frontpage' && frontpageLayoutT && 'tbl-layout-' + frontpageLayoutT,
                postView === 'frontpage' && frontpageLayoutM && 'mbl-layout-' + frontpageLayoutM,
                ((postView === 'frontpage') || (postView === 'masonry')) && gap && 'gap-' + gap,
                postView === 'frontpage' && frontpageStyle && 'style-' + frontpageStyle,
                postView === 'newspaper' && newspaperLayout && 'layout-' + newspaperLayout,
                advgbBlocks.advgb_pro === '1' && orderSections && 'sections-' + orderSections,
                removeDateTimeSeparator && 'advgb-no-datetime-separator',
            ].filter(Boolean).join(' ');

            return (
                isPreview ?
                    <img alt={__('Content Display', 'advanced-gutenberg')} width='100%' src={previewImageData} />
                    :
                    <Fragment>
                        {inspectorControls}
                        <BlockControls>
                            <ToolbarGroup controls={postViewControls} />
                            <ToolbarGroup>
                                <ToolbarButton
                                    icon="update"
                                    label={__('Refresh', 'advanced-gutenberg')}
                                    onClick={() => setAttributes({ myToken: Math.floor(Math.random() * Math.floor(999)) })}
                                />
                            </ToolbarGroup>
                        </BlockControls>
                        <div className={blockClassName}>
                            {this.state.updating && <div className="advgb-recent-posts-loading" />}
                            <div className="advgb-recent-posts">
                                {recentPosts.map((post, index) => (
                                    <article key={index}
                                        className={`advgb-recent-post ${this.checkElementDisplay('image', index) && (post.featured_img || enablePlaceholderImage) ? "" : "advgb-recent-post--no-image"}`}
                                    >
                                        { /* Output image's HTML inside .advgb-recent-post; orderSections is not allowed for images */}
                                        {(() => {
                                            if (
                                                this.checkElementDisplay('image', index)
                                                && (post.featured_img || enablePlaceholderImage)
                                                && this.getDisplayImageVsOrder(attributes, index) === 'ignore-order'
                                            ) {
                                                return (
                                                    <div className="advgb-post-thumbnail">
                                                        <a href={post.link} target="_blank">
                                                            <img src={post.featured_img ? post.featured_img : advgbBlocks.post_thumb} alt={__('Post Image', 'advanced-gutenberg')} />
                                                            {displayFeaturedImageCaption && post.featured_img_caption.length > 0 && (
                                                                <span class="advgb-post-caption">
                                                                    {post.featured_img_caption}
                                                                </span>
                                                            )}
                                                        </a>
                                                    </div>
                                                )
                                            } else if (
                                                (postView === 'frontpage' && frontpageStyle === 'headline')
                                                || (postView === 'slider' && sliderStyle === 'headline')
                                                && this.getDisplayImageVsOrder(attributes, index) === 'ignore-order'
                                            ) {
                                                return (
                                                    <div className="advgb-post-thumbnail advgb-post-thumbnail-no-image">
                                                        <a href={post.link} target="_blank"></a>
                                                    </div>
                                                )
                                            } else {
                                                { /* Nothing to do here */ }
                                            }
                                        })()}

                                        <div className="advgb-post-wrapper">

                                            { /* Output image's HTML inside .advgb-post-wrapper to allow orderSections for images */}
                                            {(() => {
                                                if (
                                                    this.checkElementDisplay('image', index)
                                                    && (post.featured_img || enablePlaceholderImage)
                                                    && this.getDisplayImageVsOrder(attributes, index) === 'apply-order'
                                                ) {
                                                    return (
                                                        <div className="advgb-post-thumbnail">
                                                            <a href={post.link} target="_blank">
                                                                <img src={post.featured_img ? post.featured_img : advgbBlocks.post_thumb} alt={__('Post Image', 'advanced-gutenberg')} />
                                                                {displayFeaturedImageCaption && post.featured_img_caption.length > 0 && (
                                                                    <span class="advgb-post-caption">
                                                                        {post.featured_img_caption}
                                                                    </span>
                                                                )}
                                                            </a>
                                                        </div>
                                                    )
                                                }
                                            })()}

                                            <h2 className="advgb-post-title">
                                                <a href={post.link} target="_blank">{decodeEntities(post.title.rendered)}</a>
                                            </h2>
                                            {textAfterTitle &&
                                                <RawHTML className="advgb-text-after-title">{textAfterTitle}</RawHTML>
                                            }
                                            {(
                                                (this.checkElementDisplay('author', index) && (
                                                    (post.coauthors && post.coauthors.length > 0)
                                                    || (!post.coauthors || post.coauthors.length === 0))
                                                )
                                                || this.checkElementDisplay('date', index)
                                                || (postType === 'post' && this.checkElementDisplay('comments', index))
                                            ) && (
                                                    <Fragment>
                                                        <div className="advgb-post-info">
                                                            {this.renderInfoSections(post, index)}
                                                        </div>
                                                    </Fragment>
                                                )}
                                            {(
                                                (this.checkElementDisplay('categories', index) && post.tax_additional && post.tax_additional.categories)
                                                || (this.checkElementDisplay('tags', index) && post.tax_additional && post.tax_additional.tags)
                                                || (!INBUILT_POST_TYPES.includes(postType) && post.tax_additional && this.checkElementDisplay('customtax', index))
                                            ) && (
                                                    <Fragment>
                                                        <div className="advgb-post-tax-info">
                                                            {this.checkElementDisplay('categories', index) && post.tax_additional && post.tax_additional.categories && (
                                                                <div className="advgb-post-tax advgb-post-category">
                                                                    {showCategories === 'show' && post.tax_additional.categories.unlinked.map((cat, index) => (
                                                                        <RawHTML>{cat}</RawHTML>
                                                                    ))}
                                                                    {showCategories === 'link' && post.tax_additional.categories.linked.map((cat, index) => (
                                                                        <RawHTML>{cat}</RawHTML>
                                                                    ))}
                                                                </div>
                                                            )}
                                                            {this.checkElementDisplay('tags', index) && post.tax_additional && post.tax_additional.tags && (
                                                                <div className="advgb-post-tax advgb-post-tag">
                                                                    {showTags === 'show' && post.tax_additional.tags.unlinked.map((tag, index) => (
                                                                        <RawHTML>{tag}</RawHTML>
                                                                    ))}
                                                                    {showTags === 'link' && post.tax_additional.tags.linked.map((tag, index) => (
                                                                        <RawHTML>{tag}</RawHTML>
                                                                    ))}
                                                                </div>
                                                            )}
                                                            {!INBUILT_POST_TYPES.includes(postType) && post.tax_additional && this.getTaxSlugs().map((taxSlug) => (
                                                                <div className={"advgb-post-tax advgb-post-cpt advgb-post-" + taxSlug}>
                                                                    {!linkCustomTax && post.tax_additional[taxSlug] && post.tax_additional[taxSlug].unlinked.map((tag, index) => (
                                                                        <RawHTML>{tag}</RawHTML>
                                                                    ))}
                                                                    {linkCustomTax && post.tax_additional[taxSlug] && post.tax_additional[taxSlug].linked.map((tag, index) => (
                                                                        <RawHTML>{tag}</RawHTML>
                                                                    ))}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </Fragment>
                                                )}
                                            <div className="advgb-post-content">
                                                {this.checkElementDisplay('excerpt', index) && (
                                                    <div className="advgb-post-excerpt"
                                                        dangerouslySetInnerHTML={{
                                                            __html: postTextAsExcerpt ? RecentPostsEdit.extractContent(post.content.rendered, postTextExcerptLength) : (post.excerpt ? post.excerpt.raw : '')
                                                        }} />
                                                )}
                                                {textBeforeReadmore &&
                                                    <div className="advgb-text-before-readmore"><RawHTML>{textBeforeReadmore}</RawHTML></div>
                                                }
                                                {this.checkElementDisplay('readmore', index) && (
                                                    <div className="advgb-post-readmore">
                                                        <a href={post.link} target="_blank">{readMoreLbl ? readMoreLbl : __('Read More', 'advanced-gutenberg')}</a>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        </div>
                        <div>
                            <style>
                                {`.${id}.advgb-recent-posts-block.style-headline .advgb-recent-posts .advgb-recent-post .advgb-post-thumbnail {
                                background: ${imageOverlayColor};
                            }
                            .${id}.advgb-recent-posts-block.style-headline .advgb-recent-posts .advgb-recent-post .advgb-post-thumbnail a img {
                                opacity: ${imageOpacity};
                            }`}
                            </style>
                        </div>
                    </Fragment>
            )
        }

        /**
         * Get current include/exclude posts merged with the ones from search
         */
        getMergedPosts() {
            const {
                postsToSearch,
                postsToSearchResolved,
                postsToInclude,
                postsToIncludeResolved,
                postsToExclude,
                postsToExcludeResolved
            } = this.props;

            let mergedPosts = null;
            if (postsToSearchResolved && !postsToIncludeResolved && !postsToExcludeResolved) {
                // Get only searchString
                mergedPosts = postsToSearch;
            } else if (postsToSearchResolved && postsToIncludeResolved && !postsToExcludeResolved) {
                // Get searchString and includePosts
                mergedPosts = postsToSearch.concat(postsToInclude);
            } else if (postsToSearchResolved && !postsToIncludeResolved && postsToExcludeResolved) {
                // Get searchString and excludePosts
                mergedPosts = postsToSearch.concat(postsToExclude);
            } else if (!postsToSearchResolved && postsToIncludeResolved && !postsToExcludeResolved) {
                // Get only includePosts
                mergedPosts = postsToInclude;
            } else if (!postsToSearchResolved && !postsToIncludeResolved && postsToExcludeResolved) {
                // Get only excludePosts
                mergedPosts = postsToExclude;
            } else {
                // Nothing to do here. mergedPosts is null
            }
            return mergedPosts;
        }

        /**
         * Get post titles for include and exclude
         */
        getPostSuggestions(posts, type) {
            const { postsToSearchResolved, postsToIncludeResolved, postsToExcludeResolved } = this.props;

            if ('exclude' === type) {
                return posts !== null ? posts.map((post) => post.title.raw) : [];
            } else if ('include' === type && this.isPro()) {
                return posts !== null && (postsToSearchResolved || postsToIncludeResolved) ? posts.map((post) => post.title.raw) : [];
            } else {
                return null;
            }
        }

        static extractContent(html, length) {
            const span = document.createElement('span');
            span.innerHTML = html;

            // Remove script tag
            const scripts = span.getElementsByTagName('script');
            let j = scripts.length;
            while (j--) {
                scripts[j].parentNode.removeChild(scripts[j]);
            }

            // Remove style tag
            const styles = span.getElementsByTagName('style');
            let k = styles.length;
            while (k--) {
                styles[k].parentNode.removeChild(styles[k]);
            }

            // Remove PublishPress Series box
            const seriesbox = span.getElementsByClassName('seriesmeta');
            if (seriesbox.length === 1) {
                seriesbox[0].parentNode.removeChild(seriesbox[0]);
            }

            const children = span.querySelectorAll('*');
            for (let i = 0; i < children.length; i++) {
                if (children[i].textContent)
                    children[i].textContent += ' ';
                else
                    children[i].innerText += ' ';
            }

            let text = [span.textContent || span.innerText].toString().replace(/\s\s+/g, ' ');
            text = text.slice(0, length).trim();

            if (text.length) text += '…';

            return text;
        };

        selectCategories(tokens) {
            const { categoriesList } = this.state;

            var hasNoSuggestion = tokens.some(function (token) {
                return typeof token === 'string' && !categoriesList[token];
            });

            if (hasNoSuggestion) {
                return;
            }

            var categories = tokens.map(function (token) {
                return typeof token === 'string' ? categoriesList[token] : token;
            })

            this.props.setAttributes({
                categories: categories,
            });
        }

        selectTags(tokens) {
            const { tagsList, tagNameVsId } = this.state;

            var hasNoSuggestion = tokens.some(function (token) {
                return typeof token === 'string' && !tagNameVsId[token];
            });

            if (hasNoSuggestion) {
                return;
            }

            var tags = tokens.map(function (token) {
                return typeof token === 'string' && tagNameVsId[token] ? token : token;
            })

            var tagIds = tokens.map(function (token) {
                return typeof token === 'string' ? tagNameVsId[token] : token.id;
            })

            this.props.setAttributes({
                tags: tags,
                tagIds: tagIds,
            });
        }

        getTagIdsForTags(tags) {
            const { tagNameVsId } = this.state;
            return tags.map((tag) => {
                return tagNameVsId[tag];
            });
        }

        getCategoryForBkwrdCompat(id) {
            const { catIdVsName } = this.state;
            return {
                id: id,
                name: catIdVsName[id]
            };
        }

        getPostTitles(posts, postsToSelect) {
            let field_value = [];
            if (typeof posts !== 'undefined' && postsToSelect !== null) {
                field_value = posts.map((post_id) => {
                    let find_post = postsToSelect.find((post) => {
                        return post.id === post_id;
                    });
                    if (find_post === undefined || !find_post) {
                        return post_id; // It should return false but creates empty selections
                    }
                    return find_post.title.raw;
                });
            }
            return field_value;
        }

        getPostIds(posts, postsToSelect, type) {
            let posts_array = [];
            posts.map(
                (post_title) => {
                    const matching_post = postsToSelect.find((post) => {
                        return post.title.raw === post_title;
                    });
                    if (matching_post !== undefined) {
                        posts_array.push(matching_post.id);
                    }
                }
            )
            const selectType = type + 'Posts';
            this.props.setAttributes({ [selectType]: posts_array });

            if ('include' === type) {
                this.props.setAttributes({ excludePosts: [], showCustomTaxList: [], taxonomies: {}, categories: [], tags: [], author: '', onlyFromCurrentUser: false, offset: 0 });
            }
        }

        handlePostIdsInput(value) {
            this.setState({ postIdsInputValue: value });

            if (!value || value.trim() === '') {
                this.props.setAttributes({ includePosts: [] });
                return;
            }

            const ids = value.split(',')
                .map(id => parseInt(id.trim()))
                .filter(id => !isNaN(id) && id > 0);

            this.props.setAttributes({ includePosts: ids });

            this.props.setAttributes({
                excludePosts: [],
                showCustomTaxList: [],
                taxonomies: {},
                categories: [],
                tags: [],
                author: '',
                onlyFromCurrentUser: false,
                offset: 0
            });
        }

        selectPostByTitle(tokens, type) {
            const { postTitleVsIdMap } = this.state;

            var hasNoSuggestion = tokens.some(function (token) {
                return typeof token === 'string' && (
                    typeof postTitleVsIdMap === 'undefined' || !postTitleVsIdMap[token]
                );
            });

            if (hasNoSuggestion) {
                return;
            }

            var ids = tokens.map(function (token) {
                return typeof token === 'string' ? postTitleVsIdMap[token] : token.id;
            })

            const typeForQuery = type + 'Ids';

            this.props.setAttributes({ [type]: tokens, [typeForQuery]: ids });

            // Exclude posts, backward compatibility 2.13.1 and lower
            this.props.setAttributes({ exclude: [], excludeIds: [], excludePosts: ids });
        }

        updatePostType(postType) {
            this.setState({ taxonomyList: null });
            this.generateTaxFilters(postType);

            this.props.setAttributes({ postType: postType, excludePosts: [], includePosts: [], offset: 0, showCustomTaxList: [], taxonomies: {}, categories: [] });
        }

        /* Check if PP Series plugin is active and enabled for current postType or if is a CPT to call sidebar filters  */
        generateTaxFilters(postType) {
            if (
                typeof advgbBlocks.pp_series_active !== 'undefined' && parseInt(advgbBlocks.pp_series_active)
                && (postType === 'post' || postType === 'page')
                && PP_SERIES_POST_TYPES.includes(postType)
            ) {
                // Enable PublishPress Series taxonomy filter in post/page when enabled through Series plugin
                this.generateSeriesTax(postType);
            } else if (!INBUILT_POST_TYPES.includes(postType)) {
                // Enable CPT taxonomy filters (may include Series taxonomy)
                this.generateTaxTerms(postType);
            } else {
                // Nothing to do here
            }
        }

        /**
         * Generates PublishPress Series taxonomy list for 'post' and sets it in the state as "taxonomyList".
         */
        generateSeriesTax(postType) {
            if (!postType) {
                return;
            }

            // fetch series taxonomy
            wp.apiFetch({
                path: wp.url.addQueryArgs(`wp/v2/types/${postType}`, { context: 'edit' }),
            }).then((typeAttributes) => {
                let taxonomy = [];
                let taxId = {};
                const seriesSlug = typeof advgbBlocks.pp_series_slug !== 'undefined' ? advgbBlocks.pp_series_slug : 'series';

                wp.apiFetch({
                    path: wp.url.addQueryArgs(`wp/v2/taxonomies/${seriesSlug}`, { context: 'edit' }),
                }).then((taxAttributes) => {
                    // fetch all terms
                    wp.apiFetch({
                        path: wp.url.addQueryArgs(`wp/v2/${taxAttributes.rest_base}?per_page=-1&hide_empty=true`, { context: 'edit' }),
                    }).then((terms) => {
                        let suggestions = [];
                        let map = [];
                        terms.forEach(term => {
                            suggestions.push(decodeEntities(term.name));
                            map[decodeEntities(term.name)] = term.id;
                        });

                        const preselectedName = this.props.attributes.taxonomies ? this.props.attributes.taxonomies[seriesSlug] : [];
                        if (preselectedName) {
                            let preselectedId = preselectedName.map(name => map[name]);
                            set(taxId, seriesSlug, preselectedId);
                            this.props.setAttributes({ taxIds: taxId });
                        }

                        taxonomy.push({ slug: seriesSlug, name: decodeEntities(taxAttributes.name), suggestions: suggestions, map: map, hierarchical: taxAttributes.hierarchical });

                        this.setState({ updating: true });
                        // length === 1 due we only get the series taxonomy
                        if (taxonomy.length === 1) {
                            this.setState({ taxonomyList: taxonomy, updating: false });
                        }
                    });
                });
            });
        }

        /**
         * Generates taxonomy list for a post type and sets it in the state as "taxonomyList".
         */
        generateTaxTerms(postType) {
            if (!postType) {
                return;
            }

            // fetch all taxonomies
            wp.apiFetch({
                path: wp.url.addQueryArgs(`wp/v2/types/${postType}`, { context: 'edit' }),
            }).then((typeAttributes) => {
                let taxonomies = [];
                let taxIds = {};
                typeAttributes.taxonomies.forEach(tax => {
                    // fetch taxonomy attributes
                    wp.apiFetch({
                        path: wp.url.addQueryArgs(`wp/v2/taxonomies/${tax}`, { context: 'edit' }),
                    }).then((taxAttributes) => {
                        // fetch all terms
                        wp.apiFetch({
                            path: wp.url.addQueryArgs(`wp/v2/${taxAttributes.rest_base}?per_page=-1&hide_empty=true`, { context: 'edit' }),
                        }).then((terms) => {
                            let suggestions = [];
                            let map = [];
                            terms.forEach(term => {
                                suggestions.push(decodeEntities(term.name));
                                map[decodeEntities(term.name)] = term.id;
                            });

                            const preselectedNames = this.props.attributes.taxonomies ? this.props.attributes.taxonomies[tax] : [];
                            if (preselectedNames) {
                                let preselectedIds = preselectedNames.map(name => map[name]);
                                set(taxIds, tax, preselectedIds);
                                this.props.setAttributes({ taxIds: taxIds });
                            }

                            taxonomies.push({ slug: tax, name: decodeEntities(taxAttributes.name), suggestions: suggestions, map: map, hierarchical: taxAttributes.hierarchical });

                            this.setState({ updating: true });
                            if (typeAttributes.taxonomies.length === taxonomies.length) {
                                // set state only when all taxonomies have been fetched
                                // otherwise the taxonomy boxes will appear one at a time making the page jittery
                                // we will sort the taxonomies so that the boxes are always in a predictable, consistent order
                                this.setState({ taxonomyList: sortBy(taxonomies, ['slug']), updating: false });
                            }
                        });
                    });
                });
            });
        }

        /**
         * Populates the taxonomy terms in the suggestions box.
         */
        populateTaxTerms(tax) {
            const { taxonomies } = this.props.attributes;
            return taxonomies && taxonomies[tax.slug];
        }

        /**
         * Selects the correct the taxonomy term from the suggestions and updates the "taxonomies" attribute.
         */
        selectTaxTerms(tax, tokens) {
            var hasNoSuggestion = tokens.some(function (token) {
                return typeof token === 'string' && !tax.map[token];
            });

            if (hasNoSuggestion) {
                return;
            }

            var suggestions = tokens.map(function (token) {
                return typeof token === 'string' && tax.map[token] ? token : token;
            })

            var ids = tokens.map(function (token) {
                return typeof token === 'string' ? tax.map[token] : token.id;
            })

            let taxonomies = this.props.attributes.taxonomies || {};
            unset(taxonomies, tax.slug);
            if (suggestions) {
                set(taxonomies, tax.slug, suggestions);
            }

            let taxIds = this.props.attributes.taxIds || {};
            unset(taxIds, tax.slug);
            if (ids) {
                set(taxIds, tax.slug, ids);
            }

            this.props.setAttributes({
                taxonomies: taxonomies, // to save in the attributes
                [tax.slug]: suggestions, // to show in the select list
                taxIds: taxIds, // to send in the query
            });
        }

        /**
         * Selects the correct taxonomy from the suggestions and updates the "showCustomTaxList" attribute.
         */
        selectTaxonomies(tokens) {
            const { taxonomyList } = this.state;

            if (!taxonomyList) {
                return;
            }

            let taxList = taxonomyList && taxonomyList.length > 0 && taxonomyList.map((tax) => decodeEntities(tax.name));

            var hasNoSuggestion = tokens.some(function (token) {
                return typeof token === 'string' && !taxList.includes(token);
            });

            if (hasNoSuggestion) {
                return;
            }

            var taxes = tokens.map(function (token) {
                return typeof token === 'string' && taxList[token] ? token : token;
            })

            this.props.setAttributes({
                showCustomTaxList: taxes,
            });
        }

        /**
         * Returns the tax slugs corresponding to the tax names that appear in the suggestions.
         */
        getTaxSlugs() {
            const { taxonomyList } = this.state;
            const { showCustomTaxList } = this.props.attributes;
            if (!taxonomyList || !showCustomTaxList || showCustomTaxList.length === 0) {
                return [];
            }

            var slugs = showCustomTaxList.map((taxName) => {
                var tax = find(taxonomyList, { name: decodeEntities(taxName) });
                if (tax) {
                    return tax.slug;
                }
            });
            return slugs;
        }

        /**
         * Check if elementFor is within the index range.
         */
        checkElementForDisplay(elementFor, index) {
            return (
                elementFor === 'all' || index < elementFor
            );
        }

        /**
         * Check if an element is enabled for each post.
         */
        checkElementDisplay(element, index) {
            const {
                displayFeaturedImage,
                displayFeaturedImageFor,
                displayAuthor,
                displayAuthorFor,
                displayReadMore,
                displayReadMoreFor,
                displayExcerpt,
                displayExcerptFor,
                displayCommentCount,
                displayCommentCountFor,
                postDate,
                postDateFor,
                showCategories,
                showCategoriesFor,
                showTags,
                showTagsFor,
                showCustomTaxList,
                showCustomTaxListFor
            } = this.props.attributes;

            switch (element) {
                case 'image':
                    return (
                        displayFeaturedImage && this.checkElementForDisplay(displayFeaturedImageFor, index)
                    );
                case 'author':
                    return (
                        displayAuthor && this.checkElementForDisplay(displayAuthorFor, index)
                    );
                    break;
                case 'readmore':
                    return (
                        displayReadMore && this.checkElementForDisplay(displayReadMoreFor, index)
                    );
                    break;
                case 'excerpt':
                    return (
                        displayExcerpt && this.checkElementForDisplay(displayExcerptFor, index)
                    );
                    break;
                case 'comments':
                    return (
                        displayCommentCount && this.checkElementForDisplay(displayCommentCountFor, index)
                    );
                    break;
                case 'date':
                    return (
                        postDate !== 'hide' && this.checkElementForDisplay(postDateFor, index)
                    );
                    break;
                case 'categories':
                    return (
                        showCategories !== 'hide' && this.checkElementForDisplay(showCategoriesFor, index)
                    );
                    break;
                case 'tags':
                    return (
                        showTags !== 'hide' && this.checkElementForDisplay(showTagsFor, index)
                    );
                    break;
                case 'customtax':
                    return (
                        this.getTaxSlugs().length > 0 && this.checkElementForDisplay(showCustomTaxListFor, index)
                    );
                    break;
                default:
                    return false;
                    break;
            }
        }

        // Skip images floating on left or right, and with headline style
        getDisplayImageVsOrder(attributes, index) {
            if (
                (
                    (
                        attributes.orderSections === 'default'
                        || attributes.orderSections === 'image-title-info-text'
                    )
                    || (
                        (attributes.postView === 'frontpage' && attributes.frontpageStyle === 'headline')
                        || (attributes.postView === 'slider' && attributes.sliderStyle === 'headline')
                        || attributes.postView === 'list'
                    )
                    || (
                        attributes.postView === 'newspaper'
                        && (
                            (['np-2', 'np-3-1', 'np-3-2', 'np-3-3'].indexOf(attributes.newspaperLayout) > -1)
                            || index > 0
                        )
                    )
                ) || advgbBlocks.advgb_pro === '0'
            ) {
                return 'ignore-order';
            } else {
                return 'apply-order';
            }
        }

        refreshOnChangeItems(numberOfPosts) {
            const { postView, myToken } = this.props.attributes;
            this.props.setAttributes({ numberOfPosts: numberOfPosts });

            if (postView === 'masonry') {
                this.props.setAttributes({ myToken: Math.floor(Math.random() * Math.floor(999)) });
            }
        }

        newspaperOnChangeLayout(newspaperLayout) {
            const { numberOfPosts } = this.props.attributes;
            const currentLayout = NEWSPAPER_LAYOUTS.find(layout => layout.layout === newspaperLayout);
            this.props.setAttributes({ numberOfPosts: currentLayout.items });
        }

        getDateTime(post) {
            const { postDate, postDateFormat, displayTime, customDateFormat, showDatePrefix, absoluteDateCreatedPrefix, absoluteDateUpdatedPrefix, relativeDateCreatedPrefix, relativeDateUpdatedPrefix } = this.props.attributes;

            if (postDateFormat === 'absolute') {
                if (customDateFormat && customDateFormat.trim() !== '') {
                    const dateValue = postDate === 'created' ? dateI18n(customDateFormat, post.date) : dateI18n(customDateFormat, post.modified);

                    if (showDatePrefix) {
                        const prefix = postDate === 'created' ? (absoluteDateCreatedPrefix || 'Posted on') : (absoluteDateUpdatedPrefix || 'Updated on');
                        return prefix + ' ' + dateValue;
                    }
                    return dateValue;
                }

                let dateText;
                if (postDate === 'created') {
                    dateText = displayTime ? post.absolute_dates_time.created : post.absolute_dates.created;
                } else {
                    dateText = displayTime ? post.absolute_dates_time.modified : post.absolute_dates.modified;
                }

                if (showDatePrefix) {
                    const currentPrefix = postDate === 'created' ? 'Posted on' : 'Updated on';
                    const newPrefix = postDate === 'created' ? (absoluteDateCreatedPrefix || 'Posted on') : (absoluteDateUpdatedPrefix || 'Updated on');
                    dateText = dateText.replace(currentPrefix, newPrefix);
                } else {
                    dateText = dateText.replace(/^(Posted on|Updated on)\s+/, '');
                }

                return dateText;
            } else {
                let relativeText = postDate === 'created' ? post.relative_dates.created : post.relative_dates.modified;

                if (showDatePrefix) {
                    const currentPrefix = postDate === 'created' ? 'Posted' : 'Updated';
                    const newPrefix = postDate === 'created' ? (relativeDateCreatedPrefix || 'Posted') : (relativeDateUpdatedPrefix || 'Updated');
                    relativeText = relativeText.replace(currentPrefix, newPrefix);
                } else {
                    relativeText = relativeText.replace(/^(Posted|Updated)\s+/, '');
                }

                return relativeText;
            }
        }

    }

    registerBlockType('advgb/recent-posts', {
        title: __('Content Display - PublishPress', 'advanced-gutenberg'),
        description: __('Displays your content in grid, list, slider, frontpage, newspaper, and masonry views with beautiful layouts and styles.', 'advanced-gutenberg'),
        icon: {
            src: advRecentPostsBlockIcon,
            foreground: typeof advgbBlocks !== 'undefined' ? advgbBlocks.color : undefined,
        },
        category: 'advgb-category',
        keywords: [
            __('recent posts', 'advanced-gutenberg'),
            __('latest posts', 'advanced-gutenberg'),
            __('posts slide', 'advanced-gutenberg'),
            __('posts grid', 'advanced-gutenberg'),
            __('posts', 'advanced-gutenberg'),
            __('pages', 'advanced-gutenberg')
        ],
        supports: {
            html: false,
        },
        example: {
            attributes: {
                isPreview: true
            },
        },
        edit: withSelect((select, props) => {
            const { getEntityRecords, hasFinishedResolution } = select('core');
            const { categories, tagIds, tags, category, order, orderBy, numberOfPosts, myToken, postType, excludeCurrentPost, excludePosts, includePosts, offset, author, taxonomies, taxIds, onlyFromCurrentUser, searchString } = props.attributes;

            const catIds = categories && categories.length > 0 ? categories.map((cat) => cat.id) : [];

            // We need to check if we're in post edit or widgets screen
            const postId = wp.data.select('core/editor') && wp.data.select('core/editor').getCurrentPostId();
            const recentPostsQuery = pickBy({
                categories: catIds,
                tags: tagIds,
                order,
                orderby: orderBy,
                per_page: numberOfPosts,
                token: myToken,
                exclude: excludeCurrentPost ? (excludePosts ? union(excludePosts, [postId]) : postId) : excludePosts,
                include: includePosts,
                offset,
                author: onlyFromCurrentUser ? wp.data.select('core').getCurrentUser().id : author,
            }, (value) => !isUndefined(value) && !(isArray(value) && (isNull(value) || value.length === 0)));

            let filterTaxNames = [];
            if (taxIds) {
                Object.keys(taxIds).map(taxSlug => {
                    filterTaxNames.push(taxSlug);
                    recentPostsQuery[taxSlug] = taxIds[taxSlug];
                });
            }

            const queryFields = ['id', 'title'];

            // Search posts
            const postsToSearchQuery = pickBy({ _fields: queryFields, per_page: 10, search: `"${searchString}"`, orderby: 'title', order: 'desc' }, (value) => !isUndefined(value));
            const postsToSearch = advgbBlocks.advgb_pro !== 'undefined' && advgbBlocks.advgb_pro === '1' && typeof searchString !== 'undefined' && searchString.length > 0
                ? getEntityRecords(
                    'postType',
                    postType ? postType : 'post',
                    postsToSearchQuery
                ) : null;
            const postsToSearchResolved = hasFinishedResolution('getEntityRecords', [
                'postType',
                postType ? postType : 'post',
                postsToSearchQuery
            ]);

            // Include posts
            const postsToIncludeQuery = pickBy({ _fields: queryFields, per_page: -1, include: includePosts }, (value) => !isUndefined(value));
            const postsToInclude = advgbBlocks.advgb_pro !== 'undefined' && advgbBlocks.advgb_pro === '1' && typeof includePosts !== 'undefined' && includePosts.length > 0
                ? getEntityRecords(
                    'postType',
                    postType ? postType : 'post',
                    postsToIncludeQuery
                ) : null;
            const postsToIncludeResolved = hasFinishedResolution('getEntityRecords', [
                'postType',
                postType ? postType : 'post',
                postsToIncludeQuery
            ]);

            // Exclude posts
            const postsToExcludeQuery = pickBy({ _fields: queryFields, per_page: -1, include: excludePosts }, (value) => !isUndefined(value));
            const postsToExclude = typeof excludePosts !== 'undefined' && excludePosts.length > 0
                ? getEntityRecords(
                    'postType',
                    postType ? postType : 'post',
                    postsToExcludeQuery
                ) : null;
            const postsToExcludeResolved = hasFinishedResolution('getEntityRecords', [
                'postType',
                postType ? postType : 'post',
                postsToExcludeQuery
            ]);

            // Modifying filters from main query for Exclude post suggestions
            let postSuggestionsQuery = omit(recentPostsQuery, ['exclude']);
            postSuggestionsQuery.per_page = typeof excludePosts !== 'undefined' && excludePosts.length > 0 ? numberOfPosts + excludePosts.length : numberOfPosts;
            postSuggestionsQuery._fields = queryFields;

            return {
                recentPosts: getEntityRecords('postType', postType ? postType : 'post', recentPostsQuery),
                postList: getEntityRecords('postType', postType ? postType : 'post', postSuggestionsQuery),
                postsToSearch,
                postsToSearchResolved,
                postsToInclude,
                postsToIncludeResolved,
                postsToExclude,
                postsToExcludeResolved
            }
        })(RecentPostsEdit),
        save: function () { // Render in PHP
            return null;
        },
    })
})(wp.i18n, wp.blocks, wp.element, wp.blockEditor, wp.components, wp.data, lodash, wp.htmlEntities, wp.date);
